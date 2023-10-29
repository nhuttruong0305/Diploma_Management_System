import Header from '../Header/Header'
import Select from "react-select";
import './ImportDiploma.css';
import Toast from '../Toast/Toast';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getAllDiplomaIssuanceByMU, addDiploma, editDiplomaInImportDiploma, searchDiplomaWithMultiCondition, deleteDiploma} from '../../redux/apiRequest';
import Footer from '../Footer/Footer';
import * as XLSX from 'xlsx';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
export default function ImportDiploma(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    //state để chứa all MU
    const [allMU, setAllMU] = useState();
    //state để lưu management_unit của user
    const [managementUnitId, setManagementUnitId] = useState();

    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllMU(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }
    
    //state này để lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select có id select-DiplomaName-ID
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]); 
    //options cho component Select có id select-DiplomaName-ID và select có id = select-diplomaName-in-formadd-ID
    const [options, setOptions] = useState([]); 
    //state đại diện cho all đợt cấp văn bằng lấy từ redux dùng cho select có id select-DiplomaIssuance-ID
    const allDiplomaIssuance = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.allDiplomaIssuances); 
    

    //Đầu tiên lấy all diploma issuance từ redux ra, rồi dựa theo selected option của
    //Select chọn tên văn bằng để lọc ra các đợt cấp văn bằng

    //state này để chứa các đợt cấp văn bằng của 1 loại văn bằng cụ thể
    const [listOfDiplomaIssuance, setListOfDiplomaIssuance] = useState([]);
    //state này để chứa options của Select có id select-DiplomaIssuance-ID
    const [optionsOfDiplomIssuance, setOptionsOfDiplomIssuance] = useState();
    //state để lưu selectedOption của component Select tên văn bằng
    const [selectedOptionDiplomaName, setSelectedOptionDiplomaName] = useState();

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            let result = []
            res.data.forEach((currentValue)=>{
                if(user.listOfDiplomaNameImport.includes(currentValue.diploma_name_id)){
                    result = [...result, currentValue];
                }
            })
            setAllDiplomaNameByMU(result);
        }catch(error){
            console.log(error);
        }
    }
    
    //Gọi useEffect để lấy ra tất cả các văn bằng được quản lý bởi management_unit của tài khoản
    //Và tất cả đợt cấp văn bằng của các tên văn bằng đó
    useEffect(()=>{
        getAllDiplomaNameByMU(user.management_unit);
        getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        getAllManagementUnit();
        getAllMajorsShowModal();
    },[])

    useEffect(()=>{
        allMU?.forEach((currentValue)=>{
            if(currentValue.management_unit_id == user.management_unit){
                setManagementUnitId({
                    management_unit_id: user.management_unit,
                    management_unit_name: currentValue.management_unit_name
                })
            }
        })
    }, [allMU]);

    //Gọi useEffect khi state allDiplomaNameByMU thay đổi thì set lại state options
    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptions(resultOption);
    }, [allDiplomaNameByMU])

    const handleChangeSelectedOptionDiplomaName = (selectedOption) => {
        setSelectedOptionDiplomaName(selectedOption);
    };

    //Gọi useEffect để khi select option thay đổi thì các select của tên đợt cấp văn bằng thay đổi
    useEffect(()=>{
        setSelectedOptionDiplomaIssuance("");
        let result = [];
        if(selectedOptionDiplomaName != undefined){
            allDiplomaIssuance.forEach((currentValue) => {
                if(currentValue.diploma_name_id == selectedOptionDiplomaName.value){
                    result = [...result, currentValue];
                }
            })
            setListOfDiplomaIssuance(result);
        };
    }, [selectedOptionDiplomaName]);

    //Tạo option cho select có id = select-DiplomaIssuance-ID
    useEffect(()=>{
        let resultOption = [];
        listOfDiplomaIssuance?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfDiplomIssuance(resultOption);
    }, [listOfDiplomaIssuance])
    
    //state đại diện cho selectedOption của đợt cấp văn bằng được chọn của select có id = select-DiplomaIssuance-ID
    const [selectedOptionDiplomaIssuance, setSelectedOptionDiplomaIssuance] = useState();

    const handleChangeSelectedOptionDiplomaIssuance = (selectedOption) => {
        setSelectedOptionDiplomaIssuance(selectedOption)
    }

    //Phần dưới là xử logic cho việc thêm văn bằng
    //state này đại diện cho tên văn bằng được chọn trong form add văn bằng

    // 1. State đầu tiền cần để thêm 1 văn bằng là management_unit_id
    // 2. State thứ 2 cần để thêm 1 văn bằng selectedDiplomaNameInFormAdd (nhớ lấy thuộc tính value thôi)
    const [selectedDiplomaNameInFormAdd, setSelectedDiplomaNameInFormAdd] = useState("");
    const handleChangeDiplomaNameInFormAdd = (selectedOption) => {
        setSelectedDiplomaNameInFormAdd(selectedOption);
    }

    //state này đại diện cho đợt cấp văn bằng được chọn trong form và thay đổi dựa trên selectedDiplomaNameInFormAdd
    const [listOfDiplomaIssuanceInFormAdd, setListOfDiplomaIssuanceInFormAdd] = useState([]);
    const [optionDiplomaIssuanceInFormAdd, setOptionDiplomaIssuanceInFormAdd] = useState([]);

    // 3. State thứ 3 cần để thêm 1 văn bằng selectedDiplomaIssuanceInFormAdd (nhớ lấy thuộc tính value thôi)
    const [selectedDiplomaIssuanceInFormAdd, setSelectedDiplomaIssuanceInFormAdd] = useState();
    
    const handleChangeDiplomaIssuanceInFormAdd = (selectedOption) => {
        setSelectedDiplomaIssuanceInFormAdd(selectedOption);
    }

    useEffect(()=>{
        setSelectedDiplomaIssuanceInFormAdd("");
        let result = [];
        if(selectedDiplomaNameInFormAdd!=undefined){
            allDiplomaIssuance?.forEach((currentValue) => {
                if(currentValue.diploma_name_id == selectedDiplomaNameInFormAdd.value){
                    result = [...result, currentValue];
                }
            });
            setListOfDiplomaIssuanceInFormAdd(result);
            allDiplomaNameByMU?.forEach((currentValue)=>{
                if(currentValue.diploma_name_id == selectedDiplomaNameInFormAdd.value){
                    setOptionsOfDiplomaName(currentValue.options);
                }
            })
        }
    }, [selectedDiplomaNameInFormAdd]);

    useEffect(()=>{
        let resultOption = [];
        listOfDiplomaIssuanceInFormAdd?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionDiplomaIssuanceInFormAdd(resultOption);
    }, [listOfDiplomaIssuanceInFormAdd])

    //4. State họ tên người được cấp
    const [fullNameOfTheGrantee, setFullNameOfTheGrantee] = useState("");
    //5. Giới tính
    const [sex, setSex] = useState();
    const handleChangeSex = (selectedOption) => {
        setSex(selectedOption);
    }

    //6. Ngày sinh
    const [dateofbirth, setDateofbirth] = useState("");

    //7. Nơi sinh
    const [address, setAddress] = useState("");

    //8. CCCD
    const [cccdAdd, setCCCDAdd] = useState("");

    //9. Ngày ký
    const [signDay, setSignDay] = useState("");

    //10. Số hiệu
    const [diplomaNumber, setDiplomaNumber] = useState("");

    //11. Số vào sổ
    const [numbersIntoTheNotebook, setNumbersIntoTheNotebook] = useState('');


    //Các state dưới là thông tin thêm
    //12. Điểm trắc nghiệm
    const [diemTNAdd, setDiemTNAdd] = useState("");
    //13. Điểm thực hành 
    const [diemTHAdd, setDiemTHAdd] = useState("");
    //14. Nghe
    const [ngheAdd, setNgheAdd] = useState("");
    //15. Nói
    const [noiAdd, setNoiAdd] = useState("");
    //16. Đọc
    const [docAdd, setDocAdd] = useState("");
    //17. Viết
    const [vietAdd, setVietAdd] = useState("");
    //18. Ngày thi
    const [testDay, setTestDay] = useState("");
    //19. Năm tốt nghiệp, state này có kiểu là string
    const [graduationYear, setGraduationYear] = useState("");
    //20. Xếp loại: nên nhập text hay chọn select
    const [classification, setClassification] = useState("");
    const handleChangeClassification = (selectedOption) => {
        setClassification(selectedOption);
    }
    //21. Ngành
    //State chứa all majors trong db dùng để làm options cho select ngành trong form add và edit diploma
    const [allMajorInDB, setAllMajorInDB] = useState([]);
    const [optionMajor, setOptionMajor] = useState([]);
    const getAllMajorsShowModal = async () =>{
        try{
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorInDB(result.data); 
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        let resultOption = [];
        allMajorInDB?.forEach((currentValue)=>{
            const newOption = {value: currentValue.majors_id, label: currentValue.majors_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionMajor(resultOption);      
    }, [allMajorInDB])

    const [majorAdd, setMajorAdd] = useState(null);
    const handleChangeMajorAdd = (selectedOption) => {
        setMajorAdd(selectedOption)
    }
    //22. Hội đồng thi
    const [councilAdd, setCouncilAdd] = useState("");
    //State chứa trường options của tên văn bằng được chọn trong select có id ='select-diplomaName-in-formadd-ID' trong form thêm mới văn bằng
    const [optionsOfDiplomaName, setOptionsOfDiplomaName] = useState(null);
    

    //Các Ref để hiện thông báo và focus vào input
    const noti = useRef();
    const diplomaNameInFormAddRef = useRef();

    const noti2 = useRef();
    const diplomaIssuanceInFormAddRef = useRef();

    const noti3 = useRef();
    const fullnameInFormAdd = useRef();

    const noti4 = useRef();
    const sexRef = useRef();

    const noti5 = useRef();
    const dateOfBirthRef = useRef();

    const noti6 = useRef();
    const addressRef = useRef();

    const noti7 = useRef();
    const testDayRef = useRef();

    const noti16 = useRef();
    const councilAddRef = useRef()

    const noti8 = useRef();
    const classificationRef = useRef();

    const noti9 = useRef();
    const graduationYearRef = useRef();

    const noti10 = useRef();
    const signDayRef = useRef();

    const noti11 = useRef();
    const diplomaNumberRef= useRef();

    const noti12 = useRef();
    const numbersIntoTheNotebookRef = useRef();

    const noti23 = useRef();
    const cccdAddRef = useRef();

    const noti24 = useRef();
    const diemTNAddRef = useRef();

    const msg = useSelector((state)=> state.diploma?.msg);
    const isError = useSelector((state)=> state.diploma.diplomas?.error);
    const noti13 = useRef();
    
    const allDiplomaByListOfDiplomaNameImport = useSelector((state) => state.diploma.diplomas?.allDiploma);

    //Các state để tìm kiếm văn bằng
    const [nameSearch, setNameSearch] = useState("");
    const [numberDiplomaNumberSearch, setNumberDiplomaNumberSearch] = useState("");
    const [numberInNoteBookSearch, setNumberInNoteBookSearch] = useState("");
    const [statusDiplomaSearch, setStatusDiplomaSearch] = useState();
    
    const handleChangeStatusDiplomaSearch = (selectedOption) => {
        setStatusDiplomaSearch(selectedOption);
    }
    useEffect(()=>{
        searchDiplomaWithMultiCondition(dispatch, 
                                        user.management_unit, 
                                        nameSearch, 
                                        numberDiplomaNumberSearch, 
                                        numberInNoteBookSearch, 
                                        selectedOptionDiplomaName?.value, 
                                        selectedOptionDiplomaIssuance?.value,
                                        user.listOfDiplomaNameImport,
                                        statusDiplomaSearch?.value);
    }, [selectedOptionDiplomaName?.value, 
        selectedOptionDiplomaIssuance?.value, 
        nameSearch, 
        numberDiplomaNumberSearch, 
        numberInNoteBookSearch, 
        statusDiplomaSearch]);


    const submitAddNewDiploma = async (e) => {
        e.preventDefault();
        //Kiểm tra tên văn bằng phải được chọn
        if(selectedDiplomaNameInFormAdd == "" || selectedDiplomaNameInFormAdd == undefined){
            noti.current.showToast();
            diplomaNameInFormAddRef.current.focus();
            return;
        }
        //Kiểm tra đợt cấp văn bằng có được chọn
        if(selectedDiplomaIssuanceInFormAdd == "" || selectedDiplomaIssuanceInFormAdd == undefined){
            noti2.current.showToast();
            diplomaIssuanceInFormAddRef.current.focus();
            return;
        }
        //Kiểm tra xem họ tên được nhập chưa
        if(fullNameOfTheGrantee == ""){
            noti3.current.showToast();
            fullnameInFormAdd.current.focus();
            return;
        }
        //Kiểm tra xem giới tính được chọn chưa
        if(sex == undefined){
            noti4.current.showToast();
            sexRef.current.focus();
            return;
        }
        //Kiểm tra xem ngày sinh đã được nhập chưa
        if(dateofbirth == "" || dateofbirth == undefined){
            noti5.current.showToast();
            dateOfBirthRef.current.focus();
            return;
        }
        //Kiểm tra xem nơi sinh được nhập chưa
        if(address == "" || address == undefined){
            noti6.current.showToast();
            addressRef.current.focus();
            return;
        }
        //Kiểm tra xem nhập CCCD chưa
        if(cccdAdd == ""){
            noti23.current.showToast();
            cccdAddRef.current.focus();
            return;
        }
        //Kiểm tra xem có chọn ngày ký chưa
        if(signDay == "" || signDay == undefined){
            noti10.current.showToast();
            signDayRef.current.focus();
            return;
        }
        //Kiểm tra xem số hiệu đã được nhập chưa
        if(diplomaNumber == "" || diplomaNumber == undefined){
            noti11.current.showToast();
            diplomaNumberRef.current.focus();
            return;
        }
        //Kiểm tra xem số vào sổ được nhập chưa
        if(numbersIntoTheNotebook == "" || numbersIntoTheNotebook == undefined){
            noti12.current.showToast();
            numbersIntoTheNotebookRef.current.focus();
            return;
        }
        //Kiểm tra xem có chọn ngày kiểm tra chưa
        // if(testDay == "" || testDay == undefined){
        //     noti7.current.showToast();
        //     testDayRef.current.focus();
        //     return;
        // }
        // //Kiểm tra xem ngày xếp loại được nhập chưa
        // if(classification == "" || classification == undefined){
        //     noti8.current.showToast();
        //     classificationRef.current.focus();
        //     return;
        // }
        // //Kiểm tra xem chọn năm tốt nghiệp chưa
        // if(graduationYear == "" || graduationYear == undefined){
        //     noti9.current.showToast();
        //     graduationYearRef.current.focus();
        //     return;
        // }
        

        const newDiploma = {
            management_unit_id: managementUnitId?.management_unit_id,//2
            diploma_name_id: selectedDiplomaNameInFormAdd?.value,//3
            diploma_issuance_id:selectedDiplomaIssuanceInFormAdd?.value,//4
            fullname: fullNameOfTheGrantee,//5
            sex: sex?.value,//6
            dateofbirth: dateofbirth,//7
            address: address,//8
            cccdAdd: cccdAdd,//9
            sign_day: signDay,//10
            diploma_number: diplomaNumber,//11
            numbersIntoTheNotebook: numbersIntoTheNotebook,//12
            diemTNAdd: diemTNAdd,//13
            diemTHAdd: diemTHAdd,//14
            ngheAdd: ngheAdd,//15
            noiAdd: noiAdd,//16
            docAdd: docAdd,//17
            vietAdd: vietAdd,//18
            test_day: testDay,//19
            graduationYear: parseInt(graduationYear), //20. ép kiểu thành number
            classification: classification?.value,//21
            majorAdd: majorAdd?.value,//22
            council: councilAdd,//23

            mscb_import: user?.mssv_cb,
            officer_name_import: user?.fullname
        }
        await addDiploma(dispatch, user.accessToken, newDiploma);
        noti13.current.showToast();
        setTimeout(()=>{
            searchDiplomaWithMultiCondition(dispatch, user.management_unit, nameSearch, numberDiplomaNumberSearch, numberInNoteBookSearch, selectedOptionDiplomaName?.value, selectedOptionDiplomaIssuance?.value,user.listOfDiplomaNameImport, statusDiplomaSearch?.value);
        },3000);
    }
    
    //Phần dưới là logic và các state cho việc edit văn bằng
    // 1. Họ tên người được cấp
    const [nameOfTheGranteeEdit, setNameOfTheGranteeEdit] = useState("");
    // 2. Giới tính
    const [sexEdit, setSexEdit] = useState();
    // 3. Ngày sinh
    const [dateofbirthEdit, setDateofbirthEdit] = useState("");
    // 4. Nơi sinh
    const [addressEdit, setAddressEdit] = useState("");
    // CCCD
    const [CCCDEdit, setCCCDEdit] = useState("");
    // 5. Ngày kiểm tra
    const [testDayEdit, setTestDayEdit] = useState("");
    // Hội đồng
    const [councilEdit, setCouncilEdit] = useState("");
    // 6. Xếp loại
    const [classificationEdit, setClassificationEdit] = useState("");
    // 7. Năm tốt nghiệp
    const [graduationYearEdit, setGraduationYearEdit] = useState("");
    // 8. Ngày ký
    const [signDayEdit, setSignDayEdit] = useState(""); 
    // 9. Số hiệu
    const [diplomaNumberEdit, setDiplomaNumberEdit] = useState("");
    // 10. Số vào sổ
    const [numberInNoteEdit, setNumberInNoteEdit] = useState("");
    //Điểm tn
    const [diemTNEdit, setDiemTNEdit] = useState("");
    //Điểm thực hành
    const [diemTHEdit, setDiemTHEdit] = useState("");
    //Điểm nghe
    const [diemNgheEdit, setDiemNgheEdit] = useState("");
    //Điểm nói
    const [diemNoiEdit, setDiemNoiEdit] = useState("");
    //Điểm đọc
    const [diemDocEdit, setDiemDocEdit] = useState("");
    //Điểm viết
    const [diemVietEdit, setDiemVietEdit] = useState("");
    //Ngành đào tạo
    const [majorEdit, setMajorEdit] = useState("");
    const handleChangeMajorEdit = (selectedOption) => {
        setMajorEdit(selectedOption);
    }


    // 11. _id của văn bằng muốn chỉnh sửa
    const [_idDiplomaEdit, set_IdDiplomaEdit] = useState(""); 
    // 12. diploma_name_id để lấy các văn bằng cùng loại và kiểm tra các điều kiện
    const [diploma_name_idEdit, setDiploma_name_idEdit] = useState("");
    // 13. state này để quyết định xem văn bằng được sửa và xóa không hay chỉ được xem
    const [editOrOnlyView, setEditOrOnlyView] = useState(false);

    const noti14 = useRef();
    const msgEdit = useSelector((state) => state.diploma?.msgEdit);
    const isErrorEdit = useSelector((state) => state.diploma.diplomas?.error);

    //hàm submit edit văn bằng
    const handleSubmitEdit = async (e) =>{
        e.preventDefault();

        if(nameOfTheGranteeEdit == ""){
            noti3.current.showToast();
            return;
        }
        if(dateofbirthEdit == ""){
            noti5.current.showToast();
            return;
        }
        if(addressEdit == ""){
            noti6.current.showToast();
            return;
        }
        // if(testDayEdit == ""){
        //     noti7.current.showToast();
        //     return;
        // }
        // if(graduationYearEdit == ""){
        //     noti9.current.showToast();
        //     return;
        // }
        if(signDayEdit == ""){
            noti10.current.showToast();
            return;
        }
        if(diplomaNumberEdit == ""){
            noti11.current.showToast();
            return;
        }
        if(numberInNoteEdit == ""){
            noti12.current.showToast();
            return;
        }

        const diplomaUpdate = {
            fullname: nameOfTheGranteeEdit,
            sex: sexEdit, 
            dateofbirth: dateofbirthEdit,
            address: addressEdit,
            cccd: CCCDEdit,
            sign_day: signDayEdit,
            diploma_number: diplomaNumberEdit,
            numbersIntoTheNotebook: numberInNoteEdit,
   
            diem_tn: diemTNEdit,
            diem_th: diemTHEdit,
            nghe: diemNgheEdit,
            noi: diemNoiEdit,
            doc: diemDocEdit,
            viet: diemVietEdit,
            test_day: testDayEdit,
            graduationYear: graduationYearEdit,
            classification: classificationEdit,
            nganh_dao_tao: majorEdit?.value,
            council: councilEdit,
        }

        await editDiplomaInImportDiploma(dispatch, user.accessToken, _idDiplomaEdit, diploma_name_idEdit, diplomaUpdate);
        noti14.current.showToast();
        setTimeout( async ()=>{
            await searchDiplomaWithMultiCondition(dispatch, user.management_unit, nameSearch, numberDiplomaNumberSearch, numberInNoteBookSearch, selectedOptionDiplomaName?.value, selectedOptionDiplomaIssuance?.value,user.listOfDiplomaNameImport, statusDiplomaSearch?.value);
        },3000);
    }

    const noti15 = useRef();
    const msgDelete = useSelector((state) => state.diploma?.msgDelete);
    const isErrorDelete = useSelector((state) => state.diploma.diplomas?.error);

    const handleDeleteDiploma = async () =>{
        // console.log("_id của diploma cần xóa: ", _idDiplomaEdit);
        // console.log(typeof _idDiplomaEdit);
        await deleteDiploma(dispatch, user?.accessToken, _idDiplomaEdit);
        noti15.current.showToast();
        setTimeout( async ()=>{
            await searchDiplomaWithMultiCondition(dispatch, user.management_unit, nameSearch, numberDiplomaNumberSearch, numberInNoteBookSearch, selectedOptionDiplomaName?.value, selectedOptionDiplomaIssuance?.value,user.listOfDiplomaNameImport, statusDiplomaSearch?.value);
        },1000);
    }

    //Hàm tạo file excel mẫu để download
    function createAndDownloadExcel() {
        // Tạo dữ liệu bạn muốn đưa vào tệp Excel
        const data = [
            {
                stt:'',
                fullname:"",
                sex:"",
                dateofbirth:"",
                address:"",
                cccd:"",
                sign_day:"",
                diploma_number:"",
                numbersIntoTheNotebook:"",
                diem_tn:"",
                diem_th:"",
                nghe:"",
                noi:"",
                doc:"",
                viet:"",
                test_day:"",
                graduationYear:"",
                classification:"",
                nganh_dao_tao:"",
                council:""
            }
        ];
        // Tạo một Workbook và một Worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['A1'] = { v: 'STT', t: 's' };
        worksheet['B1'] = { v: 'Họ tên người được cấp', t: 's' };
        worksheet['C1'] = { v: 'Giới tính', t: 's' };
        worksheet['D1'] = { v: 'Ngày sinh', t: 's' };
        worksheet['E1'] = { v: 'Nơi sinh', t: 's' };
        worksheet['F1'] = { v: 'CCCD', t: 's' };
        worksheet['G1'] = { v: 'Ngày ký', t: 's' };
        worksheet['H1'] = { v: 'Số hiệu', t: 's' };
        worksheet['I1'] = { v: 'Số vào sổ', t: 's' };
        worksheet['J1'] = { v: 'Điểm trắc nghiệm', t: 's' };
        worksheet['K1'] = { v: 'Điểm thực hành', t: 's' };
        worksheet['L1'] = { v: 'Điểm kỹ năng nghe', t: 's' };
        worksheet['M1'] = { v: 'Điểm kỹ năng nói', t: 's' };
        worksheet['N1'] = { v: 'Điểm kỹ năng đọc', t: 's' };
        worksheet['O1'] = { v: 'Điểm kỹ năng viết', t: 's' };
        worksheet['P1'] = { v: 'Ngày thi', t: 's' };
        worksheet['Q1'] = { v: 'Năm tốt nghiệp', t: 's' };
        worksheet['R1'] = { v: 'Xếp loại', t: 's' };
        worksheet['S1'] = { v: 'Ngành đào tạo', t: 's' };
        worksheet['T1'] = { v: 'Hội đồng thi', t: 's' };

        // Thêm Worksheet vào Workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Chuyển đổi Workbook thành dạng binary
        var wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        // Chuyển đổi dạng binary thành ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        }
        // Tạo một Blob từ ArrayBuffer
        var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Tạo một URL cho Blob
        var url = URL.createObjectURL(blob);

        // Tạo một đường link tải xuống
        var link = document.createElement('a');
        link.href = url;
        link.download = 'output.xlsx';

        // Thêm đường link vào DOM và tự động kích hoạt sự kiện click để tải xuống
        // export_excel_btn.append(link);
        link.click();
        // document.body.removeChild(link);

    }

    //Các state này dùng cho form chọn tên văn bằng và đợt cấp văn bằng khi import
    const [selectedDiplomaNameImport, setSelectedDiplomaNameImport] = useState("");
    const handleChangeDiplomaNameImport = (selectedOption) => {
        setSelectedDiplomaNameImport(selectedOption);
    }
    
    const [optionDiplomaIssuanceImport, setOptionDiplomaIssuanceImport] = useState([]);
    const [listDiplomaIssuanceImport, setListDiplomaIssuanceImport] = useState([]);
    const [selectedDiplomaIssuanceImport, setSelectedDiplomaIssuanceImport] = useState("");
    const handleChangeIssuanceImport = (selectedOption) => {
        setSelectedDiplomaIssuanceImport(selectedOption);
    }    

    useEffect(()=>{
        setSelectedDiplomaIssuanceImport("");
        let result = [];
        if(selectedDiplomaNameImport!=undefined && selectedDiplomaNameImport!=""){
            allDiplomaIssuance?.forEach((currentValue)=>{
                if(currentValue.diploma_name_id == selectedDiplomaNameImport.value){
                    result = [...result, currentValue];
                }
            });
            getAllDiplomaByDiplomaNameID(selectedDiplomaNameImport.value); 
        }
        setListDiplomaIssuanceImport(result);
        
    }, [selectedDiplomaNameImport])

    useEffect(()=>{
        let resultOption = [];
        listDiplomaIssuanceImport?.forEach((currentValue) => {
            const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionDiplomaIssuanceImport(resultOption);
    }, [listDiplomaIssuanceImport])

    //state để ẩn/hiện form import
    const [showImport, setShowImport] = useState(false);

    //Xử lý việc import file
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileData = event.target.result;
                const workbook = XLSX.read(fileData, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });                
                setData(parsedData);
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    const noti17 = useRef();
    const noti18 = useRef();
    const noti21 = useRef();

    //Hàm lấy ra all diploma thuộc loại được chọn ở selectedDiplomaNameImport
    const [allDiplomaByDiplomaNameID, setAllDiplomaByDiplomaNameID] = useState([]);

    //Hàm call api lấy ra all diploma của 1 loại diploma_name_id
    const getAllDiplomaByDiplomaNameID = async (diploma_name_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma/get_all_diploma_by_diploma_name_id/${diploma_name_id}`);
            setAllDiplomaByDiplomaNameID(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //state lưu mảng các diploma trong file excel bị trùng số hiệu
    const [danhSachTrungSoHieu, setDanhSachTrungSoHieu] = useState([]);
    //state lưu mảng các diploma trong file excel bị trùng số vào sổ
    const [danhSachTrungSoVaoSo, setDanhSachTrungSoVaoSo] = useState([]);
    const noti19 = useRef();
    const noti20 = useRef();
    const noti22 = useRef();

    const handleImportDiplomaExcel = async() => {
        //Check xem đã chọn tên văn bằng chưa
        if(selectedDiplomaNameImport=="" || selectedDiplomaNameImport==undefined){
            noti17.current.showToast();
            return;
        }
        //Check xem đã chọn đợt cấp văn bằng chưa
        if(selectedDiplomaIssuanceImport=="" || selectedDiplomaIssuanceImport==undefined){
            noti18.current.showToast();
            return;
        }

        if(file==null){
            noti21.current.showToast();
            return;
        }

        //Biến này sẽ là true nếu có 1 văn bằng trùng số hiệu hoặc số vào sổ
        let isFault = false;

        //Check kiểm tra trùng số hiệu
        let listDiplomaTrungSoHieu = [];
        //Check kiểm tra trùng số vào sổ
        let listDiplomaTrungSoVaoSo = [];

        let allDataInExcel = [];        
        for(let i = 1; i<data.length; i++){
            let gioiTinh = false;
            if(data[i][2] == "Nam"){
                gioiTinh = true;
            }else{
                gioiTinh = false;
            }
            //Xử lý ngày sinh
            const dateOfBirthExcel = new Date((data[i][3] - 25569) * 86400 * 1000);
            let monthOfdateOfBirthExcel;
            if(dateOfBirthExcel.getMonth() + 1 < 10){
                monthOfdateOfBirthExcel = `0${dateOfBirthExcel.getMonth() + 1}`;
            }else{
                monthOfdateOfBirthExcel=dateOfBirthExcel.getMonth() + 1
            }
            let dayOfdateOfBirthExcel;
            if(dateOfBirthExcel.getDate() < 10){
                dayOfdateOfBirthExcel = `0${dateOfBirthExcel.getDate()}`;
            }else{
                dayOfdateOfBirthExcel = dateOfBirthExcel.getDate();
            }
            //Xử lý ngày thi
            let resultTestDay;
            if(data[i][15] != undefined){
                const dateTestDay = new Date((data[i][15] - 25569) * 86400 * 1000);
                let monthOfdateTestDay="";
                if(dateTestDay.getMonth() + 1 < 10){
                    monthOfdateTestDay = `0${dateTestDay.getMonth() + 1}`;
                }else{
                    monthOfdateTestDay = dateTestDay.getMonth() + 1;
                }
                let dayOfdateTestDay="";
                if(dateTestDay.getDate() < 10){
                    dayOfdateTestDay = `0${dateTestDay.getDate()}`;
                }else{
                    dayOfdateTestDay = dateTestDay.getDate();
                }
                resultTestDay=`${dateTestDay.getFullYear()}-${monthOfdateTestDay}-${dayOfdateTestDay}`;
            }else{
                resultTestDay="";
            }
            //Xử lý ngày ký
            const signDayExcel = new Date((data[i][6] - 25569) * 86400 * 1000);
            let monthOfSignDay;
            if(signDayExcel.getMonth() + 1 < 10){
                monthOfSignDay = `0${signDayExcel.getMonth() + 1}`;
            }else{
                monthOfSignDay = signDayExcel.getMonth() + 1;
            }
            let dayOfSignDay;
            if(signDayExcel.getDate() < 10){
                dayOfSignDay = `0${signDayExcel.getDate()}`;
            }else{
                dayOfSignDay = signDayExcel.getDate();
            }

            //Xử lý ngành đào tạo
            let nganh_dao_tao;
            allMajorInDB?.forEach((currentValue)=>{
                if(data[i][18] == currentValue.majors_name){
                    nganh_dao_tao = currentValue.majors_id;
                }
            })
            allDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == data[i][7]){
                    listDiplomaTrungSoHieu = [...listDiplomaTrungSoHieu, i];
                    isFault = true;
                }
            })
            setDanhSachTrungSoHieu(listDiplomaTrungSoHieu);
            
            allDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.numbersIntoTheNotebook == data[i][8]){
                    listDiplomaTrungSoVaoSo = [...listDiplomaTrungSoVaoSo, i];
                    isFault = true;
                }
            })
            setDanhSachTrungSoVaoSo(listDiplomaTrungSoVaoSo);

            const newDiplomaObject = {
                management_unit_id: user.management_unit,
                diploma_name_id: selectedDiplomaNameImport?.value,
                diploma_issuance_id:selectedDiplomaIssuanceImport?.value,
                fullname: data[i][1],
                sex: gioiTinh,
                dateofbirth: `${dateOfBirthExcel.getFullYear()}-${monthOfdateOfBirthExcel}-${dayOfdateOfBirthExcel}`,
                address: data[i][4],
                cccdAdd: data[i][5],
                sign_day: `${signDayExcel.getFullYear()}-${monthOfSignDay}-${dayOfSignDay}`,
                diploma_number: data[i][7],
                numbersIntoTheNotebook: data[i][8],
                diemTNAdd: data[i][9],
                diemTHAdd: data[i][10],
                ngheAdd: data[i][11],
                noiAdd: data[i][12],
                docAdd: data[i][13],
                vietAdd: data[i][14],
                test_day: resultTestDay,
                graduationYear: parseInt(data[i][16]), //ép kiểu thành number
                classification: data[i][17],
                majorAdd: nganh_dao_tao,
                council: data[i][19],
                mscb_import: user.mssv_cb,
                officer_name_import: user.fullname
            }
            allDataInExcel = [...allDataInExcel, newDiplomaObject];
        }     
            
        if(isFault){
            return;
        }else{
            for(let j = 0; j < allDataInExcel.length; j++){
                await addDiploma(dispatch, user.accessToken, allDataInExcel[j]);
            }
            noti22.current.showToast();
            setTimeout(()=>{
                searchDiplomaWithMultiCondition(dispatch, user.management_unit, nameSearch, numberDiplomaNumberSearch, numberInNoteBookSearch, selectedOptionDiplomaName?.value, selectedOptionDiplomaIssuance?.value,user.listOfDiplomaNameImport, statusDiplomaSearch?.value);
            },3000);    
            setFile(null);
            console.log((allDataInExcel));
        }
    }
    useLayoutEffect(()=>{
        if(danhSachTrungSoHieu.length>0){
            noti19.current.showToast();
        }
    }, [danhSachTrungSoHieu]);

    useLayoutEffect(()=>{
        if(danhSachTrungSoVaoSo.length>0){
            noti20.current.showToast();
        }
    }, [danhSachTrungSoVaoSo]);

    //Phần dưới xử lý logic cho việc phân trang
    const [page, setPage] = useState(1);
    const [allDiplomaByListOfDiplomaNameImportShow, setAllDiplomaByListOfDiplomaNameImportShow] = useState([]);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && allDiplomaByListOfDiplomaNameImport!=undefined){
            if(allDiplomaByListOfDiplomaNameImport.length>5){
                const numberOfPage = Math.ceil(allDiplomaByListOfDiplomaNameImport?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allDiplomaByListOfDiplomaNameImport.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allDiplomaByListOfDiplomaNameImport[i]];
                }
                setAllDiplomaByListOfDiplomaNameImportShow(result);
            }else{
                setAllDiplomaByListOfDiplomaNameImportShow(allDiplomaByListOfDiplomaNameImport);
            }         
        }
    });

    return(
        <>
            <Header/> 
            <div className="container" id='body-import-diploma'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-md-6">
                                {/* Select chọn tên văn bằng */}
                                <Select
                                    id='select-DiplomaName-ID'
                                    options={options}
                                    placeholder="Chọn tên văn bằng"
                                    onChange={handleChangeSelectedOptionDiplomaName}
                                    value={selectedOptionDiplomaName}
                                />
                            </div>
                            <div className="col-md-6">
                                <Select
                                    id='select-DiplomaIssuance-ID'
                                    options = {optionsOfDiplomIssuance}
                                    value={selectedOptionDiplomaIssuance}
                                    onChange={handleChangeSelectedOptionDiplomaIssuance}
                                    placeholder="Chọn đợt cấp văn bằng"
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='d-flex justify-content-start'>
                                <div className='ms-3'>
                                    <button 
                                        style={{width: '110px', backgroundColor: '#00abeb'}} 
                                        className='btn'
                                        type='button'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#addDiplomaModal"
                                    >Thêm mới</button>
                                </div>
                                <div className='ms-3'>
                                    <button 
                                        style={{width: '110px', backgroundColor: '#fed25c'}} 
                                        className='btn'
                                        onClick={(e)=>{
                                            setShowImport(!showImport)
                                        }}
                                    >Import</button>
                                </div>
                                <div className='ms-3'>
                                    <button 
                                        style={{width: '110px', backgroundColor: '#297fbb'}} 
                                        className='btn'
                                        onClick={(e)=>{
                                            createAndDownloadExcel();
                                        }}
                                    >Mẫu Import</button>
                                </div>
                            </div>
                        </div>

                        {/* Form import */}
                        {
                            showImport ? (
                                            <div className="row mt-2 p-3" id='form-add-diploma-import'>
                                                <div className="col-6">
                                                    <div className="card p-3">
                                                        <div className="row">
                                                            <div className="col-4">Tên đơn vị quản lý</div>
                                                            <div className="col-8">{managementUnitId?.management_unit_name}</div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-4">Tên văn bằng</div>
                                                            <div className="col-8">
                                                                <Select
                                                                    id='select-diplomaName-import'
                                                                    options={options}
                                                                    placeholder="Chọn tên văn bằng"
                                                                    value={selectedDiplomaNameImport}
                                                                    onChange={handleChangeDiplomaNameImport}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="col-4">Đợt cấp văn bằng</div>
                                                            <div className="col-8">
                                                                <Select
                                                                    id='select-diplomaIssuance-import'
                                                                    options={optionDiplomaIssuanceImport}
                                                                    placeholder="Chọn đợt cấp văn bằng"
                                                                    value={selectedDiplomaIssuanceImport}
                                                                    onChange={handleChangeIssuanceImport}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="file" className="form-control" 
                                                                    id="inputGroupFile04" 
                                                                    aria-describedby="inputGroupFileAddon04" 
                                                                    aria-label="Upload"
                                                                    accept=".xlsx" 
                                                                    onChange={handleFileChange}
                                                                />
                                                                <button 
                                                                    className="btn btn-outline-secondary" 
                                                                    type="button" 
                                                                    id="inputGroupFileAddon04"
                                                                    onClick={(e)=>{
                                                                        handleImportDiplomaExcel()
                                                                    }}
                                                                >Thêm văn bằng</button>
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                            ) : (
                                ""
                            )
                        }
                        <div className='row mt-2 p-3'>
                            <div className='col-md-3'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc theo họ tên'
                                    className='form-control'  
                                    value={nameSearch}  
                                    onChange={(e)=>{
                                        setNameSearch(e.target.value)
                                    }}
                                />
                            </div>
                            <div className='col-md-2'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc số hiệu'
                                    className='form-control'    
                                    value={numberDiplomaNumberSearch}
                                    onChange={(e)=>{
                                        setNumberDiplomaNumberSearch(e.target.value)
                                    }}
                                />
                            </div>
                            <div className='col-md-2'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc số vào sổ'
                                    className='form-control'  
                                    value={numberInNoteBookSearch}
                                    onChange={(e)=>{
                                        setNumberInNoteBookSearch(e.target.value)
                                    }}
                                />
                            </div>
                            <div className='col-md-3'>
                                <Select
                                    placeholder='Chọn trạng thái văn bằng'
                                    options={
                                        [
                                            { value: "", label: "Tất cả trạng thái"},
                                            { value: "Chờ duyệt", label: "Chờ duyệt" },
                                            { value: "Đã duyệt", label: "Đã duyệt" },
                                            { value: "Không duyệt", label: "Không duyệt" }
                                        ]
                                    }
                                    value={statusDiplomaSearch}
                                    onChange={handleChangeStatusDiplomaSearch}
                                />
                            </div>
                        </div>

                        <div className="row mt-2 p-4">
                            <div 
                                // className='table-wrapper table-responsive'
                                id='contain-table-show-diploma-ID'
                                
                                >
                                <table 
                                    className="table table-bordered"
                                    id='table-show-diploma-ID'
                                >
                                    <thead>
                                        <tr>
                                            <th style={{width: '50px'}} scope="col"></th>
                                            <th scope="col">STT</th>
                                            <th scope="col">Tên văn bằng</th>
                                            <th scope="col">Họ tên</th>
                                            <th scope="col">Giới tính</th>
                                            <th scope="col">Ngày sinh</th>
                                            <th scope="col">Nơi sinh</th>
                                            <th scope="col">CCCD</th>
                                            <th scope="col">Ngày ký</th>
                                            <th scope="col">Số hiệu</th>
                                            <th scope="col">Số vào sổ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaByListOfDiplomaNameImportShow?.map((currentValue, index)=>{
                                                let gioiTinhInTable;
                                                if(currentValue.sex){
                                                    gioiTinhInTable = "Nam"
                                                }else{
                                                    gioiTinhInTable = "Nữ"
                                                }

                                                let ten_van_bang = "";
                                                allDiplomaNameByMU?.forEach((element)=>{
                                                    if(element.diploma_name_id == currentValue.diploma_name_id){
                                                        ten_van_bang = element.diploma_name_name;
                                                    }
                                                })
                                                return(
                                                    <tr key={index}>
                                                        <td 
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editDiplomaModal"
                                                            style={{textAlign: 'center'}}
                                                            onClick={(e)=>{
                                                                allDiplomaNameByMU?.forEach((element)=>{
                                                                    if(element.diploma_name_id == currentValue.diploma_name_id){
                                                                        setOptionsOfDiplomaName(element.options);
                                                                    }
                                                                })

                                                                allMajorInDB?.forEach((element)=>{
                                                                    if(element.majors_id == currentValue.nganh_dao_tao){
                                                                        setMajorEdit({value: currentValue.nganh_dao_tao, label: element.majors_name});
                                                                    }
                                                                })

                                                                setNameOfTheGranteeEdit(currentValue.fullname);
                                                                setSexEdit(currentValue.sex);
                                                                setDateofbirthEdit(currentValue.dateofbirth);
                                                                setAddressEdit(currentValue.address);
                                                                setCCCDEdit(currentValue.cccd);
                                                                setSignDayEdit(currentValue.sign_day);
                                                                setDiplomaNumberEdit(currentValue.diploma_number);
                                                                setNumberInNoteEdit(currentValue.numbersIntoTheNotebook);

                                                                setDiemTNEdit(currentValue.diem_tn);
                                                                setDiemTHEdit(currentValue.diem_th);
                                                                setDiemNgheEdit(currentValue.nghe);
                                                                setDiemNoiEdit(currentValue.noi);
                                                                setDiemDocEdit(currentValue.doc);
                                                                setDiemVietEdit(currentValue.viet);

                                                                setTestDayEdit(currentValue.test_day);
                                                                setGraduationYearEdit(currentValue.graduationYear);
                                                                setClassificationEdit(currentValue.classification);
                                                                
                                                                setCouncilEdit(currentValue.council);
                                                                
                                                                set_IdDiplomaEdit(currentValue._id);
                                                                setDiploma_name_idEdit(currentValue.diploma_name_id);
                                                                if(currentValue.status == "Chờ duyệt"){
                                                                    setEditOrOnlyView(true);
                                                                }else{
                                                                    setEditOrOnlyView(false);
                                                                }
                                                            }}
                                                        ><i 
                                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                            className="fa-solid fa-eye"></i></td>
                                                        <th scope="row" style={{textAlign: 'center'}}>{index + 1}</th>
                                                        <td>{ten_van_bang}</td>
                                                        <td>{currentValue.fullname}</td>
                                                        <td>{gioiTinhInTable}</td>
                                                        <td>{currentValue.dateofbirth}</td>
                                                        <td>{currentValue.address}</td>
                                                        <td>{currentValue.cccd}</td>
                                                        <td>{currentValue.sign_day}</td>
                                                        <td>{currentValue.diploma_number}</td>
                                                        <td>{currentValue.numbersIntoTheNotebook}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <Stack spacing={2}>
                                {/* <Typography className='text-center'>Trang: {page}</Typography> */}
                                <Pagination 
                                    count={Math.ceil(allDiplomaByListOfDiplomaNameImport?.length/5)}
                                    variant="outlined"
                                    page={page}
                                    onChange={handleChange}
                                    color="info"
                                    />
                            </Stack>
                        </div>
                        {/* Modal chỉnh sửa hoặc xóa thông tin văn bằng */}
                        <div className="modal fade" id="editDiplomaModal" tabIndex="-1" aria-labelledby="editDiplomaModalLabel" aria-hidden="true">
                            <div className="modal-lg modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="editDiplomaModalLabel">Thông tin văn bằng</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form
                                        id='edit-or-delete-diploma'
                                        onSubmit={(e)=>{
                                            handleSubmitEdit(e)
                                        }}
                                    >
                                        <div className="row">
                                            <div className='col-3'>
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >   
                                                    Họ tên người được cấp
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    className='form-control'
                                                    value={nameOfTheGranteeEdit}
                                                    onChange={(e)=>{
                                                        setNameOfTheGranteeEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Giới tính</label>
                                            </div>
                                            <div className="col-9">
                                                <select
                                                    value={sexEdit}
                                                    onChange={(e)=>{
                                                        setSexEdit(e.target.value)
                                                    }}
                                                    className='form-control'
                                                >
                                                    <option value={true}>Nam</option>
                                                    <option value={false}>Nữ</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Ngày sinh
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="date" 
                                                    className='form-control'
                                                    value={dateofbirthEdit}
                                                    onChange={(e)=>{
                                                        setDateofbirthEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Nơi sinh</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    className='form-control'
                                                    value={addressEdit}
                                                    onChange={(e)=>{
                                                        setAddressEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >CCCD</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    className='form-control'
                                                    value={CCCDEdit}
                                                    onChange={(e)=>{
                                                        setCCCDEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Ngày ký</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="date" 
                                                    className='form-control'
                                                    value={signDayEdit}
                                                    onChange={(e)=>{
                                                        setSignDayEdit(e.target.value)
                                                    }}    
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Số hiệu
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    className='form-control'
                                                    value={diplomaNumberEdit}
                                                    onChange={(e)=>{
                                                        setDiplomaNumberEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Số vào sổ
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    className='form-control'
                                                    value={numberInNoteEdit}
                                                    onChange={(e)=>{
                                                        setNumberInNoteEdit(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {
                                            optionsOfDiplomaName?.includes(1) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm trắc nghiệm
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemTNEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemTNEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(2) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm thực hành
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemTHEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemTHEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(3) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm kỹ năng nghe
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemNgheEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemNgheEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(4) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm kỹ năng nói
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemNoiEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemNoiEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(5) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm kỹ năng đọc
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemDocEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemDocEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(6) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Điểm kỹ năng viết
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemVietEdit}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemVietEdit(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(7) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >Ngày thi</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="date" 
                                                                className='form-control'
                                                                value={testDayEdit}
                                                                onChange={(e)=>{
                                                                    setTestDayEdit(e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(8) ? (
                                                <div className="row mt-2">
                                                    <div className="col-3">
                                                        <label
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontStyle: 'italic' }}
                                                        >
                                                            Năm tốt nghiệp</label>
                                                    </div>
                                                    <div className="col-9">
                                                        <input 
                                                            type="number" 
                                                            className='form-control'
                                                            value={graduationYearEdit}
                                                            onChange={(e)=>{
                                                                setGraduationYearEdit(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(9) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Xếp loại
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <select
                                                                value={classificationEdit}
                                                                onChange={(e)=>{
                                                                    setClassificationEdit(e.target.value)
                                                                }}
                                                                className='form-control'
                                                            >
                                                                <option value="Xuất sắc">Xuất sắc</option>
                                                                <option value="Giỏi">Giỏi</option>
                                                                <option value="Khá">Khá</option>
                                                                <option value="Trung bình">Trung bình</option>
                                                                <option value="Yếu">Yếu</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(10) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >
                                                                Ngành đào tạo
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <Select
                                                                options={optionMajor}
                                                                value={majorEdit}
                                                                onChange={handleChangeMajorEdit}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(11) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                className='col-form-label text-end d-block'
                                                                style={{ fontStyle: 'italic' }}
                                                            >Hội đồng thi</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="text" 
                                                                className='form-control'
                                                                value={councilEdit}
                                                                onChange={(e)=>{
                                                                    setCouncilEdit(e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }    
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    {
                                        editOrOnlyView ? (
                                            <>
                                                <button 
                                                    type="submit"
                                                    form='edit-or-delete-diploma' 
                                                    className="btn btn-primary"
                                                >Sửa</button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-danger"
                                                    onClick={(e)=>{
                                                        handleDeleteDiploma()
                                                    }}
                                                >Xóa</button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-secondary" 
                                                    data-bs-dismiss="modal"
                                                >Hủy bỏ</button>
                                            </>
                                        ) : (
                                            <button 
                                                    type="button" 
                                                    className="btn btn-secondary" 
                                                    data-bs-dismiss="modal"
                                                >Hủy bỏ</button>
                                        )
                                    }
                                </div>
                                </div>
                            </div>
                        </div>


                        {/* Modal thêm mới 1 văn bằng */}
                        <div className="modal fade" id="addDiplomaModal" tabIndex="-1" aria-labelledby="addDiplomaModalLabel" aria-hidden="true">
                            <div className="modal-lg modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="addDiplomaModalLabel">Thêm văn bằng</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form 
                                        id='form-add-diploma-IP'
                                        onSubmit={(e)=>{
                                            submitAddNewDiploma(e)
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Tên đơn vị quản lý
                                                </label>
                                            </div>
                                            <div className='col-9'>
                                                <p style={{fontWeight: 'bold', marginTop: '7px'}}>{managementUnitId?.management_unit_name}</p>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    htmlFor='select-diplomaName-in-formadd-ID'
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Tên văn bằng</label>
                                            </div>
                                            <div className='col-9'>
                                                <Select
                                                    id='select-diplomaName-in-formadd-ID'
                                                    ref={diplomaNameInFormAddRef}
                                                    options={options}
                                                    placeholder='Chọn tên văn bằng'
                                                    value={selectedDiplomaNameInFormAdd}
                                                    onChange={handleChangeDiplomaNameInFormAdd}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Đợt cấp văn bằng
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <Select
                                                    placeholder='Chọn đợt cấp văn bằng'
                                                    // id=''
                                                    ref={diplomaIssuanceInFormAddRef}
                                                    options={optionDiplomaIssuanceInFormAdd}
                                                    value={selectedDiplomaIssuanceInFormAdd}
                                                    onChange={handleChangeDiplomaIssuanceInFormAdd}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Họ tên người được cấp
                                                </label>
                                            </div>
                                            <div className='col-9'>
                                                <input 
                                                    type="text" 
                                                    ref={fullnameInFormAdd}
                                                    value={fullNameOfTheGrantee}
                                                    onChange={(e)=>{
                                                        setFullNameOfTheGrantee(e.target.value);
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Giới tính </label>
                                            </div>
                                            <div className='col-9'>
                                                <Select
                                                    options={
                                                        [
                                                            { value: true, label: "Nam" },
                                                            { value: false, label: "Nữ" },
                                                        ]
                                                    }
                                                    value={sex}
                                                    ref={sexRef}
                                                    placeholder="Chọn giới tính"
                                                    onChange={handleChangeSex}
                                                />
                                            </div>
                                        </div>
                                        <div className='row mt-2'>
                                            <div className="col-3">
                                                <label 
                                                    htmlFor=""
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'
                                                >Ngày sinh 
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="date"
                                                    className='form-control' 
                                                    value={dateofbirth}
                                                    ref={dateOfBirthRef}
                                                    onChange={(e)=>{
                                                        setDateofbirth(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    htmlFor='address-in-form-adddiploma'
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'
                                                >Nơi sinh</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    id='address-in-form-adddiploma'
                                                    type="text" 
                                                    value={address}
                                                    ref={addressRef}
                                                    className='form-control'
                                                    onChange={(e)=>{
                                                        setAddress(e.target.value);
                                                    }}
                                                    />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    htmlFor='cccd-in-form-adddiploma'
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'
                                                >CCCD</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    id='cccd-in-form-adddiploma'
                                                    value={cccdAdd}
                                                    ref={cccdAddRef}
                                                    className='form-control'
                                                    onChange={(e)=>{
                                                        setCCCDAdd(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block' 
                                                >Ngày ký</label>
                                            </div>
                                            <div className='col-9'>
                                                <input 
                                                    type="date" 
                                                    ref={signDayRef}
                                                    className='form-control'
                                                    value={signDay}
                                                    onChange={(e)=>{
                                                        setSignDay(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className='col-3'>
                                                <label
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'
                                                >Số hiệu</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    ref={diplomaNumberRef}
                                                    type="text" 
                                                    value={diplomaNumber}
                                                    onChange={(e)=>{
                                                        setDiplomaNumber(e.target.value)
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'
                                                >Số vào sổ</label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    ref={numbersIntoTheNotebookRef}
                                                    className='form-control'
                                                    value={numbersIntoTheNotebook}
                                                    onChange={(e)=>{
                                                        setNumbersIntoTheNotebook(e.target.value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Các state dưới là thông tin thêm*/}
                                        {
                                            optionsOfDiplomaName?.includes(1) ? (
                                                <>
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm trắc nghiệm
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemTNAdd}
                                                                ref={diemTNAddRef}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemTNAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("") 
                                        }
                                        {
                                            optionsOfDiplomaName?.includes(2) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm thực hành
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={diemTHAdd}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDiemTHAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div> 
                                                </>
                                            ) : ("")
                                        }
                                        
                                        {
                                            optionsOfDiplomaName?.includes(3) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm kỹ năng nghe
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={ngheAdd}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setNgheAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(4) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm kỹ năng nói
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={noiAdd}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setNoiAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(5) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm kỹ năng đọc
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={docAdd}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setDocAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(6) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Điểm kỹ năng viết
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                className='form-control'
                                                                value={vietAdd}
                                                                onChange={(e)=>{
                                                                    const value = parseFloat(e.target.value);
                                                                    if(!isNaN(value)){
                                                                        setVietAdd(value);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(7) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'   
                                                            >
                                                                Ngày thi
                                                            </label>
                                                        </div>
                                                        <div className='col-9'>
                                                            <input 
                                                                type="date" 
                                                                value={testDay}
                                                                ref={testDayRef}
                                                                className='form-control'
                                                                onChange={(e)=>{
                                                                    setTestDay(e.target.value)
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(8) ? (
                                                <>      
                                                    <div className='row mt-2'>
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block' 
                                                            >Năm tốt nghiệp</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="number" 
                                                                ref={graduationYearRef}
                                                                value={graduationYear}
                                                                onChange={(e)=>{
                                                                    setGraduationYear(e.target.value)
                                                                }}
                                                                className='form-control'    
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(9) ? (
                                                <>      
                                                    <div className='row mt-2'>
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'  
                                                            >Xếp loại</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <Select
                                                                options={
                                                                    [
                                                                        {value: 'Xuất sắc', label: "Xuất sắc"},
                                                                        {value: 'Giỏi', label: "Giỏi"},
                                                                        {value: 'Khá', label: "Khá"},
                                                                        {value: 'Trung bình', label: "Trung bình"},
                                                                        {value: 'Yếu', label: "Yếu"}
                                                                    ]
                                                                }
                                                                ref={classificationRef}
                                                                value={classification}
                                                                onChange={handleChangeClassification}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(10) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label 
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block'  
                                                            >Ngành đào tạo</label>
                                                        </div>
                                                        <div className="col-9">
                                                            <Select
                                                                options={optionMajor}
                                                                value={majorAdd}
                                                                onChange={handleChangeMajorAdd}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }

                                        {
                                            optionsOfDiplomaName?.includes(11) ? (
                                                <>      
                                                    <div className="row mt-2">
                                                        <div className="col-3">
                                                            <label
                                                                style={{ fontStyle: 'italic' }}
                                                                className='col-form-label text-end d-block' 
                                                            >
                                                                Hội đồng thi
                                                            </label>
                                                        </div>
                                                        <div className="col-9">
                                                            <input 
                                                                type="text" 
                                                                className='form-control'
                                                                value={councilAdd}
                                                                onChange={(e)=>{
                                                                    setCouncilAdd(e.target.value)
                                                                }}    
                                                                ref={councilAddRef}
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : ("")
                                        }
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        data-bs-dismiss="modal"
                                    >Hủy bỏ</button>
                                    <button 
                                        type="submit"
                                        form='form-add-diploma-IP' 
                                        className="btn btn-primary"
                                    >Thêm mới</button>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast
                message="Vui lòng chọn tên văn bằng"
                type="warning"
                ref={noti}
            />
            <Toast
                message="Vui lòng chọn đợt cấp văn bằng"
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Vui lòng nhập tên người được cấp"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Vui lòng chọn giới tính"
                type="warning"
                ref={noti4}
            />
            <Toast
                message="Vui lòng chọn ngày sinh"
                type="warning"
                ref={noti5}
            />
            <Toast
                message="Vui lòng nhập nơi sinh"
                type="warning"
                ref={noti6}
            />
            <Toast
                message="Vui lòng chọn ngày thi"
                type="warning"
                ref={noti7}
            />
            <Toast
                message="Vui lòng chọn xếp loại"
                type="warning"
                ref={noti8}
            />
            <Toast
                message="Vui lòng nhập năm tốt nghiệp"
                type="warning"
                ref={noti9}
            />
            <Toast
                message="Vui lòng nhập ngày ký"
                type="warning"
                ref={noti10}
            />
            <Toast
                message="Vui lòng nhập số hiệu văn bằng"
                type="warning"
                ref={noti11}
            />
            <Toast
                message="Vui lòng nhập số vào sổ cho văn bằng"
                type="warning"
                ref={noti12}
            />
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti13}
            />
            <Toast
                message={msgEdit}
                type={isErrorEdit ? "error" : "success"}
                ref={noti14}
            />
            <Toast
                message={msgDelete}
                type={isErrorDelete ? "error" : "success"}
                ref={noti15}
            />
            <Toast
                message="Vui lòng nhập tên hội đồng thi"
                type="warning"
                ref={noti16}
            />
            <Toast
                message="Vui lòng chọn tên văn bằng trước khi import"
                type="warning"
                ref={noti17}
            />
            <Toast
                message="Vui lòng chọn đợt cấp văn bằng trước khi import"
                type="warning"
                ref={noti18}
            />
            <Toast
                message={`Số hiệu của văn bằng có STT ${danhSachTrungSoHieu} trong file excel đã tồn tại` }
                type="warning"
                ref={noti19}
            />
            <Toast
                message={`Số vào sổ của văn bằng có STT ${danhSachTrungSoVaoSo} trong file excel đã tồn tại` }
                type="warning"
                ref={noti20}
            />
            <Toast
                message="Vui lòng chọn file"
                type="warning"
                ref={noti21}
            />
            <Toast
                message="Thêm văn bằng thành công"
                type="success"
                ref={noti22}
            />
            <Toast
                message="Vui lòng nhập CCCD"
                type="warning"
                ref={noti23}
            />
            <Toast
                message="Vui lòng nhập điểm trắc nghiệm"
                type="warning"
                ref={noti24}
            />
            <Footer/>
        </>
    )
}
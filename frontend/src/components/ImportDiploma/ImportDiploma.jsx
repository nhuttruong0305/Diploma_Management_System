import Header from '../Header/Header'
import Select from "react-select";
import './ImportDiploma.css';
import Toast from '../Toast/Toast';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getAllDiplomaIssuanceByMU, addDiploma, editDiplomaInImportDiploma, searchDiplomaWithMultiCondition, deleteDiploma} from '../../redux/apiRequest';
import Footer from '../Footer/Footer';
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

    //8. Ngày kiểm tra
    const [testDay, setTestDay] = useState("");
    const [councilAdd, setCouncilAdd] = useState("");
    

    //9. Xếp loại: nên nhập text hay chọn select
    const [classification, setClassification] = useState();
    const handleChangeClassification = (selectedOption) => {
        setClassification(selectedOption);
    }

    //10. Năm tốt nghiệp, state này có kiểu là string
    const [graduationYear, setGraduationYear] = useState("");

    //11. Ngày ký
    const [signDay, setSignDay] = useState("");

    //12. Số hiệu
    const [diplomaNumber, setDiplomaNumber] = useState("");

    //13. Số vào sổ
    const [numbersIntoTheNotebook, setNumbersIntoTheNotebook] = useState('');

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
        //Kiểm tra xem có chọn ngày kiểm tra chưa
        if(testDay == "" || testDay == undefined){
            noti7.current.showToast();
            testDayRef.current.focus();
            return;
        }
        //Kiểm tra xem ngày xếp loại được nhập chưa
        if(classification == "" || classification == undefined){
            noti8.current.showToast();
            classificationRef.current.focus();
            return;
        }
        //Kiểm tra xem chọn năm tốt nghiệp chưa
        if(graduationYear == "" || graduationYear == undefined){
            noti9.current.showToast();
            graduationYearRef.current.focus();
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

        const newDiploma = {
            // diploma_id: 1,
            management_unit_id: managementUnitId?.management_unit_id,
            diploma_name_id: selectedDiplomaNameInFormAdd?.value,
            diploma_issuance_id:selectedDiplomaIssuanceInFormAdd?.value,
            fullname: fullNameOfTheGrantee,
            sex: sex?.value,
            dateofbirth: dateofbirth,
            address: address,
            test_day: testDay,
            council: councilAdd,
            classification: classification?.value,
            graduationYear: parseInt(graduationYear), //ép kiểu thành number
            sign_day: signDay,
            diploma_number: diplomaNumber,
            numbersIntoTheNotebook: numbersIntoTheNotebook
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
    // const handleChangeSexEdit = (selectedOption) => {
    //     setSexEdit(selectedOption);
    // }
    // 3. Ngày sinh
    const [dateofbirthEdit, setDateofbirthEdit] = useState("");
    // 4. Nơi sinh
    const [addressEdit, setAddressEdit] = useState("");
    // 5. Ngày kiểm tra
    const [testDayEdit, setTestDayEdit] = useState("");
    // Hội đồng
    const [councilEdit, setCouncilEdit] = useState("");
    // 6. Xếp loại
    const [classificationEdit, setClassificationEdit] = useState("");
    // const handleChangeClassificationEdit = (selectedOption) => {
    //     setClassificationEdit
    // }
    // 7. Năm tốt nghiệp
    const [graduationYearEdit, setGraduationYearEdit] = useState("");
    // 8. Ngày ký
    const [signDayEdit, setSignDayEdit] = useState(""); 
    // 9. Số hiệu
    const [diplomaNumberEdit, setDiplomaNumberEdit] = useState("");
    // 10. Số vào sổ
    const [numberInNoteEdit, setNumberInNoteEdit] = useState("");
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
        if(testDayEdit == ""){
            noti7.current.showToast();
            return;
        }
        if(graduationYearEdit == ""){
            noti9.current.showToast();
            return;
        }
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
            nameOfTheGranteeEdit: nameOfTheGranteeEdit,
            sexEdit: sexEdit,
            dateofbirthEdit: dateofbirthEdit,
            addressEdit: addressEdit,
            testDayEdit: testDayEdit,
            councilEdit: councilEdit,
            classificationEdit: classificationEdit,
            graduationYearEdit: graduationYearEdit,
            signDayEdit: signDayEdit,
            diplomaNumberEdit: diplomaNumberEdit,
            numberInNoteEdit: numberInNoteEdit
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
                                    <button style={{width: '110px', backgroundColor: '#fed25c'}} className='btn'>Import</button>
                                </div>
                                <div className='ms-3'>
                                    <button style={{width: '110px', backgroundColor: '#297fbb'}} className='btn'>Mẫu Import</button>
                                </div>
                            </div>
                        </div>
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
                            <div className='table-wrapper table-responsive'>
                                <table 
                                    className="table table-bordered"
                                    id='table-show-diploma-ID'
                                >
                                    <thead>
                                        <tr>
                                            <th style={{width: '50px'}} scope="col"></th>
                                            <th scope="col">STT</th>
                                            <th scope="col">Họ tên</th>
                                            <th scope="col">Ngày sinh</th>
                                            <th scope="col">Nơi sinh</th>
                                            <th scope="col">Ngày kiểm tra</th>
                                            <th scope="col">Hội đồng</th>
                                            <th scope="col">Xếp loại</th>
                                            <th scope="col">Ngày ký</th>
                                            <th scope="col">Số hiệu</th>
                                            <th scope="col">Số vào sổ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaByListOfDiplomaNameImport?.map((currentValue, index)=>{
                                                return(
                                                    <tr key={index}>
                                                        <td 
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#editDiplomaModal"
                                                            style={{textAlign: 'center'}}
                                                            onClick={(e)=>{
                                                                setNameOfTheGranteeEdit(currentValue.fullname);
                                                                setSexEdit(currentValue.sex);
                                                                setDateofbirthEdit(currentValue.dateofbirth);
                                                                setAddressEdit(currentValue.address);
                                                                setTestDayEdit(currentValue.test_day);
                                                                setCouncilEdit(currentValue.council);
                                                                setClassificationEdit(currentValue.classification);
                                                                setGraduationYearEdit(currentValue.graduationYear);
                                                                setSignDayEdit(currentValue.sign_day);
                                                                setDiplomaNumberEdit(currentValue.diploma_number);
                                                                setNumberInNoteEdit(currentValue.numbersIntoTheNotebook);
                                                                set_IdDiplomaEdit(currentValue._id);
                                                                setDiploma_name_idEdit(currentValue.diploma_name_id);
                                                                if(currentValue.status == "Chờ duyệt"){
                                                                    setEditOrOnlyView(true);
                                                                }else{
                                                                    setEditOrOnlyView(false);
                                                                }
                                                            }}
                                                        ><i className="fa-solid fa-eye"></i></td>
                                                        <th scope="row" style={{textAlign: 'center'}}>{index + 1}</th>
                                                        <td>{currentValue.fullname}</td>
                                                        <td>{currentValue.dateofbirth}</td>
                                                        <td>{currentValue.address}</td>
                                                        <td>{currentValue.test_day}</td>
                                                        <td>{currentValue.council}</td>
                                                        <td>{currentValue.classification}</td>
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
                                                >Ngày kiểm tra</label>
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
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >Hội đồng</label>
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
                                                    style={{ fontStyle: 'italic' }}
                                                    className='col-form-label text-end d-block'   
                                                >
                                                    Ngày kiểm tra
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
                message="Vui lòng chọn ngày kiểm tra"
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
            <Footer/>
        </>
    )
}
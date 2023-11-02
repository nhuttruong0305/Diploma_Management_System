import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import Select from "react-select";
import * as XLSX from 'xlsx';
//Các import bên dưới là để validate form
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'; // Sử dụng nếu bạn muốn sử dụng Yup để validate
import * as Yup from 'yup';


import './UserAccountManagement.css';
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../redux/apiRequest';
import Toast from '../Toast/Toast';
import Footer from '../Footer/Footer';
export default function UserAccountManagement() {
    const [sex, setSex] = useState(true); //state đại diện cho giới tính
    const [position, setPosition] = useState('Student'); //state đại diện cho chức vụ
    const [classID, setClassID] = useState(''); //state đại diện cho mã lớp
    const [choose_faculty, setChooseFaculty] = useState(); //state đại diện cho khoa được chọn để cấp tài khoản cho sinh viên
    const [choose_majors, setChooseMajors] = useState(); //state đại diện cho chuyên ngành được chọn để cấp tài khoản cho sinh viên
    const [choose_managementUnit, setChooseManagementUnit] = useState() //state đại diện cho đơn vị quản lý được chọn
    const [role, setRole] = useState('') //state đại diện cho các quyền của tài khoản, hiện chỉ xử lý theo cách 1 tài khoản có 1 quyền (chọn với input type = radio), có thể đổi sang cách xử lý để 1 tài khoản có nhiều quyền(chọn với input type = checkbox)
    const handleChangeSelectRole = (selectedOption) => {
        setRole(selectedOption);
    }

    const [inputSearch, setInputSearch] = useState(''); //state dùng để tìm kiếm user account theo tên
    const [inputMSSV_CB, setInputMSSV_CB] = useState(''); //state dùng để tìm kiếm user account theo MSSV_CB
    const [inputPosition, setInputPosition] = useState(''); //state dùng để lọc ra user account là Sinh viên hay Cán bộ

    const [faculty, setFaculty] = useState([]); //state đại diện cho danh sách các khoa dc lấy từ DB
    const [managementUnit, setManagementUnit] = useState([]); //state đại diện cho các đơn vị quản lý dc lấy từ DB
    const [majors, setMajors] = useState([]); //state đại diện cho danh sách các ngành được lấy từ DB đựa vào khoa được chọn
    const [allUserAccount, setAllUserAccount] = useState([]); //state đại diện cho all user account trong DB
    

    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const noti = useRef();
    const msg = useSelector((state) => state.auth?.msgForRegister);
    const isError = useSelector((state) => state.auth.register?.error);

    
    //Nếu chưa đăng nhập thì trở về homepage
    useEffect(()=>{
        if(!user){
            navigate("/");
        }
        getAllUserAccount();
    },[])

    //Hàm xử lý khi click chọn chức vụ
    const handlePosition = (position) => {
        setPosition(position);
    }

    //Hàm call api lấy danh sách khoa
    const getAllFculty = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/faculty/get_all_faculty");
            setFaculty(res.data);
            return res.data;
        }catch(error){  
            console.log(error);
        }
    }

    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setManagementUnit(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }
    
    //Hàm call api lấy danh sách các ngành dựa theo khoa được chọn
    const getMajorsBasedOnFaculty = async () => {
        let faculty_id;
        if(choose_faculty != undefined && faculty.length != 0){
            faculty_id = choose_faculty;
        
            try{
                const res = await axios.get(`http://localhost:8000/v1/majors/get_majors/${faculty_id}`);
                setMajors(res.data);
                // return res.data;
            }catch(error){
                console.log(error);
            }
        }
    }

    

    //Hàm gọi api để tìm user account theo tên
    const searchUserAccountByName = async (inputName, inputMSSV_CB, position) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/user_account/search_useraccount_byname?keyword=${inputName}&mssv_cb=${inputMSSV_CB}`);
            if(position!=""){
                let result = [];
                res.data.forEach((currentValue)=>{
                    if(currentValue.position == position){
                        result = [...result, currentValue];
                    }
                })                
                setAllUserAccount(result);
            }else{
                setAllUserAccount(res.data);
            }
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect để lấy all user khi tìm kiếm theo tên
    useEffect(()=>{
        searchUserAccountByName(inputSearch, inputMSSV_CB, inputPosition);
    }, [inputSearch, inputMSSV_CB, inputPosition])
   
    //Gọi useEffect để lấy về danh sách khoa
    useEffect(() => {
        const allFaculty = getAllFculty();
        getAllMajorsShowModal();
    }, [])

    // //Gọi useEffect để lấy về danh sách đơn vị quản lý
    useEffect(() => {
        const allManagementUnit = getAllManagementUnit();
    }, [])

    //Gọi useEffect để lấy danh sách các ngành dựa theo khoa
    useEffect(() => {
        getMajorsBasedOnFaculty();
    }, [choose_faculty])

    //Validate form
    //Tạo schema validation bằng Yup 
    const validationSchema = Yup.object().shape({
        fullname: Yup.string()
            .max(50, 'Tên không được dài hơn 50 ký tự')
            .required('Tên không được để trống'),
        MSSV_CB_useraccount_mamagement: Yup.string()
            .required('MSSV/CB không được trống')
            .min(6, 'MSSV/CB có tối thiểu 6 ký tự')
            .max(12, 'MSSV/CB có tối đa 12 ký tự'),
        email_useraccount_mamagement: Yup.string()
            .email("Email không hợp lệ")
            .required("Email không được để trống"),
        password_useraccount_mamagement: Yup.string()
            .required("Mật khẩu không được trống")
            .min(6, 'Mật khẩu có tối thiểu 6 ký tự'),
        dateofbirth_useraccount_mamagement: Yup.string()
            .required('Vui lòng nhập ngày sinh')
            .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại'),
        address_useraccount_useraccountmanagement: Yup.string()
            .required('Vui lòng nhập địa chỉ')
            .min(30, 'Mô tả địa chỉ tối thiểu 30 ký tự'),
        cccd_useraccount_mamagement: Yup.string()
            .matches(
                /([0-9]{12})\b/g,
                "Số CCCD không hợp lệ."
            ),
        phonenumber_useraccount_mamagement: Yup.string()
            .matches(
                /((09|03|07|08|05)+([0-9]{8})\b)/g,
                "Số điện thoại không hợp lệ."
            ), 
        course_useraccount_mamagement: Yup.string()
            .matches(/^[0-9]*$/, 'Chỉ cho phép nhập số vào trường này')
            .when('numericField', {
            is: (value) => value && value.trim() !== '', // Kiểm tra xem trường có giá trị không trống
            then: Yup.string().required('Trường này không được để trống'),
            }),
        
      });
      
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema) // Sử dụng Yup để validate
    });

    const onSubmit = async (data) => {
    // Xử lý logic khi form được submit        
        let newUserAccount;
        if(position == "Student"){
            newUserAccount = {
                fullname: data.fullname,
                mssv_cb: data.MSSV_CB_useraccount_mamagement,
                email: data.email_useraccount_mamagement,
                password: data.password_useraccount_mamagement,
                dateofbirth: data.dateofbirth_useraccount_mamagement,
                address: data.address_useraccount_useraccountmanagement,
                cccd: data.cccd_useraccount_mamagement,
                sex: sex,
                phonenumber: data.phonenumber_useraccount_mamagement,
                position: position,
                class: classID,
                faculty: choose_faculty,
                majors: choose_majors,
                course: parseInt(data.course_useraccount_mamagement),
                management_unit: null,
                role: []
            }//done
        }else{
            newUserAccount = {
                fullname: data.fullname,
                mssv_cb: data.MSSV_CB_useraccount_mamagement,
                email: data.email_useraccount_mamagement, 
                password: data.password_useraccount_mamagement,
                dateofbirth: data.dateofbirth_useraccount_mamagement, 
                address: data.address_useraccount_useraccountmanagement,
                cccd: data.cccd_useraccount_mamagement,
                sex: sex,
                phonenumber: data.phonenumber_useraccount_mamagement,
                position: position,
                class: "",
                faculty: null,
                majors: null,
                course: null,
                management_unit: choose_managementUnit,
                role: role?.value
            }//done
        }

        await registerUser(newUserAccount, dispatch, user.accessToken);
        // if(msg=="Thêm tài khoản người dùng thành công"){  
        //     noti.current.showToast();
        // }else{
            noti.current.showToast();  
        // }   
        // await getAllUserAccount(); 
        await searchUserAccountByName(inputSearch, inputMSSV_CB, inputPosition);
    };

    //State dùng cho việc hiển thị thông tin người dùng
    //Hàm lấy ra all majors
    const [allMajorsShowModal, setAllMajorsShowModal] = useState([]);
    const getAllMajorsShowModal = async () =>{
        try{
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorsShowModal(result.data); 
        }catch(error){
            console.log(error);
        }
    }
    
    const [fullNameShowModal, setFullNameShowModal] = useState("");
    const [MSSV_CBShowModal, setMSSV_CBShowModal] = useState("");
    const [emailShowModal,setEmailShowModal] = useState("");
    const [dateOfBirthShowModal, setDateOfBirthShowModal] = useState("");
    const [addressShowModal, setAddressShowModal] = useState("");
    const [CCCDShowModal, setCCCDShowModal] = useState("");
    const [sexShowModal, setSexShowModal] = useState("");
    const [SDTShowModal, setSDTShowModal] = useState("");
    const [positionShowModal, setPositionShowModal] = useState("");
    const [classIDShowModal, setClassIDShowModal] = useState("");
    const [falcutyShowModal, setFalcutyShowModal] = useState("");
    const [majorsShowModal, setMajorsShowModal] = useState("");
    const [courseShowModal, setCourseShowModal] = useState("");
    const [managementUnitShowModal, setManagementUnitShowModal] = useState("");
    const [roleShowModal, setRoleShowModal] = useState("");
    
    //Phần dưới xử lý việc import và tạo nhiều user bằng file excel
    //State lưu trữ loại tài khoản được chọn để import
    const [positionImport, setPositionImport] = useState("Student");
    const handlePositionImport = (position) => {
        setPositionImport(position);
    }

    //State để ẩn hiện form import
    const [showImport, setShowImport] = useState(false);
    
    //Hàm tạo mẫu file excel để import
    function createAndDownloadExcel() {

        let data = [];
        // Tạo dữ liệu bạn muốn đưa vào tệp Excel
        if(positionImport == "Student"){
            data = [
                {
                    stt:'',
                    fullname: '',
                    mssv_cb: '',
                    email: '',
                    password: '',
                    dateofbirth: '',
                    address: '',
                    cccd: '',
                    sex: '',
                    phonenumber: '',
                    class: '',
                    faculty: '',
                    majors: '',
                    course: ''
                }
            ];
        }else{
            data = [
                {
                    stt:'',
                    fullname: '',
                    mssv_cb: '',
                    email: '',
                    password: '',
                    dateofbirth: '',
                    address: '',
                    cccd: '',
                    sex: '',
                    phonenumber: '',
                    management_unit: '',
                    role: ''
                }
            ]
        }
        
        // Tạo một Workbook và một Worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        if(positionImport == "Student"){
            worksheet['A1'] = { v: 'STT', t: 's' };
            worksheet['B1'] = { v: 'Họ tên', t: 's' };
            worksheet['C1'] = { v: 'MSSV/CB', t: 's' };
            worksheet['D1'] = { v: 'Email', t: 's' };
            worksheet['E1'] = { v: 'Mật khẩu', t: 's' };
            worksheet['F1'] = { v: 'Ngày sinh', t: 's' };
            worksheet['G1'] = { v: 'Địa chỉ', t: 's' };
            worksheet['H1'] = { v: 'CCCD', t: 's' };
            worksheet['I1'] = { v: 'Giới tính', t: 's' };
            worksheet['J1'] = { v: 'Số điện thoại', t: 's' };
            worksheet['K1'] = { v: 'Mã lớp', t: 's' };
            worksheet['L1'] = { v: 'Khoa', t: 's' };
            worksheet['M1'] = { v: 'Ngành', t: 's' };
            worksheet['N1'] = { v: 'Khóa', t: 's' };
            
        }else{
            worksheet['A1'] = { v: 'STT', t: 's' };
            worksheet['B1'] = { v: 'Họ tên', t: 's' };
            worksheet['C1'] = { v: 'MSSV/CB', t: 's' };
            worksheet['D1'] = { v: 'Email', t: 's' };
            worksheet['E1'] = { v: 'Mật khẩu', t: 's' };
            worksheet['F1'] = { v: 'Ngày sinh', t: 's' };
            worksheet['G1'] = { v: 'Địa chỉ', t: 's' };
            worksheet['H1'] = { v: 'CCCD', t: 's' };
            worksheet['I1'] = { v: 'Giới tính', t: 's' };
            worksheet['J1'] = { v: 'Số điện thoại', t: 's' };
            worksheet['K1'] = { v: 'Đơn vị quản lý', t: 's' };
            worksheet['L1'] = { v: 'Chức vụ', t: 's' };
        }
        
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
        link.download = 'dstk.xlsx';

        // Thêm đường link vào DOM và tự động kích hoạt sự kiện click để tải xuống
        // export_excel_btn.append(link);
        link.click();
        // document.body.removeChild(link);
    }

    //Xử lý việc import file để thêm tài khoản người dùng
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
    
    //Xử lý việc submit thêm tài khoản bằng cách import file
    const noti1 = useRef();
    const noti2 = useRef();
    const noti3 = useRef();
    const noti4 = useRef();
    const noti5 = useRef();
    //State để lưu all user trong DB để kiểm tra trùng lặp trong file excel
    const [allUserAccountInDB, setAllUserAccountInDB] = useState([]);

    //State lưu trữ STT của các dòng dữ liệu trùng MSSV/CB trong file excel
    const [dsTrungMSSV, setDsTrungMSSV] = useState([]);
    //State lưu trữ STT của các dòng dữ liệu trùng email trong file excel
    const [dsTrungEmail, setDsTrungEmail] = useState([]);
    //State lưu trữ STT của các dòng dữ liệu trùng CCCD trong file excel
    const [dsTrungCCCD, setDsTrungCCCD] = useState([]);

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccountInDB(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Hàm xử lý submit thêm user account bằng file excel
    const handleSubmitImportAddUserAccount = async () => {
        //Nếu chưa chọn file thì thông báo lỗi        
        if(file == null){
            noti1.current.showToast();
            return;
        }
        
        //Biến này là true nếu có CCCD, email, MSSV_CB bị trùng
        let isFault = false;

        //Kiểm tra trùng MSSV_CB
        let listTrungMSSV_CB = [];
        //Kiểm tra trùng email
        let listTrungEmail = [];
        //Kiểm tra trung CCCD
        let listTrungCCCD = [];
        
        let allDataExcel = [];

        for(let i = 1; i<data.length; i++){
            //Xử lý cột giới tính
            let gioiTinh = false;
            if(data[i][8] == "Nam"){
                gioiTinh = true;
            }

            //Xử lý ngày sinh
            let ngaySinh = '';
            const dateOfBirthExcel = new Date((data[i][5] - 25569) * 86400 * 1000);
            let monthOfdateOfBirthExcel;
            if(dateOfBirthExcel.getMonth() + 1 < 10){
                monthOfdateOfBirthExcel = `0${dateOfBirthExcel.getMonth() + 1}`;
            }else{
                monthOfdateOfBirthExcel = dateOfBirthExcel.getMonth() + 1;
            }
            let dayOfdateOfBirthExcel;
            if(dateOfBirthExcel.getDate() < 10){
                dayOfdateOfBirthExcel = `0${dateOfBirthExcel.getDate()}`;
            }else{
                dayOfdateOfBirthExcel = dateOfBirthExcel.getDate();
            }
            ngaySinh = `${dateOfBirthExcel.getFullYear()}-${monthOfdateOfBirthExcel}-${dayOfdateOfBirthExcel}`;

            //Xử lý trùng mssv_cb, email, cccd
            allUserAccountInDB?.forEach((user)=>{
                if(user.mssv_cb == data[i][2]){
                    listTrungMSSV_CB = [...listTrungMSSV_CB, i];
                    isFault = true;
                }

                if(user.email == data[i][3]){
                    listTrungEmail = [...listTrungEmail, i];
                    isFault = true;
                }

                if(user.cccd == data[i][7]){
                    listTrungCCCD = [...listTrungCCCD, i];
                    isFault = true;
                }
            })

            setDsTrungMSSV(listTrungMSSV_CB);
            setDsTrungEmail(listTrungEmail);
            setDsTrungCCCD(listTrungCCCD);

            if(positionImport == "Student"){
                //Xử lý khoa
                let khoa;
                faculty?.forEach((currentValue)=>{
                    if(currentValue.faculty_name == data[i][11]){
                        khoa = currentValue.faculty_id;
                    }
                })
    
                //Xử lý ngành
                let nganh;
                allMajorsShowModal?.forEach((currentValue)=>{
                    if(data[i][12] == currentValue.majors_name){
                        nganh = currentValue.majors_id;
                    }
                })
                const newUserAccountObject = {
                    fullname: data[i][1], 
                    mssv_cb: data[i][2],
                    email: data[i][3],
                    password: data[i][4],
                    dateofbirth: ngaySinh,
                    address: data[i][6],
                    cccd: data[i][7],
                    sex: gioiTinh,
                    phonenumber: data[i][9],
                    position: "Student",
                    class: data[i][10],
                    faculty: khoa,
                    majors: nganh,
                    course: data[i][13],
                    management_unit: null,
                    role: []
                }
                allDataExcel = [...allDataExcel, newUserAccountObject];
            }else{
                //Xử lý đơn vị quản lý
                let don_vi_ql;
                managementUnit?.forEach((currentValue)=>{
                    if(data[i][10] == currentValue.management_unit_name){
                        don_vi_ql = currentValue.management_unit_id;
                    }
                })
                //Xử lý chức vụ
                let chuc_vu;
                switch(data[i][11]){
                    case "Cán bộ nhập văn bằng":
                        chuc_vu = "Diploma importer";
                        break;
                    case "Cán bộ duyệt văn bằng":
                        chuc_vu = "Diploma reviewer";
                        break;
                    case "Trưởng phòng/Giám đốc Trung tâm": 
                        chuc_vu = "Center Director_Head of Department";
                        break;
                    case "Thư ký":
                        chuc_vu = "Secretary";
                        break;
                    case "Thủ kho":
                        chuc_vu = "Stocker";
                        break;    
                }

                const newUserAccountObject = {
                    fullname: data[i][1],
                    mssv_cb: data[i][2],
                    email: data[i][3],
                    password: data[i][4],
                    dateofbirth: ngaySinh,
                    address: data[i][6],
                    cccd: data[i][7],
                    sex: gioiTinh,
                    phonenumber: data[i][9],
                    position: "Officer",
                    class: "",
                    faculty: null,
                    majors: null,
                    course: null,
                    management_unit: don_vi_ql,
                    role: chuc_vu
                }
                allDataExcel = [...allDataExcel, newUserAccountObject];
            }   
        }
        if(isFault){
            return;
        }else{
            for(let j = 0; j<allDataExcel.length; j++){
                await registerUser(allDataExcel[j], dispatch, user.accessToken);
            }
            noti2.current.showToast();
            setTimeout(async()=>{
                await searchUserAccountByName(inputSearch, inputMSSV_CB, inputPosition);
            }, 2000);
            setFile(null);
        }
    }

    useLayoutEffect(()=>{
        if(dsTrungMSSV.length>0){
            noti3.current.showToast();
        }
    }, [dsTrungMSSV])

    useLayoutEffect(()=>{
        if(dsTrungEmail.length>0){
            noti4.current.showToast();
        }
    }, [dsTrungEmail])
    
    useLayoutEffect(()=>{
        if(dsTrungCCCD.length>0){
            noti5.current.showToast();
        }
    }, [dsTrungCCCD])

    return (
        <>
            <Header />
            <div className="container" id='body-useraccountmanagement'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li id='active-useraccount-management' className="list-group-item">Thêm tài khoản</li>
                                    <Link style={{textDecoration: 'none'}} to='/manage-user-permission'>
                                        <li className="list-group-item">Phân quyền người dùng quản lý</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div className='d-flex'>
                                    <div>
                                        <button 
                                            type="button" 
                                            id='add-user-account-useraccountmanagement' 
                                            data-bs-toggle="modal"
                                            data-bs-target="#exampleModalAddUserAccount"
                                        >Thêm mới tài khoản</button>
                                    </div>
                                    <div>
                                        <button 
                                            className='btn btn-info'
                                            id='import-btn-user-account-useraccountmanagement'
                                            onClick={(e)=>{
                                                setShowImport(!showImport);
                                            }}
                                        >Import</button>
                                    </div>
                                </div>

                                {
                                    showImport ? (
                                        <>
                                            <div className='mt-3 row'>
                                                <div className="col-8">
                                                    <div className='card p-3'>
                                                        <div className="row">
                                                            <div className="col-4">
                                                                Chọn loại tài khoản
                                                            </div>
                                                            <div className="col-8">

                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    checked={positionImport == "Student"}
                                                                    onChange={() => {
                                                                        handlePositionImport("Student")
                                                                    }}
                                                                    id="checked-loai-tk-student-import" 
                                                                />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="checked-loai-tk-student-import">
                                                                    Sinh viên
                                                                </label>&nbsp;

                                                                <input 
                                                                    style={{marginLeft:"20px"}}
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    checked={positionImport == "Officer"}
                                                                    onChange={() => {
                                                                        handlePositionImport("Officer")
                                                                    }}
                                                                    id="checked-loai-tk-officer-import" 
                                                                />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="checked-loai-tk-officer-import">
                                                                    Cán bộ
                                                                </label>&nbsp;
                                                            </div>
                                                        </div>
                                                        <div className='mt-2'>
                                                            <button 
                                                                className='btn' 
                                                                style={{backgroundColor: '#fed25c'}}
                                                                onClick={(e)=>{
                                                                    createAndDownloadExcel()
                                                                }}
                                                            >Mẫu import</button>
                                                        </div>
                                                        <div className="mt-4">
                                                            <div className="input-group">
                                                                <input 
                                                                    type="file" className="form-control" 
                                                                    id="inputFileAddUserAccount" 
                                                                    aria-describedby="inputFileAddUserAccount01" 
                                                                    aria-label="Upload"
                                                                    accept=".xlsx" 
                                                                    onChange={handleFileChange}
                                                                />
                                                                <button 
                                                                    className="btn btn-outline-secondary" 
                                                                    type="button" 
                                                                    id="inputFileAddUserAccount01"
                                                                    onClick={(e)=>{
                                                                        handleSubmitImportAddUserAccount()
                                                                    }}
                                                                >Thêm tài khoản</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : ("")
                                }                                
                                <div className='mt-3'>
                                    <div className="row">
                                        <div className="col-4">
                                            <input 
                                                type="text" 
                                                className='form-control'
                                                placeholder='Tìm kiếm theo tên'
                                                value={inputSearch}
                                                onChange={(e)=>{
                                                    setInputSearch(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <input 
                                                type="text" 
                                                className='form-control'
                                                placeholder='Tìm kiếm theo MSSV/CB'
                                                value={inputMSSV_CB}
                                                onChange={(e)=>{
                                                    setInputMSSV_CB(e.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <select
                                                className='form-select'
                                                value={inputPosition}
                                                onChange={(e)=>{
                                                    setInputPosition(e.target.value);
                                                }}
                                            >
                                                <option value="">Lọc theo loại tài khoản</option>
                                                <option value="Student">Sinh viên</option>
                                                <option value="Officer">Cán bộ</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div id='contain-table-show-all-user'>
                                    <table id='table-show-all-user' className='table mt-3'>
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">Họ tên</th>
                                                <th scope="col">MSSV/CB</th>
                                                <th scope="col">Loại tài khoản</th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allUserAccount?.map((currentValue, index) => {        
                                                    let chucVu ="";
                                                    if(currentValue.position == "Student"){
                                                        chucVu = "Sinh viên";                                                   
                                                    }else if(currentValue.position == "Officer"){
                                                        chucVu = "Cán bộ";
                                                    }

                                                    let quyen = '';
                                                    if(currentValue.role[0] == "Diploma importer"){
                                                        quyen = "Cán bộ nhập văn bằng";
                                                    }else if(currentValue.role[0] == "Diploma reviewer"){
                                                        quyen = "Cán bộ duyệt văn bằng"
                                                    }else if(currentValue.role[0] == "Center Director_Head of Department"){
                                                        quyen = "Giám đốc Trung tâm/Trưởng phòng"
                                                    }
                                                    return(
                                                        <tr key={index}>
                                                            
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{currentValue.fullname}</td>
                                                            <td>{currentValue.mssv_cb}</td>
                                                            <td>{chucVu}</td>
                                                            <td>
                                                                <i 
                                                                    className="fa-solid fa-eye"
                                                                    style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target="#showInforUserModal"
                                                                    onClick={(e)=>{
                                                                        let sex = "Nữ";
                                                                        if(currentValue.sex == true){
                                                                            sex = "Nam";                   
                                                                        }
                                                                        

                                                                        let khoa ="";
                                                                        faculty?.forEach((faculty)=>{
                                                                            if(faculty.faculty_id == currentValue.faculty){
                                                                                khoa = faculty.faculty_name;
                                                                            }                                           
                                                                        })

                                                                        let nganh = "";
                                                                        allMajorsShowModal?.forEach((majorValue) => {
                                                                            if(majorValue.majors_id == currentValue.majors){
                                                                                nganh = majorValue.majors_name;
                                                                            }
                                                                        })

                                                                        let donViQuanLy = '';
                                                                        managementUnit?.forEach((MUValue) => {
                                                                            if(MUValue.management_unit_id == currentValue.management_unit){
                                                                                donViQuanLy = MUValue.management_unit_name;                                                  
                                                                            }
                                                                        })

                                                                        setFullNameShowModal(currentValue.fullname);
                                                                        setMSSV_CBShowModal(currentValue.mssv_cb);
                                                                        setEmailShowModal(currentValue.email);
                                                                        setDateOfBirthShowModal(currentValue.dateofbirth);
                                                                        setAddressShowModal(currentValue.address);
                                                                        setCCCDShowModal(currentValue.cccd);
                                                                        setSexShowModal(sex);
                                                                        setSDTShowModal(currentValue.phonenumber);
                                                                        setPositionShowModal(chucVu);
                                                                        setClassIDShowModal(currentValue.class);
                                                                        setFalcutyShowModal(khoa);
                                                                        setMajorsShowModal(nganh);
                                                                        setCourseShowModal(currentValue.course);
                                                                        setManagementUnitShowModal(donViQuanLy);
                                                                        setRoleShowModal(quyen);
                                                                    }}
                                                                ></i>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                                {/* Modal hiển thị thông tin user */}
                                <div className="modal fade" id="showInforUserModal" tabIndex="-1" aria-labelledby="showInforUserModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="showInforUserModalLabel">Thông tin tài khoản người dùng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Họ và tên</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        value={fullNameShowModal}
                                                        className='form-control'
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >MSSV/CB</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={MSSV_CBShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Email</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={emailShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Ngày sinh</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={dateOfBirthShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Địa chỉ</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={addressShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >CCCD</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={CCCDShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Giới tính</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={sexShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Số điện thoại</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={SDTShowModal}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-2">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Loại tài khoản</label>
                                                </div>
                                                <div className="col-10">
                                                    <input 
                                                        type="text" 
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={positionShowModal}
                                                    />
                                                </div>
                                            </div>
                                            
                                            {
                                                positionShowModal == "Sinh viên" ? (
                                                    <>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Mã lớp</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={classIDShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Khoa</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={falcutyShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Chuyên ngành</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={majorsShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Khóa</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={courseShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Đơn vị quản lý</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={managementUnitShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-2">
                                                                <label
                                                                    htmlFor="fullname"
                                                                    className="col-form-label text-end d-block"
                                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                                >Chức vụ</label>
                                                            </div>
                                                            <div className="col-10">
                                                                <input 
                                                                    type="text" 
                                                                    readOnly={true}
                                                                    className='form-control'
                                                                    value={roleShowModal}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            
                                            
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                                        </div>
                                        </div>
                                    </div>
                                </div>




                                <div className="modal fade" id="exampleModalAddUserAccount" tabIndex="-1" aria-labelledby="exampleModalAddUserAccountLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalAddUserAccountLabel">Thêm mới tài khoản</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={handleSubmit(onSubmit)} id='form-add-useraccount-useraccountmanagement'>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="fullname"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                            >Họ và tên</label>
                                                        </div>
                                                        <div className="col-10">

                                                        <Controller
                                                            name="fullname"
                                                            control={control}
                                                            defaultValue=""
                                                            render={({ field }) => <input
                                                                                        {...field}
                                                                                        type="text"
                                                                                        id="fullname"
                                                                                        className="form-control" />}
                                                                                    />
                                                        <p style={{ color: "red" }}>{errors.fullname?.message}</p>

                                                            {/* <input
                                                                type="text"
                                                                value={fullname}
                                                                onChange={(e)=>{
                                                                    setFullname(e.target.value);
                                                                }}
                                                                id="fullname-useraccount-useraccountmanagement"
                                                                className="form-control" /> */}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="MSSV_CB_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>MSSV/CB</label>
                                                        </div>
                                                        <div className="col-10">

                                                        <Controller
                                                            name="MSSV_CB_useraccount_mamagement"
                                                            control={control}
                                                            defaultValue=""
                                                            render={({ field }) => <input
                                                                                        {...field}
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        id='MSSV_CB_useraccount_mamagement' 
                                                            />}
                                                        />
                                                        <p style={{ color: "red" }}>{errors.MSSV_CB_useraccount_mamagement?.message}</p>

                                                            
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="email_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Email</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="email_useraccount_mamagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => <input
                                                                                            {...field}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id='email_useraccount_mamagement' 
                                                                />}
                                                            />
                                                            <p style={{ color: "red" }}>{errors.email_useraccount_mamagement?.message}</p>                         
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="password_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Password</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="password_useraccount_mamagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) =>  <input
                                                                                            {...field}                                                                     
                                                                                            type="password"
                                                                                            className="form-control"
                                                                                            id='password_useraccount_mamagement' />}
                                                            />
                                                            <p style={{ color: "red" }}>{errors.password_useraccount_mamagement?.message}</p>  


                                                            {/* <input
                                                                value={password}
                                                                onChange={(e)=>{
                                                                    setPassword(e.target.value);
                                                                }}                                                                      
                                                                type="password"
                                                                className="form-control"
                                                                id='password-useraccount-mamagement' /> */}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="dateofbirth_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Ngày sinh</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="dateofbirth_useraccount_mamagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => (
                                                                    <input
                                                                    {...field}
                                                                    type="date"
                                                                    className="form-control"
                                                                    id="dateofbirth_useraccount_mamagement"
                                                                    />
                                                                )}
                                                                />
                                                            <p style={{ color: "red" }}>{errors.dateofbirth_useraccount_mamagement?.message}</p>

                                                            {/* <input
                                                                value={dateofbirth}
                                                                onChange={(e)=>{
                                                                    setDateofbirth(e.target.value);
                                                                }}
                                                                type="date"
                                                                className="form-control"
                                                                id='dateofbirth_useraccount_mamagement' /> */}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="address_useraccount_useraccountmanagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                            >Địa chỉ</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="address_useraccount_useraccountmanagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => <input
                                                                                            {...field}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id='address_useraccount_useraccountmanagement' 
                                                                />}
                                                            />
                                                            <p style={{ color: "red" }}>{errors.address_useraccount_useraccountmanagement?.message}</p> 

                                                            {/* <input
                                                                value={address}
                                                                onChange={(e)=>{
                                                                    setAddress(e.target.value);
                                                                }}
                                                                type="text"
                                                                id="address-useraccount-useraccountmanagement"
                                                                className="form-control" /> */}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="cccd_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>CCCD</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="cccd_useraccount_mamagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => <input
                                                                                            {...field}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id='cccd_useraccount_mamagement' 
                                                                />}
                                                                />
                                                            <p style={{ color: "red" }}>{errors.cccd_useraccount_mamagement?.message}</p> 


                                                            {/* <input
                                                                value={CCCD}
                                                                onChange={(e)=>{
                                                                    setCCCD(e.target.value);
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id='cccd-useraccount-mamagement' /> */}
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Giới tính</label>
                                                        </div>
                                                        <div className="col-10">
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    id="male-user-account-useraccountmanagement" 
                                                                    checked={sex == true}
                                                                    onChange={() => {
                                                                        setSex(true)
                                                                    }}
                                                                />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="male-user-account-useraccountmanagement"
                                                                >Nam</label>&nbsp;
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    id="female-user-account-useraccountmanagement" 
                                                                    checked={sex == false}
                                                                    onChange={() => {
                                                                        setSex(false)
                                                                    }}
                                                                />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="female-user-account-useraccountmanagement">
                                                                    Nữ
                                                                </label>
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="phonenumber_useraccount_mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Số điện thoại</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <Controller
                                                                name="phonenumber_useraccount_mamagement"
                                                                control={control}
                                                                defaultValue=""
                                                                render={({ field }) => <input
                                                                                            {...field}
                                                                                            type="text"
                                                                                            className="form-control"
                                                                                            id='phonenumber_useraccount_mamagement' 
                                                                />}
                                                                />
                                                            <p style={{ color: "red" }}>{errors.phonenumber_useraccount_mamagement?.message}</p> 


                                                            {/* <input
                                                                value={phonenumber}
                                                                onChange={(e)=>{
                                                                    handleIsNumber(e,2);
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id='phonenumber-useraccount-mamagement' /> */}
                                                        </div>
                                                    </div>

                                                    {/* <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor='religion-useraccount-management'
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Tôn giáo</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <select id='religion-useraccount-management' className="form-select" aria-label="Default select example">
                                                                <option selected>--Chọn tôn giáo--</option>
                                                                <option value="1">Phật giáo</option>
                                                                <option value="2">Thiên chúa giáo</option>
                                                                <option value="3">Kito giao</option>
                                                            </select>
                                                        </div>
                                                    </div> */}

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                            >Loại tài khoản</label>
                                                        </div>
                                                        <div className="col-10">
                                                            {/* <div className="form-check"> */}
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    checked={position == "Student"}
                                                                    onChange={() => {
                                                                        handlePosition("Student");
                                                                    }}
                                                                    id="student-position-useraccountmanagement" />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="student-position-useraccountmanagement">
                                                                    Sinh viên
                                                                </label>&nbsp;
                                                            {/* </div> */}
                                                            {/* <div className="form-check"> */}
                                                                <input 
                                                                    className="form-check-input" 
                                                                    type="radio" 
                                                                    checked={position == "Officer"}
                                                                    onChange={() => {
                                                                        handlePosition("Officer");
                                                                    }}
                                                                    id="officer-useraccountmanagement" />&nbsp;
                                                                <label 
                                                                    className="form-check-label" 
                                                                    htmlFor="officer-useraccountmanagement"
                                                                >Cán bộ
                                                                </label>
                                                            {/* </div> */}
                                                        </div>
                                                    </div>
                                                    
                                                    {position == 'Student' ? (
                                                        <>
                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        htmlFor="class-useraccount-mamagement"
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Mã lớp</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <input
                                                                        value={classID}
                                                                        onChange={(e)=>{
                                                                            setClassID(e.target.value);
                                                                        }}
                                                                        type="text"
                                                                        className="form-control"
                                                                        id='class-useraccount-mamagement' />
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Khoa</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <select 
                                                                        value={choose_faculty}
                                                                        onChange={(e)=>{
                                                                            setChooseFaculty(e.target.value);   
                                                                        }}
                                                                        className="form-select" 
                                                                        aria-label="Default select example">
                                                                        <option value="">-- Khoa --</option>
                                                                        {
                                                                            faculty?.map((currentValue, index) => {
                                                                                return(
                                                                                    <option 
                                                                                        key={index} 
                                                                                        value={currentValue.faculty_id}
                                                                                    >{currentValue.faculty_name}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Chuyên ngành</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <select 
                                                                        value={choose_majors}
                                                                        
                                                                        onChange={(e)=>{
                                                                            setChooseMajors(e.target.value);
                                                                        }}
                                                                        className="form-select"
                                                                        aria-label="Default select example"
                                                                    >
                                                                        <option value="">-- Chuyên ngành --</option>
                                                                        {
                                                                            majors?.map((currentValue, index) => {
                                                                                return(
                                                                                    <option 
                                                                                        key={index}
                                                                                        value={currentValue.majors_id}
                                                                                    >{currentValue.majors_name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        htmlFor="course_useraccount_mamagement"
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Khóa</label>
                                                                </div>
                                                                <div className="col-10">

                                                                    <Controller
                                                                        name="course_useraccount_mamagement"
                                                                        control={control}
                                                                        defaultValue=""
                                                                        render={({ field }) => <input
                                                                                                    {...field}
                                                                                                    type="text"
                                                                                                    className="form-control"
                                                                                                    id='course_useraccount_mamagement' 
                                                                        />}
                                                                        />
                                                                    <p style={{ color: "red" }}>{errors.course_useraccount_mamagement?.message}</p>

                                                                    {/* <input
                                                                        value={course}
                                                                        onChange={(e)=>{
                                                                            handleIsNumber(e);
                                                                        }}
                                                                        
                                                                        type="text"
                                                                        className="form-control"
                                                                        id='course-useraccount-mamagement' /> */}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Đơn vị quản lý</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <select 
                                                                        className="form-select" 
                                                                        aria-label="Default select example"
                                                                        value={choose_managementUnit}
                                                                        
                                                                        onChange={(e)=>{
                                                                            setChooseManagementUnit(e.target.value);
                                                                        }}
                                                                    >
                                                                        <option value="">-- Đơn vị quản lý --</option>
                                                                        {
                                                                            managementUnit?.map((currentValue, index) => {
                                                                                return(
                                                                                    <option 
                                                                                        key={index} 
                                                                                        value={currentValue.management_unit_id}
                                                                                    >{currentValue.management_unit_name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2">
                                                                    <label
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Chức vụ</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    {/* <input 
                                                                        className="form-check-input"
                                                                        checked={role=="Diploma importer"} 
                                                                        onChange={()=>{
                                                                            setRole("Diploma importer")
                                                                        }}
                                                                        type="radio" 
                                                                        id="enter-diploma-user-account-useraccountmanagement" />&nbsp;
                                                                    <label className="form-check-label" htmlFor="enter-diploma-user-account-useraccountmanagement">
                                                                        Cán bộ nhập văn bằng
                                                                    </label>&nbsp;
                                                                
                                                                    <input 
                                                                        className="form-check-input" 
                                                                        checked={role=="Diploma reviewer"} 
                                                                        onChange={()=>{
                                                                            setRole("Diploma reviewer")
                                                                        }}
                                                                        type="radio" 
                                                                        id="diploma-approval-user-account-useraccountmanagement" />&nbsp;
                                                                    <label className="form-check-label" htmlFor="diploma-approval-user-account-useraccountmanagement">
                                                                        Cán bộ duyệt văn bằng
                                                                    </label>

                                                                    <input 
                                                                        className="form-check-input" 
                                                                        checked={role=="Center Director_Head of Department"} 
                                                                        onChange={()=>{
                                                                            setRole("Center Director_Head of Department")
                                                                        }}
                                                                        type="radio" 
                                                                        id="diploma-approval-user-account-useraccountmanagement" />&nbsp;
                                                                    <label className="form-check-label" htmlFor="diploma-approval-user-account-useraccountmanagement">
                                                                        Trưởng phòng/Giám đốc Trung tâm
                                                                    </label> */}
                                                                    <Select
                                                                        options = {[
                                                                            {value: "Diploma importer", label: "Cán bộ nhập văn bằng"},
                                                                            {value: "Diploma reviewer", label: "Cán bộ duyệt văn bằng"},
                                                                            {value: "Center Director_Head of Department", label: "Trưởng phòng/Giám đốc Trung tâm"},
                                                                            {value: "Secretary", label: "Thư ký"},
                                                                            {value: "Stocker", label: "Thủ kho"},
                                                                        ]}
                                                                        value={role}
                                                                        onChange={handleChangeSelectRole}
                                                                        placeholder="Chọn chức vụ tài khoản"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </form>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                <button 
                                                    type="submit" 
                                                    form='form-add-useraccount-useraccountmanagement' 
                                                    className="btn"
                                                    style={{backgroundColor: '#1b95a2'}}
                                                    >Thêm tài khoản</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='notification'>
                <Toast
                    message={msg}
                    type={
                        isError ? "error" : "success"
                    }
                    ref={noti}
                />
                <Toast
                    message="Vui lòng chọn file excel chứa thông tin tài khoản để thêm tài khoản"
                    type="warning"
                    ref={noti1}
                />
                <Toast
                    message="Thêm tài khoản người dùng thành công"
                    type="success"
                    ref={noti2}
                />
                <Toast
                    message={`MSSV/CB có STT ${dsTrungMSSV} trong file excel đã tồn tại`}
                    type="warning"
                    ref={noti3}
                />
                <Toast
                    message={`Email có STT ${dsTrungEmail} trong file excel đã tồn tại`}
                    type="warning"
                    ref={noti4}
                />
                <Toast
                    message={`Số CCCD có STT ${dsTrungCCCD} trong file excel đã tồn tại`}
                    type="warning"
                    ref={noti5}
                />
            </div>
            <Footer/>
        </>
    );
}
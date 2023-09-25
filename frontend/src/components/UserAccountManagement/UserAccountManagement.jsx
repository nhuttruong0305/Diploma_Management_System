import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from 'axios';

import './UserAccountManagement.css';
import Header from '../Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/apiRequest';
import Toast from '../Toast/Toast';

export default function UserAccountManagement() {
    const [fullname, setFullname] = useState(''); //state đại diện cho họ và tên
    const [MSSV_CB, setMSSV_CB] = useState(''); //state đại diện cho MSSV/CB
    const [email, setEmail] = useState('') //state đại diện cho email
    const [password, setPassword] = useState('') //state đại diện cho password
    const [dateofbirth, setDateofbirth] = useState('') //state đại diện cho ngày sinh
    const [address, setAddress] = useState(''); //state đại diện cho địa chỉ
    const [CCCD, setCCCD] = useState(''); //state đại diện cho CCCD
    const [sex, setSex] = useState(true); //state đại diện cho giới tính
    const [phonenumber, setPhonenumber] = useState(''); //state đại diện cho sdt
    const [position, setPosition] = useState('Student'); //state đại diện cho chức vụ
    const [classID, setClassID] = useState(''); //state đại diện cho mã lớp
    const [choose_faculty, setChooseFaculty] = useState(''); //state đại diện cho khoa được chọn để cấp tài khoản cho sinh viên
    const [choose_majors, setChooseMajors] = useState(''); //state đại diện cho chuyên ngành được chọn để cấp tài khoản cho sinh viên
    const [course, setCourse] = useState(""); //state đại diện cho khóa được nhập để cấp tài khoản cho sinh viên
    const [choose_managementUnit, setChooseManagementUnit] = useState('') //state đại diện cho đơn vị quản lý được chọn
    const [role, setRole] = useState('') //state đại diện cho các quyền của tài khoản, hiện chỉ xử lý theo cách 1 tài khoản có 1 quyền (chọn với input type = radio), có thể đổi sang cách xử lý để 1 tài khoản có nhiều quyền(chọn với input type = checkbox)

    const [faculty, setFaculty] = useState([]); //state đại diện cho danh sách các khoa dc lấy từ DB
    const [managementUnit, setManagementUnit] = useState([]); //state đại diện cho các đơn vị quản lý dc lấy từ DB
    const [majors, setMajors] = useState([]); //state đại diện cho danh sách các ngành được lấy từ DB đựa vào khoa được chọn
    const [allUserAccount, setAllUserAccount] = useState(); //state đại diện cho all user account trong DB
    

    const user = useSelector((state) => state.auth.login?.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const noti = useRef();
    const msg = useSelector((state) => state.auth?.msg);
    const isError = useSelector((state) => state.auth.register?.error);

    useEffect(()=>{
        if(!user){
            navigate("/");
        }

    },[])

    //Hàm xử lý chỉ cho nhập số trong textbox khóa
    const handleIsNumber = (eventObject, type) => {
        const value = eventObject.target.value;

        // type = 1 là textbox khóa, type=2 là textbox sdt
        // Kiểm tra xem giá trị nhập vào có phải là số
        if(type==1){
            if (/^[0-9]*$/.test(value)) {
                setCourse(value);
            }
        }
        if(type==2){
            if (/^[0-9]*$/.test(value)) {
                setPhonenumber(value);
            }
        }
    }

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
        if(choose_faculty != "" && faculty.length != 0){
            //Lấy ra faculty_id trước
            faculty.forEach((currentValue, index) => {
                if(currentValue.faculty_name == choose_faculty){
                    faculty_id = currentValue.faculty_id;    
                }
            });
            
            try{
                const res = await axios.get(`http://localhost:8000/v1/majors/get_majors/${faculty_id}`);
                setMajors(res.data);
                // return res.data;
            }catch(error){
                console.log(error);
            }
        }
    }

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        }catch(error){
            console.log(error);
        }
    }
   
    //Gọi useEffect để lấy về danh sách khoa
    useEffect(() => {
        const allFaculty = getAllFculty();
    }, [])

    // //Gọi useEffect để lấy về danh sách đơn vị quản lý
    useEffect(() => {
        const allManagementUnit = getAllManagementUnit();
    }, [])

    // //Gọi useEffect để lấy về danh sách tất cả user account trong DB
    useEffect(()=> {
        getAllUserAccount();
    }, [])

    //Gọi useEffect để lấy danh sách các ngành dựa theo khoa
    useEffect(() => {
        getMajorsBasedOnFaculty();
    }, [choose_faculty])

    console.log("All user account: ", allUserAccount);
    
    //Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        let newUserAccount;
        if(position == "Student"){
            newUserAccount = {
                fullname: fullname,
                mssv_cb: MSSV_CB,
                email: email,
                password: password,
                dateofbirth: dateofbirth,
                address: address,
                cccd: CCCD,
                sex: sex,
                phonenumber: phonenumber,
                position: position,
                class: classID,
                faculty: choose_faculty,
                majors: choose_majors,
                course: course,
                management_unit: "",
                role: []
            }//done
        }else{
            newUserAccount = {
                fullname: fullname,
                mssv_cb: MSSV_CB,
                email: email,
                password: password,
                dateofbirth: dateofbirth,
                address: address,
                cccd: CCCD,
                sex: sex,
                phonenumber: phonenumber,
                position: position,
                class: "",
                faculty: "",
                majors: "",
                course: null,
                management_unit: choose_managementUnit,
                role: role
            }//done
        }

        await registerUser(newUserAccount, dispatch, user.accessToken);
        if(msg=="Thêm tài khoản người dùng thành công"){  
            noti.current.showToast();
        }else{
            noti.current.showToast();  
        }   
        
    }

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
                                    <li className="list-group-item">Thêm tài khoản</li>
                                    <li className="list-group-item">Phân quyền người dùng quản lý</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div>
                                    <button type="button" id='add-user-account-useraccountmanagement' data-bs-toggle="modal" data-bs-target="#exampleModalAddUserAccount">Thêm mới tài khoản</button>
                                </div>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Họ tên</th>
                                            <th scope="col">MSSV/CB</th>
                                            <th scope="col">Chức vụ</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                            <td><i className="fa-solid fa-eye"></i></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Jacob</td>
                                            <td>Thornton</td>
                                            <td>@fat</td>
                                            <td><i className="fa-solid fa-eye"></i></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td colSpan="2">Larry the Bird</td>
                                            <td>@twitter</td>
                                            <td><i className="fa-solid fa-eye"></i></td>
                                        </tr> */}
                                        {
                                            allUserAccount?.map((currentValue, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td colSpan="2">{currentValue.fullname}</td>
                                                        <td>{currentValue.mssv_cb}</td>
                                                        <td><i className="fa-solid fa-eye"></i></td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                <div className="modal fade" id="exampleModalAddUserAccount" tabIndex="-1" aria-labelledby="exampleModalAddUserAccountLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalAddUserAccountLabel">Thêm mới tài khoản</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <form onSubmit={(e) => {handleSubmit(e)}} id='form-add-useraccount-useraccountmanagement'>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="fullname-useraccount-useraccountmanagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                            >Họ và tên</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                type="text"
                                                                value={fullname}
                                                                onChange={(e)=>{
                                                                    setFullname(e.target.value);
                                                                }}
                                                                id="fullname-useraccount-useraccountmanagement"
                                                                className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="MSSV/CB-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>MSSV/CB</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                type="text"
                                                                value={MSSV_CB}
                                                                onChange={(e)=>{
                                                                    setMSSV_CB(e.target.value);
                                                                }}
                                                                className="form-control"
                                                                id='MSSV/CB-useraccount-mamagement' />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="email-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Email</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={email}
                                                                onChange={(e)=>{
                                                                    setEmail(e.target.value);
                                                                }}
                                                                type="email"
                                                                className="form-control"
                                                                id='email-useraccount-mamagement' />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="password-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Password</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={password}
                                                                onChange={(e)=>{
                                                                    setPassword(e.target.value);
                                                                }}                                                                      
                                                                type="password"
                                                                className="form-control"
                                                                id='password-useraccount-mamagement' />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="dateofbirth-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Ngày sinh</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={dateofbirth}
                                                                onChange={(e)=>{
                                                                    setDateofbirth(e.target.value);
                                                                }}
                                                                type="date"
                                                                className="form-control"
                                                                id='dateofbirth-useraccount-mamagement' />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="address-useraccount-useraccountmanagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                            >Địa chỉ</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={address}
                                                                onChange={(e)=>{
                                                                    setAddress(e.target.value);
                                                                }}
                                                                type="text"
                                                                id="address-useraccount-useraccountmanagement"
                                                                className="form-control" />
                                                        </div>
                                                    </div>

                                                    <div className="row mt-3">
                                                        <div className="col-2">
                                                            <label
                                                                htmlFor="cccd-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>CCCD</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={CCCD}
                                                                onChange={(e)=>{
                                                                    setCCCD(e.target.value);
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id='cccd-useraccount-mamagement' />
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
                                                                htmlFor="phonenumber-useraccount-mamagement"
                                                                className="col-form-label text-end d-block"
                                                                style={{ fontSize: '12px', fontStyle: 'italic' }}>Số điện thoại</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <input
                                                                value={phonenumber}
                                                                onChange={(e)=>{
                                                                    handleIsNumber(e,2);
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id='phonenumber-useraccount-mamagement' />
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
                                                            >Chức vụ</label>
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
                                                                                        value={currentValue.faculty_name}
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
                                                                                        value={currentValue.majors_name}
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
                                                                        htmlFor="course-useraccount-mamagement"
                                                                        className="col-form-label text-end d-block"
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Khóa</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <input
                                                                        value={course}
                                                                        onChange={(e)=>{
                                                                            handleIsNumber(e,1);
                                                                        }}
                                                                        
                                                                        type="text"
                                                                        className="form-control"
                                                                        id='course-useraccount-mamagement' />
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
                                                                        {/* <option value="1">Trường Công nghệ Thông tin &Truyền thông </option>
                                                                        <option value="2">Trung tâm Điện tử Tin học</option>
                                                                        <option value="3">Phòng Đào tạo</option> */}
                                                                        {
                                                                            managementUnit?.map((currentValue, index) => {
                                                                                return(
                                                                                    <option key={index} value={currentValue.management_unit_name}>{currentValue.management_unit_name}</option>
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
                                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}>Quyền</label>
                                                                </div>
                                                                <div className="col-10">
                                                                    <input 
                                                                        className="form-check-input"
                                                                        checked={role=="Diploma importer"} 
                                                                        onChange={()=>{
                                                                            setRole("Diploma importer")
                                                                        }}
                                                                        type="radio" 
                                                                        id="enter-diploma-user-account-useraccountmanagement" />&nbsp;
                                                                    <label className="form-check-label" htmlFor="enter-diploma-user-account-useraccountmanagement">
                                                                        Nhập văn bằng
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
                                                                        Duyệt văn bằng
                                                                    </label>
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
                                                    className="btn btn-primary"
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
            </div>
        </>
    );
}
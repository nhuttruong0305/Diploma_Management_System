import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import './UserAccountInfo.css';
import {useEffect, useState, useRef} from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import Select from 'react-select';
import Toast from '../Toast/Toast';
export default function UserAccountInfo(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    //Các state dùng cho việc hiện thông tin tài khoản
    const [allFaculty, setAllFaculty] = useState([]);
    const [falcultyOfUser, setFacultyOfUser] = useState("");

    const [allMajors, setAllMajors] = useState([]);
    const [majorOfUser, setMajorOfUser] = useState("");

    const [allManagementUnit, setAllManagementUnit] = useState([]);
    const [managementUnitOfUser, setManagementUnitOfUser] = useState("");
    
    const [roleOfUser, setRoleOfUser] = useState("");
    //Hàm call api lấy danh sách khoa
    const getAllFculty = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/faculty/get_all_faculty");
            setAllFaculty(res.data);
        }catch(error){  
            console.log(error);
        }
    }

    //Hàm lấy ra all majors
    const getAllMajorsShowModal = async () =>{
        try{
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajors(result.data); 
        }catch(error){
            console.log(error);
        }
    }

    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllManagementUnit(res.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllFculty();
        getAllMajorsShowModal();
        getAllManagementUnit();
        if(user?.role[0] == "Diploma importer"){
            setRoleOfUser("Cán bộ nhập văn bằng")
        }else if(user?.role[0] == "Diploma reviewer"){
            setRoleOfUser("Cán bộ duyệt văn bằng");
        }
    }, [])

    useEffect(() => {
        allFaculty?.forEach((currentValue)=>{
            if(user?.faculty == currentValue.faculty_id){
                setFacultyOfUser(currentValue.faculty_name);
            }
        })
        allMajors?.forEach((currentValue)=>{
            if(user?.majors == currentValue.majors_id){
                setMajorOfUser(currentValue.majors_name);
            }
        })
        allManagementUnit?.forEach((currentValue)=>{
            if(user?.management_unit == currentValue.management_unit_id){
                setManagementUnitOfUser(currentValue.management_unit_name);
            }
        })
    }, [allFaculty, allMajors, allManagementUnit]);

    //Các state dùng cho việc chỉnh sửa
    const [fullNameEditModal, setFullNameEditModal] = useState("");
    const [dateOfBirthEditModal, setDateOfBirthEditModal] = useState("");
    const [addressEditModal, setAddressEditModal] = useState("");
    const [CCCDEditModal, setCCCDEditModal] = useState("");
    const [sexEditModal, setSexEditModal] = useState("");
    const handleChaneSexEditModal = (selectedOption) => {
        setSexEditModal(selectedOption);
    }
    const [phoneNumberEditModal,setPhoneNumberEditModal] = useState("");

    const noti = useRef();
    const fullNameEditModalRef = useRef();
    const noti2 = useRef();
    const dateOfBirthEditModalRef = useRef();
    const noti3 = useRef();
    const addressEditModalRef = useRef();
    const noti4 = useRef();
    const CCCDEditModalRef = useRef();
    const noti5 = useRef();
    const phoneNumberEditModalRef = useRef();
    const noti6 = useRef();
    const noti7 = useRef();

    const handleSubmitEditUserAccount = async () => {
        if(fullNameEditModal == ""){
            noti.current.showToast();
            fullNameEditModalRef.current.focus();
            return;
        }
        if(dateOfBirthEditModal == ""){
            noti2.current.showToast();
            dateOfBirthEditModalRef.current.focus();
            return;
        }
        if(addressEditModal == ""){
            noti3.current.showToast();
            addressEditModalRef.current.focus();
            return;
        }
        if(CCCDEditModal == ""){
            noti4.current.showToast();
            CCCDEditModalRef.current.focus();
            return;
        }
        if(phoneNumberEditModal == ""){
            noti5.current.showToast();
            phoneNumberEditModalRef.current.focus();
            return;
        }

        const updateInfor = {
            fullNameEdit: fullNameEditModal,
            dateOfBirthEdit: dateOfBirthEditModal,
            addressEdit: addressEditModal,
            CCCDEdit: CCCDEditModal,
            sexEdit: sexEditModal.value,
            phoneNumberEdit: phoneNumberEditModal
        }
        
        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/edit_user_account_info/${user?._id}`,updateInfor);
            noti6.current.showToast();
        }catch(error){
            noti7.current.showToast();
        }
    }
    return(
        <>
            <Header/>
                {/* Modal chỉnh sửa thông tin tài khoản */}
                <div className="modal fade" id="EditUserAccountModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="EditUserAccountModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="EditUserAccountModalLabel">Chỉnh sửa thông tin tài khoản</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >Họ và tên</label>
                                </div>
                                <div className="col-10">
                                    <input 
                                        type="text" 
                                        ref={fullNameEditModalRef}
                                        className='form-control'
                                        value={fullNameEditModal}
                                        onChange={(e)=>{
                                            setFullNameEditModal(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >Ngày sinh</label>
                                </div>
                                <div className="col-10">
                                    <input 
                                        type="date" 
                                        ref={dateOfBirthEditModalRef}
                                        className='form-control'
                                        value={dateOfBirthEditModal}
                                        onChange={(e)=>{
                                            setDateOfBirthEditModal(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >Địa chỉ</label>
                                </div>
                                <div className="col-10">
                                    <input 
                                        type="text" 
                                        ref={addressEditModalRef}
                                        className='form-control'
                                        value={addressEditModal}
                                        onChange={(e)=>{
                                            setAddressEditModal(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >CCCD</label>
                                </div>
                                <div className="col-10">
                                    <input 
                                        type="text" 
                                        ref={CCCDEditModalRef}
                                        className='form-control'
                                        value={CCCDEditModal}
                                        onChange={(e)=>{
                                            setCCCDEditModal(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >Giới tính</label>
                                </div>
                                <div className="col-10">
                                    <Select
                                        options = {
                                            [
                                                {value: true, label: 'Nam'},
                                                {value: false, label: 'Nữ'}
                                            ]
                                        }
                                        value={sexEditModal}
                                        onChange={handleChaneSexEditModal}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-2">
                                    <label
                                        className="col-form-label text-end d-block"
                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                    >Số điện thoại</label>
                                </div>
                                <div className="col-10">
                                    <input 
                                        type="text" 
                                        ref={phoneNumberEditModalRef}
                                        className='form-control'
                                        value={phoneNumberEditModal}
                                        onChange={(e)=>{
                                            setPhoneNumberEditModal(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button 
                                type="button" 
                                className="btn" 
                                style={{backgroundColor: '#1b95a2'}}
                                onClick={(e)=>{
                                    handleSubmitEditUserAccount();
                                }}
                            >Lưu</button>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="container" id="body-UAI">
                    <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fa-solid fa-sliders"></i>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li id="active-UAI" className="list-group-item">Thông tin tài khoản</li>
                                        <Link style={{textDecoration: 'none'}} to='/'>
                                            <li className="list-group-item">Đổi mật khẩu</li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="card p-3">
                                    <p id="title-UAI">THÔNG TIN TÀI KHOẢN</p>
                                    <div>
                                        <button 
                                            className="btn" 
                                            id="btn-edit-info-UAI"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#EditUserAccountModal"
                                            onClick={(e)=>{
                                                setFullNameEditModal(user?.fullname);
                                                setDateOfBirthEditModal(user?.dateofbirth);
                                                setAddressEditModal(user?.address);
                                                setCCCDEditModal(user?.cccd);
                                                if(user?.sex){
                                                    setSexEditModal({value: true, label: 'Nam'});
                                                }else{
                                                    setSexEditModal({value: false, label: 'Nữ'});
                                                }
                                                setPhoneNumberEditModal(user?.phonenumber);
                                            }}
                                        >Chỉnh sửa thông tin</button>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Họ và tên</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.fullname}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >MSSV/CB</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.mssv_cb}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Email</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.email}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Ngày sinh</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="date" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.dateofbirth}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Địa chỉ</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.address}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >CCCD</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.cccd}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Giới tính</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={
                                                    user?.sex ? "Nam" : "Nữ"
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Số điện thoại</label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                type="text" 
                                                readOnly={true}
                                                className='form-control'
                                                value={user?.phonenumber}
                                            />
                                        </div>
                                    </div>

                                    {
                                        user?.position == "Student" ? (
                                            <>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Lớp</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={user?.class}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Khoa</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={falcultyOfUser}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Ngành</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={majorOfUser}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Khóa</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={user?.course}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Đơn vị quản lý</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={managementUnitOfUser}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >Quyền</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input 
                                                            type="text" 
                                                            readOnly={true}
                                                            className='form-control'
                                                            value={roleOfUser}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Toast
                message="Không được để trống tên"
                type="warning"
                ref={noti}
            />
            <Toast
                message="Không được để trống ngày sinh"
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Không được để trống địa chỉ"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Không được để trống số CCCD"
                type="warning"
                ref={noti4}
            />
            <Toast
                message="Không được để trống số số điện thoại"
                type="warning"
                ref={noti5}
            />
            <Toast
                message="Cập nhật thông tin tài khoản thành công"
                type='success'
                ref={noti6}
            />
            <Toast
                message="Số CCCD đã tồn tại, vui lòng nhập số CCCD khác"
                type='error'
                ref={noti7}
            />
            <Footer/>
        </>
    )
}
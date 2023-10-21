import './ChangePassword.css';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";
import { useState, useRef } from 'react';
import Toast from '../Toast/Toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function ChangePassword(){
    const user = useSelector((state) => state.auth.login?.currentUser);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
    
    const noti = useRef();
    const currentPasswordRef = useRef();
    const noti2 = useRef();
    const newPasswordRef = useRef();
    const newPasswordRepeatRef = useRef();
    const noti3 = useRef();
    const noti4 = useRef();
    const noti5 = useRef();
    const noti6 = useRef();
    //Hàm kiểm tra xem các ô input đã được nhập chưa
    const handleChangePassword = async () => {
        if(currentPassword == ""){
            noti.current.showToast();
            currentPasswordRef.current.focus();
            return;
        }
        if(newPassword == ""){
            noti2.current.showToast();
            newPasswordRef.current.focus();
            return;
        }
        if(newPasswordRepeat == ""){
            noti2.current.showToast();
            newPasswordRepeatRef.current.focus();
            return;
        }

        if(newPassword != newPasswordRepeat){
            noti4.current.showToast();
            return;
        }

        if(newPassword.length<6){
            noti6.current.showToast();
            return;
        }

        const updateInfor = {
            currentPassword: currentPassword,
            newPassword: newPasswordRepeat
        }

        try{
            const res = await axios.put(`http://localhost:8000/v1/user_account/change_password/${user?._id}`, updateInfor);
            noti5.current.showToast();
        }catch(error){
            noti3.current.showToast();
            return;
        }
    }

    return(
        <>
            <Header/>
                <div className="container" id='body-CP'>
                    <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fa-solid fa-sliders"></i>
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <Link style={{textDecoration: 'none'}} to='/user-account-info'>
                                            <li className="list-group-item">Thông tin tài khoản</li>
                                        </Link>
                                        <li id='active-CP' className="list-group-item">Đổi mật khẩu</li>   
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="card p-3">
                                    <p id='title-CP'>ĐỔI MẬT KHẨU</p>
                                    <div className='row mt-3'>
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Nhập mật khẩu hiện tại</label>
                                        </div>
                                        <div className="col-6">
                                            <input 
                                                type="password" 
                                                className='form-control'
                                                ref={currentPasswordRef}
                                                value={currentPassword}
                                                onChange={(e)=>{
                                                    setCurrentPassword(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mt-3'>
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Nhập mật khẩu mới</label>
                                        </div>
                                        <div className="col-6">
                                            <input 
                                                type="password" 
                                                className='form-control'
                                                ref={newPasswordRef}
                                                value={newPassword}
                                                onChange={(e)=>{
                                                    setNewPassword(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mt-3'>
                                        <div className="col-2">
                                            <label
                                                className="col-form-label text-end d-block"
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >Nhập lại mật khẩu mới</label>
                                        </div>
                                        <div className="col-6">
                                            <input 
                                                type="password" 
                                                className='form-control'
                                                ref={newPasswordRepeatRef}
                                                value={newPasswordRepeat}
                                                onChange={(e)=>{
                                                    setNewPasswordRepeat(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className='row mt-4'>
                                        <div className="col-md-3 offset-md-6">
                                            <button 
                                                className='btn' 
                                                style={{backgroundColor: '#1b95a2'}}
                                                data-bs-toggle="modal" 
                                                data-bs-target="#showQuestionModal"
                                                
                                            >Đổi mật khẩu</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal hiển thị để người dùng quyết định có đổi mật khẩu không */}
                <div className="modal fade" id="showQuestionModal" tabIndex="-1" aria-labelledby="showQuestionModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="showQuestionModalLabel"></h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h4 style={{textAlign: 'center'}}>BẠN CÓ CHẮC MUỐN ĐỔI MẬT KHẨU</h4>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
                            <button 
                                type="button" 
                                className="btn" 
                                style={{backgroundColor: '#1b95a2'}}
                                onClick={(e)=>{
                                    handleChangePassword();
                                }}
                            >Lưu thay đổi</button>
                        </div>
                        </div>
                    </div>
                </div>
                <Toast
                    message="Vui lòng nhập mật khẩu hiện tại"
                    type="warning"
                    ref={noti}
                />
                <Toast
                    message="Vui lòng nhập mật khẩu mới"
                    type="warning"
                    ref={noti2}
                />
                <Toast
                    message="Mật khẩu hiện tại không đúng, vui lòng nhập lại"
                    type="error"
                    ref={noti3}
                />
                <Toast
                    message="Nhập lại mật khẩu mới không chính xác"
                    type="warning"
                    ref={noti4}
                />
                <Toast
                    message="Đổi mật khẩu thành công"
                    type="success"
                    ref={noti5}
                />
                <Toast
                    message="Mật khẩu phải có ít nhất 6 ký tự"
                    type="warning"
                    ref={noti6}
                />
            <Footer/>
        </>
    )
}
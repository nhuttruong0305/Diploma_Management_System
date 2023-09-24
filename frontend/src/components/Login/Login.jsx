import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch} from 'react-redux';

import Header from "../Header/Header";
import './Login.css';
import {loginUser} from "../../redux/apiRequest";


export default function Login(){
    const [mssv_cb, setMssv_cb] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        //lấy thông tin đăng nhập đưa vào object
        const loginInfor = {
            mssv_cb: mssv_cb,
            password: password
        };
        loginUser(loginInfor, dispatch, navigate);
    }

    return(
        <>
            <Header/>
            <div id="body-login" className="container">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <h3 className="text-center" style={{fontWeight: 'bold', borderBottom:'1px solid #0b619d'}}>ĐĂNG NHẬP</h3>
                    <div className="row">
                        <div className="col-lg"></div>
                        <div className="col">
                            <form id="form-login" onSubmit={(e)=>{
                                handleSubmit(e);
                            }}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                                    <input 
                                        value={mssv_cb}
                                        onChange={(e)=>{
                                            setMssv_cb(e.target.value);
                                        }}
                                        type="text" 
                                        className="form-control" 
                                        id="username"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                                    <input 
                                        value={password}
                                        onChange={(e)=>{
                                            setPassword(e.target.value);
                                        }}
                                        type="password" 
                                        className="form-control" 
                                        id="password"/>
                                </div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="remember_1"/>
                                    <label className="form-check-label" htmlFor="remember_1">Ghi nhớ đăng nhập</label>
                                </div>
                                <button className='btn btn-primary mt-3' id="btn-login" type="submit" form="form-login">Đăng nhập</button>
                            </form>
                        </div>
                        <div className="col-lg"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
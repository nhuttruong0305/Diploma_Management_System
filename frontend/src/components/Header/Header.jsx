import './Header.css';
import Navbar from '../Navbar/Navbar';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { logoutUser } from '../../redux/apiRequest';

export default function Header(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const btn_logout = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Hàm xử lý ẩn hiện nút đăng xuất
    const handleShowLogoutButton = () => {
        if(btn_logout.current.style.display != "none"){
            btn_logout.current.style.display = 'none';
        }else{
            btn_logout.current.style.display = 'block';    
        }
    }

    //Hàm xử lý việc đăng xuất
    const handleLogout = () => {
        logoutUser(dispatch, navigate);
    }

    return(
        <>
            <div className='container' id='background-header'>
                <div className="row">
                    <div className='col-md-1'>
                        <img id='logo-header' src="https://qlvb.ctu.edu.vn/image/layout_set_logo?img_id=2450798&t=1686463767127" alt="Đang tải hình ảnh" />
                    </div>
                    <div className='col-md-9'>
                        <p style={{fontSize: '18px', color: '#fff', marginBottom: '0px'}}>TRƯỜNG ĐẠI HỌC CẦN THƠ</p>
                        <p style={{fontSize: '16px', color: '#FDFFD0'}}>Hệ thống tra cứu văn bằng chứng chỉ</p>
                    </div>
                    <div className="col-md-2">
                        {user ? (
                            <>
                                {/* button này sẽ sổ xuống cho người dùng chọn vào xem và chỉnh sửa profile hoặc đăng xuất */}
                                <div>
                                    <div className="d-flex">
                                        <button id='btn-userinfor-login-header' className='btn btn-primary'>{user.fullname}</button>
                                        <button 
                                            className='btn btn-primary' 
                                            id='btn-show-logout'
                                            onClick={handleShowLogoutButton}
                                        ><i className="fa-solid fa-caret-down"></i></button>
                                    </div>
                                </div>
                                    <div>
                                        <button 
                                            id='btn-logout-header' 
                                            className='btn btn-primary'
                                            ref={btn_logout}
                                            onClick={handleLogout}
                                        ><i className="fa-solid fa-power-off"></i> Đăng xuất</button>
                                    </div> 
                            </>
                        ) : (
                            <Link to="/login">
                                <button id='btn-login-header' className='btn btn-primary'>Đăng nhập</button>
                            </Link>
                        )}
                    </div>
                </div>
                <div className='row pb-2'>
                    <Navbar/>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col" id='title-header'>
                    Tra cứu văn bằng chứng chỉ
                    </div>
                </div>
            </div>
        </>
    );
}
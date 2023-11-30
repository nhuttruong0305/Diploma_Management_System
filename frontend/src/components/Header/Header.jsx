import './Header.css';
import Navbar from '../Navbar/Navbar';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { logoutUser } from '../../redux/apiRequest';
import header_img from '../../assets/header_img.png';
import header2 from '../../assets/header2.png';

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
            <div className="container">
                <div className="row pt-3">
                    <div className='col-md-1'>
                        <img id='logo-header' src="https://qlvb.ctu.edu.vn/image/layout_set_logo?img_id=2450798&t=1686463767127" alt="Đang tải hình ảnh" />
                    </div>
                    <div className="col-md-6">
                        <div style={{fontWeight: 'bold', fontSize: '35px', color: '#00abeb'}}>TRƯỜNG ĐẠI HỌC CẦN THƠ</div>
                        <div style={{fontSize: '26px', color: 'black'}}>Hệ thống tra cứu văn bằng chứng chỉ</div>
                    </div>
                    <div className="col-md-3">
                        <div>
                        <img 
                            style={{display: 'block', width: '170px'}}
                            src={header_img}
                            alt="Đang tải hình ảnh" />
                        </div>
                        
                    </div>
                    <div className="col-md-2">
                        {user ? (
                            <>
                                {/* button này sẽ sổ xuống cho người dùng chọn vào xem và chỉnh sửa profile hoặc đăng xuất */}
                                <div>
                                    <div className="d-flex">
                                        <button 
                                                id='btn-userinfor-login-header' 
                                                className='btn btn-primary'><Link 
                                                                                style={{color: 'white', textDecoration: 'none'}} 
                                                                                to='/user-account-info'>
                                                                                    {
                                                                                        user.fullname == "System administrator" ? ("Người quản trị") : (user.fullname)
                                                                                    }</Link></button>
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
                                            className='btn'
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
            </div>      
                
            <div className='mt-4'>
                <img 
                    src={header2} 
                    alt="Đang tải hình ảnh" 
                    style={{display: 'block', height:'270px', width: '100%'}}
                />
            </div>
            <div className="container">
                <div className="row">
                    <Navbar/>
                </div>
            </div>        
        </>
    );
}
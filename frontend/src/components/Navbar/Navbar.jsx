//Navbar này tạm thời được dùng cho HomePageSystemAdminstrator

import { useSelector } from 'react-redux';
import { Link} from "react-router-dom";
import './Navbar.css'
import { useEffect } from 'react';

export default function Navbar() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.role[0];//hiện chỉ xử lý 1 user có 1 quyền duy nhất
    // const [currentURL, setCurrentURL] = useState("");    
    var currentElement = document.querySelector(".trang-chu");
    useEffect(()=>{
        let currentURL = window.location.pathname;
        switch(currentURL) {
            case '/': 
                if(role == 'System administrator'){
                    var currentElement = document.querySelector("#trang-chu1");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    
                    break;
                }else if(role == 'Diploma importer'){
                    var currentElement = document.querySelector("#trang-chu2");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }else if(role == 'Diploma reviewer'){
                    var currentElement = document.querySelector("#trang-chu3");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }else if(role == "Center Director_Head of Department"){
                    var currentElement = document.querySelector("#trang-chu5");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }else if(role == "Leader"){
                    var currentElement = document.querySelector("#trang-chu6");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }else if(role == "Secretary"){
                    var currentElement = document.querySelector("#trang-chu7");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }else if(role == "Stocker"){
                    var currentElement = document.querySelector("#trang-chu8");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }
                else{
                    var currentElement = document.querySelector("#trang-chu4");
                    if(currentElement!=null){
                        currentElement.classList.add("active-nav-navbar");  
                    }
                    break;
                }
            case '/diploma-type':
            case '/decentralize-diploma-management':
            case '/diploma-name':
            case '/diploma-name-management-history':
                var currentElement = document.querySelector("#quan-ly-van-bang");
                currentElement.classList.add("active-nav-navbar");
                break;
            case '/user-account-management':
            case '/manage-user-permission':
                var currentElement = document.querySelector("#quan-ly-nguoi-dung");
                currentElement.classList.add("active-nav-navbar");
                break;  
            case '/diploma-issuance':
                var currentElement = document.querySelector("#quan-ly-dot-cap-van-bang");
                currentElement.classList.add("active-nav-navbar");
                break;         
            case '/import-diploma':
                var currentElement = document.querySelector("#quan-ly-nhap-van-bang");
                currentElement.classList.add("active-nav-navbar");
                break;    
            case '/review-diploma':
                var currentElement = document.querySelector("#duyet-van-bang");
                currentElement.classList.add("active-nav-navbar");
                break;
            case '/diploma-diary':
                var currentElement = document.querySelector("#nhat-ky-van-bang");
                currentElement.classList.add("active-nav-navbar");
                break;  
            case '/manage_requests_for_diploma_drafts':
                var currentElement = document.querySelector("#quan-ly-yc-cap-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;
            case '/approve_request_for_issuance_of_embryos':
                var currentElement = document.querySelector("#duyet-yc-cap-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;
            case '/manage_requests_for_embryo_issuance_for_secretary':
                var currentElement = document.querySelector("#quan-ly-yc-cap-phoi-cho-thu-ky");
                currentElement.classList.add("active-nav-navbar");
                break;
            case '/statistical':
                var currentElement = document.querySelector("#thong-ke-bao-cao");
                currentElement.classList.add("active-nav-navbar");
                break;
            case "/manage_requests_for_embryo_issuance_for_stocker":
                var currentElement = document.querySelector("#xu-ly-yc-xin-cap-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;
            case "/unit_price_management":
                var currentElement = document.querySelector("#quan-ly-gia-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;
            case "/management_of_damaged_embryos": 
                var currentElement = document.querySelector("#quan-ly-phoi-hu");
                currentElement.classList.add("active-nav-navbar");
                break;
            case "/create_request_reissue":
                var currentElement = document.querySelector("#tao-yc-cap-lai-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;
            case "/approve_request_for_reissue":
                var currentElement = document.querySelector("#duyet-yc-cap-lai-phoi");
                currentElement.classList.add("active-nav-navbar");
                break;    
            }
    })

    
    
    return (
        <>
            <nav className="navbar navbar-expand-lg py-0" id='contain-nav'>
                <div style={{padding: '12px 15px 12px 15px'}}>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {role == 'System administrator' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/"
                                        id='trang-chu1'
                                    >Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/diploma-type"
                                        id='quan-ly-van-bang'
                                    >Quản lý văn bằng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/user-account-management"
                                        id='quan-ly-nguoi-dung'
                                    >Quản lý người dùng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/diploma-diary"
                                        id='nhat-ky-van-bang'
                                    >Nhật ký văn bằng</Link>
                                </li>
                            </ul>
                        ) : role == 'Diploma importer' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/"
                                        id='trang-chu2'
                                    >Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/diploma-issuance"
                                        id='quan-ly-dot-cap-van-bang'
                                    >Quản lý đợt cấp văn bằng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link 
                                        className="nav-link nav-link-navbar" 
                                        to="/import-diploma"
                                        id='quan-ly-nhap-van-bang'
                                    >Quản lý nhập văn bằng</Link>
                                </li>
                            </ul>
                        ) : role == 'Diploma reviewer' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu3'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/review-diploma" id='duyet-van-bang'>Duyệt văn bằng</Link>
                                </li>
                            </ul>
                        ) : role == 'Center Director_Head of Department' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu5'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/manage_requests_for_diploma_drafts" id='quan-ly-yc-cap-phoi'>Quản lý yêu cầu xin cấp phôi văn bằng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/create_request_reissue" id='tao-yc-cap-lai-phoi'>Tạo yêu cầu xin cấp lại phôi</Link>
                                </li>
                            </ul>
                        ) : role == "Leader" ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu6'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/approve_request_for_issuance_of_embryos" id='duyet-yc-cap-phoi'>Duyệt yêu cầu xin cấp phôi văn bằng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/approve_request_for_reissue" id='duyet-yc-cap-lai-phoi'>Duyệt yêu cầu xin cấp lại phôi</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/statistical" id='thong-ke-bao-cao'>Thống kê báo cáo</Link>
                                </li>
                            </ul>
                        ) : role == "Secretary" ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu7'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/manage_requests_for_embryo_issuance_for_secretary" id='quan-ly-yc-cap-phoi-cho-thu-ky'>Quản lý yêu cầu xin cấp phôi văn bằng</Link>
                                </li>
                            </ul>
                        ) : role == "Stocker" ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu8'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/manage_requests_for_embryo_issuance_for_stocker" id='xu-ly-yc-xin-cap-phoi'>Xử lý yêu cầu xin cấp phôi văn bằng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/unit_price_management" id='quan-ly-gia-phoi'>Quản lý giá phôi</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/management_of_damaged_embryos" id='quan-ly-phoi-hu'>Quản lý phôi bị hư</Link>
                                </li>
                            </ul>
                        ) : (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/" id='trang-chu4'>Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Hướng dẫn sử dụng</a>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}


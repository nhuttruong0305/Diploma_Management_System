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
        // console.log(currentURL);
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
                    console.log("!11");
                    break;
                }else{
                    var currentElement = document.querySelector("#trang-chu3");
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
                                    <a className="nav-link nav-link-navbar" href="#">Nhật ký văn bằng</a>
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
                        ) : (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Tra cứu</a>
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


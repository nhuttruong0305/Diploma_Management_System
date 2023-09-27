//Navbar này tạm thời được dùng cho HomePageSystemAdminstrator

import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'

export default function Navbar() {

    const user = useSelector((state) => state.auth.login?.currentUser);
    const role = user?.role[0];//hiện chỉ xử lý 1 user có 1 quyền duy nhất


    return (
        <>
            <nav className="navbar navbar-expand-lg py-0 mt-3">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">

                        {role == 'System administrator' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/">Tra cứu</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Quản lý văn bằng</a>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <Link className="nav-link nav-link-navbar" to="/user-account-management">Quản lý người dùng</Link>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Nhật ký văn bằng</a>
                                </li>
                            </ul>
                        ) : role == 'Diploma importer' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Tra cứu</a>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Quản lý đợt cấp văn bằng</a>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Quản lý nhập văn bằng</a>
                                </li>
                            </ul>
                        ) : role == 'Diploma reviewer' ? (
                            <ul className="navbar-nav">
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Tra cứu</a>
                                </li>
                                <li className="nav-item nav-item-navbar">
                                    <a className="nav-link nav-link-navbar" href="#">Duyệt văn bằng</a>
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


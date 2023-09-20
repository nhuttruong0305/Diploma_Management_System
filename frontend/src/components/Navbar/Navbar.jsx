//Navbar này tạm thời được dùng cho HomePageSystemAdminstrator

import './Navbar.css'

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg py-0 mt-3">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item nav-item-navbar">
                                <a className="nav-link nav-link-navbar" href="#">Tra cứu</a>
                            </li>
                            <li className="nav-item nav-item-navbar">
                                <a className="nav-link nav-link-navbar" href="#">Quản lý văn bằng</a>
                            </li>
                            <li className="nav-item nav-item-navbar">
                                <a className="nav-link nav-link-navbar" href="#">Quản lý người dùng</a>
                            </li>
                            <li className="nav-item nav-item-navbar">
                                <a className="nav-link nav-link-navbar" href="#">Nhật ký văn bằng</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}


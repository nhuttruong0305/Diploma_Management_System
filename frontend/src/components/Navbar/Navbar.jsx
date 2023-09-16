//Navbar này tạm thời được dùng cho HomePageSystemAdminstrator

import './Navbar.css'

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Tra cứu</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Phân quyền quản lý văn bằng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Phân quyền người dùng quản lý</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Danh mục loại văn bằng</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Nhật ký văn bằng</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}


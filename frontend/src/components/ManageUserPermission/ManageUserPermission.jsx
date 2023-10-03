import Header from "../Header/Header";
import "./ManageUserPermission.css";
import { Link } from 'react-router-dom';

export default function ManageUserPermission(){
    return(
        <>
            <Header/>
            <div className="container" id="body-MUP">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/user-account-management'>
                                        <li className="list-group-item">Thêm tài khoản</li>
                                    </Link>
                                    <li id='active-MUP' className="list-group-item">Phân quyền người dùng quản lý</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
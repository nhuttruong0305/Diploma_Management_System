//Trang xử lý các yc xin cấp lại phôi của thư ký 
//Chi tiết xử lý: Cập nhật trạng thái yêu cầu thành "Đã gửi thủ kho"

import './RequestReissueForSecretary.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
export default function RequestReissueForSecretary(){
    return(
        <>
        <Header/>
        <div id='body-request-reissue-for-secretary' className="container">
            <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-header">
                                <i className="fa-solid fa-sliders"></i>
                            </div>
                            <ul className="list-group list-group-flush">
                                <li style={{backgroundColor: '#1b95a2', color: 'white'}} className="list-group-item">Các yêu cầu cấp lại phôi đã được duyệt</li>
                                <Link style={{textDecoration: 'none'}} to='/'>
                                    <li className="list-group-item">Các yêu cầu cấp lại phôi đã được thủ kho xử lý</li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card p-3">
                            <div className="row">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}
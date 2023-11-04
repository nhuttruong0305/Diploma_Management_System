//Quản lý yêu cầu cấp phôi cho thư ký

import './ManageRequestsForEmbryoIssuanceForSecretary.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
export default function ManageRequestsForEmbryoIssuanceForSecretary(){
    return(
        <>  
            <Header/>
            <div className="container" id='body-MRFEIFS'> 
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li style={{backgroundColor: '#1b95a2'}} className="list-group-item">Các yêu cầu xin cấp phôi đã được duyệt</li>
                                    <Link style={{textDecoration: 'none'}} to='/'>
                                        <li className="list-group-item">Các yêu cầu xin cấp phôi đã được thủ kho xử lý</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className='card p-3'>
                                
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
            <Footer/>
        </>
    )
}
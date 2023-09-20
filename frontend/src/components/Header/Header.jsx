import './Header.css';
import Navbar from '../Navbar/Navbar';

export default function Header(){
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
                        <button id='btn-login-header' className='btn btn-primary'>Đăng nhập</button>
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
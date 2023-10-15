import Header from '../Header/Header'
import './HomePage.css';
import Footer from '../Footer/Footer';

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="container" id='body-homepage'>
                <form style={{backgroundColor: '#ffffff', borderRadius: '10px'}}>
                    <div id='form-search-homepage'>
                        <div id='bg-orange-homepage'>
                            <h5 id='tittle-in-bg-orange-homepage'>
                                Tìm kiếm
                                <p style={{fontSize: '25px', color: '#fff200', marginBottom: '0px'}}>VĂN BẰNG</p>
                            </h5>
                            <div style={{color: 'white'}}>
                                <img 
                                    style={{width: '40px', marginLeft: '70px', marginRight: '10px'}}
                                    src="https://www.web30s.vn/images/icon-arrow.svg" 
                                    alt="Đang tải hình ảnh" />
                                Tại đây 
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 offset-md-2">
                                <label htmlFor="diploma-name-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Tên văn bằng <span style={{color: 'red'}}>*</span></label>
                            </div>
                            <div className="col-5">
                                <input type="text" id="diploma-name-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label htmlFor="fullname-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Họ tên</label>
                            </div>
                            <div className="col-5">
                                <input type="text" id="fullname-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label htmlFor="certificate-number-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Số hiệu</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="certificate-number-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label htmlFor="reference-number-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Số vào sổ</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="reference-number-homepage" className="form-control"/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Footer/>
        </>
    );
}
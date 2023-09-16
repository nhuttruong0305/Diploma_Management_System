import Header from '../Header/Header'
import './HomePage.css';

export default function HomePage() {
    return (
        <>
            <Header />
            <div className="container" id='body-homepage'>
                <form style={{backgroundColor: '#ffffff', padding: '10px', borderRadius: '10px'}}>
                    <div id='form-search-homepage'>
                        <div className="row">
                            <div className="col-2 offset-md-2">
                                <label for="diploma-name-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Tên văn bằng <span style={{color: 'red'}}>*</span></label>
                            </div>
                            <div className="col-5">
                                <input type="text" id="diploma-name-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label for="fullname-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Họ tên</label>
                            </div>
                            <div className="col-5">
                                <input type="text" id="fullname-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label for="certificate-number-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Số hiệu</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="certificate-number-homepage" className="form-control"/>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label for="reference-number-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Số vào sổ</label>
                            </div>
                            <div className="col-3">
                                <input type="text" id="reference-number-homepage" className="form-control"/>
                            </div>
                        </div>
                    </div>
                </form>
                
            </div>
        </>
    );
}
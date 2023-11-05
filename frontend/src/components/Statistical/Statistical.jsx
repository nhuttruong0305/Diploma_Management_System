import './Statistical.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import chart_img1 from '../../assets/chart_img1-removebg-preview.png'
import chart_img2 from '../../assets/chart_img2-removebg-preview.png'
import chart_img3 from '../../assets/chart_img3-removebg-preview.png'
import chart_img4 from '../../assets/chart_img4-removebg-preview.png'

export default function Statistical() {
    return (
        <>
            <Header />
            <div className="container" id='body-Statistical'>
                <div className='row' style={{ backgroundColor: '#e4e5e7', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#21acdd" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Văn bằng được nhập</p>
                            <p className='detail-count-type-statistical'><i class="fa-solid fa-eye"></i></p>
                            <img 
                                src={chart_img1} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#63c5de" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Văn bằng được duyệt</p>
                            <p className='detail-count-type-statistical'><i class="fa-solid fa-eye"></i></p>
                            <img 
                                src={chart_img2} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#fdce00" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Yêu cầu xin cấp phôi được tạo</p>
                            <p className='detail-count-type-statistical'><i class="fa-solid fa-eye"></i></p>
                            <img 
                                src={chart_img3} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#fd6b6b" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Yêu cầu xin cấp phôi được xử lý</p>
                            <p className='detail-count-type-statistical'><i class="fa-solid fa-eye"></i></p>
                            <img 
                                src={chart_img4} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            /> 
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

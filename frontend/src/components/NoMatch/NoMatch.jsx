import Header from "../Header/Header"
import Footer from "../Footer/Footer"
import { Link} from "react-router-dom";
export default function NoMatch(){
    return(
        <>
            <Header/>
            <div className="container" style={{textAlign: 'center', backgroundColor: 'white'}}>
                <img src="https://lambanner.com/wp-content/uploads/2020/08/MNT-DESIGN-MAU-TRANG-BAO-LOI-404-1-1130x570.jpg" width='70%' />
                <div>
                    <div style={{width: '70%', backgroundColor: '#ddca16', margin: '0 auto', paddingTop: '50px', paddingBottom: '50px', fontSize: '30px', color: 'white', borderRadius: '10px' }}>
                        Ối! Trang bạn yêu cầu không tìm thấy!
                        <Link to='/' style={{ textDecoration: 'none'}}>
                            <button className="btn" style={{backgroundColor:'grey', display: 'block', fontSize: '20px', borderRadius: '5px', margin: '0 auto'}}>Về trang chủ</button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
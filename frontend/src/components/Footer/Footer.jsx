import Vy291 from '../../assets/Vy-291.jpg';
import Vy420 from '../../assets/Vy-420.jpg';
import Vy468 from '../../assets/Vy-468.jpg';
import './Footer.css';
import BackToTop from '../BackToTop/BackToTop';
export default function Footer(){
    return(        
        <>
            <div className="container pt-3" id='contain-footer'>
                {/* <div className="row mb-3">
                    <div className="col-md-4">
                        <img src={Vy291} alt="" style={{width: '100%'}}/>
                    </div>
                    <div className="col-md-4">
                        <img src={Vy420} alt="" style={{width: '100%'}}/>
                    </div>
                    <div className="col-md-4">
                        <img src={Vy468} alt="" style={{width: '100%'}}/>
                    </div>
                </div> */}
                <div style={{backgroundColor: '#3a454b', height:'70px'}} className="row d-flex align-items-center">
                    <p style={{color:'white', marginBottom: '0px', textAlign: 'center'}}>Copyright © 2022, Diploma Management System by B1910015</p>
                </div>
            </div>
            <BackToTop/>
        </>
    )
}
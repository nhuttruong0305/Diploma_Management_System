import './Statistical.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import bie from '../../assets/pngtree-pie-chart-illustration-image_1407432-removebg-preview.png'
import Select from 'react-select';
import { useEffect, useState } from 'react';
import BarChart from '../BarChart/BarChart';
import axios from 'axios';
export default function Statistical() {

    //State chứa giá trị của loại thống kê
    const [statisticalType, setStatisticalType] = useState({value:"Thống kê theo tháng" , label:"Thống kê theo tháng"});
    const handleChangeStatisticalType = (seletedOption) => {
        setStatisticalType(seletedOption);
    }

    //State chứa năm thống kê
    const [statistical_year, setStatistical_year] = useState("");
    //State show input chọn năm khi loại thống kê là thống kê theo tháng
    const [showMonthStatistical, setshowMonthStatistical] = useState(false);

    //State chứa ngày bắt đầu
    const [startDate, setStartDate] = useState("");
    //State chứa ngày kết thúc
    const [endDate, setEndDate] = useState("");
    //State show input chọn ngày khi loại thống kê là thống kê theo đơn vị quản lý
    const [showStatisticalMU, setShowStatisticalMU] = useState(false);

    const [showChart, setShowChart] = useState(false);

    useEffect(()=>{
        if(statisticalType!=""){
            if(statisticalType.value == "Thống kê theo tháng"){
                setshowMonthStatistical(true);
                setShowStatisticalMU(false);
                setStartDate("");
                setEndDate("");
            }
            if(statisticalType.value == "Thống kê theo đơn vị quản lý"){
                setshowMonthStatistical(false);
                setShowStatisticalMU(true);
                setStatistical_year("");
            }
        }
    }, [statisticalType])

    //State chứa all diploma được nhập
    const [allDiplomaImported, setAllDiplomaImported] = useState([]);
    //State chứa all diploma được duyệt
    const [allDiplomaReviewed, setAllDiplomaReviewed] = useState([]);
    //State chứa all YCCP được tạo
    const [allYCCPImported, setAllYCCPImported] = useState([]);
    //State chứa all YCCP đã dc xử lý
    const [allYCCPReviewed, setAllYCCPReviewed] = useState([]);

    //Hàm lấy all văn bằng dc nhập
    const getallInfor = async () => {
        try{
            const result = await axios.get("http://localhost:8000/v1/diploma/get_all_diploma_imported");
            setAllDiplomaImported(result.data);
        }catch(error){
            console.log(error);
        }

        try{
            const result = await axios.get("http://localhost:8000/v1/diploma/get_all_diploma_reviewed");
            setAllDiplomaReviewed(result.data);
        }catch(error){
            console.log(error);
        }

        try{
            const result = await axios.get("http://localhost:8000/v1/embryo_issuance_request/get_all_yccp_imported");
            setAllYCCPImported(result.data);
        }catch(error){
            console.log(error);
        }

        try{
            const result = await axios.get("http://localhost:8000/v1/embryo_issuance_request/get_all_yccp_reviewed");
            setAllYCCPReviewed(result.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getallInfor();
    }, [])

    //Xử lý logic cho việc thống kê theo tháng
    //Mảng chứa số văn bằng được nhập mỗi tháng của label 1: "Văn bằng được nhập"
    const [label1ByMonth, setLabel1ByMonth] = useState([]);
    //Mảng chứa số văn bằng được duyệt mỗi tháng của label 2: "Văn bằng được duyệt"
    const [label2ByMonth, setLabel2ByMonth] = useState([]);
    //Mảng chứa số yccp được tạo mỗi tháng của label 3: "Yêu cầu xin cấp phôi được tạo"
    const [label3ByMonth, setLabel3ByMonth] = useState([]);
    //Mảng chứa số yccp được xử lý mỗi tháng của label 4: "Yêu cầu xin cấp phôi được xử lý"
    const [label4ByMonth, setLabel4ByMonth] = useState([]);    

    useEffect(()=>{

    }, )

    useEffect(()=>{
        if(statisticalType.value == "Thống kê theo tháng"){
            if(statistical_year!=""){
                setShowChart(true);
            }else{
                setShowChart(false);
            }
        }

        if(statisticalType.value == "Thống kê theo đơn vị quản lý"){
            if(startDate!="" && endDate!=""){
                setShowChart(true);
            }else{
                setShowChart(false);
            }
        }
    }, [statistical_year, startDate, endDate]);

    return (
        <>
            <Header />
            <div className="container" id='body-Statistical'>
                <div className='row' style={{ backgroundColor: '#e4e5e7', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#21acdd" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Văn bằng được nhập</p>
                            <p className='detail-count-type-statistical'><i className="fa-solid fa-eye"></i></p>
                            <img 
                                src={bie} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#63c5de" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Văn bằng được duyệt</p>
                            <p className='detail-count-type-statistical'><i className="fa-solid fa-eye"></i></p>
                            <img 
                                src={bie} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#fdce00" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Yêu cầu xin cấp phôi được tạo</p>
                            <p className='detail-count-type-statistical'><i className="fa-solid fa-eye"></i></p>
                            <img 
                                src={bie} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className='info-statistical' style={{ backgroundColor: "#fd6b6b" }}>
                            <p className='count-statistical'>26</p>
                            <p className='count-type-statistical'>Yêu cầu xin cấp phôi được xử lý</p>
                            <p className='detail-count-type-statistical'><i className="fa-solid fa-eye"></i></p>
                            <img 
                                src={bie} alt="Đang tải hình ảnh" 
                                className='chart-img'
                            /> 
                        </div>
                    </div>
                </div>
                <div className='title-list-yc-xin-cap-phoi' style={{marginTop: "30px"}}>
                    THỐNG KÊ VĂN BẰNG CHỨNG CHỈ
                </div>
                <div className="card p-4">
                    <div className="row">
                        <div className="col-md-5">
                            <Select
                                placeholder="Chọn loại thống kê"
                                options={
                                    [
                                        {value:"Thống kê theo tháng", label:"Thống kê theo tháng"},
                                        {value:"Thống kê theo đơn vị quản lý", label:"Thống kê theo đơn vị quản lý"}
                                    ]
                                }
                                value={statisticalType}
                                onChange={handleChangeStatisticalType}
                            />
                        </div>
                        {   showMonthStatistical ? (
                            <div className="col-md-3 offset-md-4">
                                <input 
                                    type="number" 
                                    className='form-control'
                                    placeholder='Nhập năm thống kê'
                                    value={statistical_year}
                                    onChange={(e)=>{
                                        setStatistical_year(e.target.value);
                                    }}
                                />
                            </div>
                        ) : ("")
                            
                        }
                        {
                            showStatisticalMU ? (
                                <div className="col-md-5 offset-md-2">
                                    <div className="card p-3">
                                        <div style={{textAlign:"center", fontWeight: "bold", fontSize: '20px', color: '#fed25c'}}>
                                            CHỌN THỜI GIAN THỐNG KÊ
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-4">Từ ngày</div>
                                            <div className="col-8">
                                                <input 
                                                    type="date" 
                                                    className='form-control'
                                                    value={startDate}
                                                    onChange={(e)=>{
                                                        setStartDate(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-4">Đến ngày</div>
                                            <div className="col-8">
                                                <input 
                                                    type="date" 
                                                    className='form-control'
                                                    value={endDate}
                                                    onChange={(e)=>{
                                                        setEndDate(e.target.value)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : ("")
                        }
                    </div>
                    {
                        showChart ? (
                            <div className="row mt-2" style={{padding: '30px'}}>
                                <BarChart
                                    statisticalType={statisticalType.value}
                                >
                                </BarChart>
                            </div>
                        ) : ("")
                    }
                </div>
            </div>
            <Footer />
        </>
    )
}

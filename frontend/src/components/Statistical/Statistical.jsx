//chức năng thống kê cho các tài khoản của tổ QL VBCC

import './Statistical.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import bie from '../../assets/pngtree-pie-chart-illustration-image_1407432-removebg-preview.png'
import Select from 'react-select';
import { useEffect, useState } from 'react';
import BarChart from '../BarChart/BarChart';
import BarChart_TK_SoPhoi from '../BarChart/BarChart_TK_SoPhoi';
import axios from 'axios';
export default function Statistical() {

    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            let result = [];
            res.data.forEach((currentValue)=>{
                if(currentValue.management_unit_id != 13){
                    result = [...result, currentValue];
                }
            })
            setAllManagementUnit(result);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllManagementUnit();
    }, [])

    //State chứa giá trị của loại thống kê
    const [statisticalType, setStatisticalType] = useState({ value: "Thống kê theo tháng", label: "Thống kê theo tháng" });
    const handleChangeStatisticalType = (seletedOption) => {
        setStatisticalType(seletedOption);
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    //State chứa năm thống kê
    const [statistical_year, setStatistical_year] = useState(currentYear);
    //State show input chọn năm khi loại thống kê là thống kê theo tháng
    const [showMonthStatistical, setshowMonthStatistical] = useState(false);

    //State chưa mảng số yêu cầu cấp mới dc tạo theo tháng
    const [yc_dc_tao_theo_thang, setYc_dc_tao_theo_thang] = useState([]);
    //State chứa mảng số yc xin cấp lại dc tạo theo tháng
    const [yc_xin_cap_lai_theo_thang, setYc_xin_cap_lai_theo_thang] = useState([]);
    //State chứa mảng só yc dc xử lý theo tháng
    const [yc_da_dc_xl_theo_thang, setYc_da_dc_xl_theo_thang] = useState([]);
    //State chứa mảng số phôi đã cấp theo tháng
    const [so_phoi_da_cap_theo_thang, setSo_phoi_da_cap_theo_thang] = useState([])

    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);


    //State chứa ngày bắt đầu
    const [startDate, setStartDate] = useState("");
    //State chứa ngày kết thúc
    const [endDate, setEndDate] = useState("");
    //State show input chọn ngày khi loại thống kê là thống kê theo đơn vị quản lý
    const [showStatisticalMU, setShowStatisticalMU] = useState(false);
    const [showChart, setShowChart] = useState(false);

    const [yc_xin_cap_moi_theo_dvql, setYc_xin_cap_moi_theo_dvql]  = useState([]);
    const [yc_xin_cap_lai_theo_dvql, setYc_xin_cap_lai_theo_dvql] = useState([]);
    const [yc_da_dc_xl_theo_dvql, setYc_da_dc_xl_theo_dvql] = useState([]);
    const [phoi_da_cap_theo_dvql , setPhoi_da_cap_theo_dvql] = useState([]);

    useEffect(() => {
        if (statisticalType != "") {
            if (statisticalType.value == "Thống kê theo tháng") {
                setshowMonthStatistical(true);
                setShowStatisticalMU(false);
                setStartDate("");
                setEndDate("");
            }
            if (statisticalType.value == "Thống kê theo đơn vị quản lý") {
                setshowMonthStatistical(false);
                setShowStatisticalMU(true);
                setStatistical_year("");
            }
        }
    }, [statisticalType])

    //Hàm lấy số yc tạo phôi mới dc tạo theo tháng
    const getRequestIssuanceCreatedByMonth = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/statistical_request_issuance?year=${statistical_year}`);
            setYc_dc_tao_theo_thang(res.data)
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm lấy số yc cấp lại dc tạo theo tháng
    const getRequestReissueCreateByMonth = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/statistical_request_reissue_by_month?year=${statistical_year}`);
            setYc_xin_cap_lai_theo_thang(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm lấy số yc đã dc xl và số phôi dc cấp theo tháng
    const getSoPhoi_YCByMonth = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/statistical_yc_dc_xl_by_month?year=${statistical_year}`);
            setYc_da_dc_xl_theo_thang(res.data.finalResultYC_Processed);
            setSo_phoi_da_cap_theo_thang(res.data.finalResult_SoPhoi_DaCap);
        } catch (error) {
            console.log(error);
        }
    }

    //----------------------------thống kê theo DVQL
    const getRequestIssuanceCreatedByDVQL = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/thong_ke_so_yc_tao_moi_theo_dvql?from=${startDate}&to=${endDate}`);
            setYc_xin_cap_moi_theo_dvql(res.data);
        }catch(error){
            console.log(error)
        }
    }
    
    const getRequestReissueCreateByDVQL = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/thongke_so_yc_cap_lai_dc_tao_theo_dvql?from=${startDate}&to=${endDate}`);
            setYc_xin_cap_lai_theo_dvql(res.data);
        }catch(error){
            console.log(error)
        }
    }
    const getSoPhoi_YCByDVQL = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/tk_yc_dc_xl_so_phoi_da_cap_theo_dvql?from=${startDate}&to=${endDate}`);
            setYc_da_dc_xl_theo_dvql(res.data.finalResultYC_Processed)
            setPhoi_da_cap_theo_dvql(res.data.finalResult_SoPhoi_DaCap)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (statisticalType.value == "Thống kê theo tháng") {
            // setStatistical_year(currentYear)
            if (statistical_year != "") {
                setShowChart(true);
                //Gọi API thống kê theo tháng
                getRequestIssuanceCreatedByMonth();
                getRequestReissueCreateByMonth();
                getSoPhoi_YCByMonth();
            } else {
                setShowChart(false);
            }
        }

        if (statisticalType.value == "Thống kê theo đơn vị quản lý") {
            if (startDate != "" && endDate != "") {
                setShowChart(true);
                //Gọi API thống kê theo DVQL
                getRequestIssuanceCreatedByDVQL()
                getRequestReissueCreateByDVQL()
                getSoPhoi_YCByDVQL()
            } else {
                setShowChart(false);
            }
        }
    }, [statistical_year, startDate, endDate]);

    useEffect(() => {
        let count = 0;
        let count2 = 0;
        let count3 = 0;
        if(statisticalType.value == "Thống kê theo tháng"){
            for (let i = 0; i < 12; i++) {
                count = count + yc_dc_tao_theo_thang[i] + yc_xin_cap_lai_theo_thang[i];
                count2 = count2 + yc_da_dc_xl_theo_thang[i];
                count3 = count3 + so_phoi_da_cap_theo_thang[i];
            }
        }else{
            if(allManagementUnit.length>0){
                for(let i = 0; i<allManagementUnit.length; i++){
                    count+=yc_xin_cap_moi_theo_dvql[i] + yc_xin_cap_lai_theo_dvql[i];
                    count2+=yc_da_dc_xl_theo_dvql[i];
                    count3+=phoi_da_cap_theo_dvql[i];
                }
            }
        }
        setCount(count);
        setCount2(count2);
        setCount3(count3);
    }, [yc_dc_tao_theo_thang,
        yc_xin_cap_lai_theo_thang,
        yc_da_dc_xl_theo_thang,
        so_phoi_da_cap_theo_thang,
        yc_xin_cap_moi_theo_dvql,
        yc_xin_cap_lai_theo_dvql,
        yc_da_dc_xl_theo_dvql,
        phoi_da_cap_theo_dvql
    ])

    return (
        <>
            <Header />
            <div className="container" id='body-Statistical'>
                <div className='row' style={{ backgroundColor: '#e4e5e7', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#21acdd" }}>
                            <div className='count-statistical'>
                                <div>{
                                    count
                                }</div>
                                <div>
                                    <i
                                        style={{ fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-magnifying-glass"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Yêu cầu xin cấp phôi được tạo</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#63c5de" }}>
                            <div className='count-statistical'>
                                <div>{count2}</div>
                                <div>
                                    <i
                                        style={{ fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-magnifying-glass"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Yêu cầu đã được xử lý</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#fd6b6b" }}>
                            <div className='count-statistical'>
                                <div>{count3}</div>
                                <div>
                                    <i
                                        style={{ fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-magnifying-glass"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Phôi đã cấp</div>
                        </div>
                    </div>
                </div>
                <div className="card p-4 mt-5">
                    <div className="row" style={{ backgroundColor: '#feefbf', padding: '25px', borderRadius: '10px' }}>
                        <div className="col-md-5">
                            <Select
                                placeholder="Chọn loại thống kê"
                                options={
                                    [
                                        { value: "Thống kê theo tháng", label: "Thống kê theo tháng" },
                                        { value: "Thống kê theo đơn vị quản lý", label: "Thống kê theo đơn vị quản lý" }
                                    ]
                                }
                                value={statisticalType}
                                onChange={handleChangeStatisticalType}
                            />
                        </div>
                        {showMonthStatistical ? (
                            <div className="col-md-3 offset-md-4">
                                <input
                                    type="number"
                                    className='form-control'
                                    placeholder='Nhập năm thống kê'
                                    value={statistical_year}
                                    onChange={(e) => {
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
                                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: '20px', color: '#fed25c' }}>
                                            CHỌN THỜI GIAN THỐNG KÊ
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-4">Từ ngày</div>
                                            <div className="col-8">
                                                <input
                                                    type="date"
                                                    className='form-control'
                                                    value={startDate}
                                                    onChange={(e) => {
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
                                                    onChange={(e) => {
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
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        THỐNG KÊ YÊU CẦU XIN CẤP PHÔI VĂN BẰNG
                    </div>
                    <div style={{ padding: '20px' }}>
                        {
                            showChart ? (
                                <div className="row mt-2" style={{ padding: '30px' }}>
                                    <BarChart
                                        statisticalType={statisticalType.value}
                                        yc_xin_cap_moi_theo_thang={yc_dc_tao_theo_thang}
                                        yc_xin_cap_lai_theo_thang={yc_xin_cap_lai_theo_thang}
                                        yc_da_dc_xl_theo_thang={yc_da_dc_xl_theo_thang}
                                        
                                        yc_xin_cap_moi_theo_dvql= {yc_xin_cap_moi_theo_dvql}
                                        yc_xin_cap_lai_theo_dvql={yc_xin_cap_lai_theo_dvql}
                                        yc_da_dc_xl_theo_dvql={yc_da_dc_xl_theo_dvql}
                                    >
                                    </BarChart>
                                </div>
                            ) : ("")
                        }
                    </div>
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        THỐNG KÊ PHÔI ĐÃ CẤP
                    </div>
                    <div style={{ padding: '20px' }}>
                        {
                            showChart ? (
                                <div className="row mt-2" style={{ padding: '30px' }}>
                                    <BarChart_TK_SoPhoi
                                        statisticalType={statisticalType.value}
                                        phoi_da_cap_theo_thang={so_phoi_da_cap_theo_thang}
                                        phoi_da_cap_theo_dvql={phoi_da_cap_theo_dvql}
                                    >
                                    </BarChart_TK_SoPhoi>
                                </div>
                            ) : ("")
                        }
                    </div>
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        TÌM KIẾM TỔNG HỢP YÊU CẦU XIN CẤP PHÔI
                    </div>
                    <div style={{ backgroundColor: '#feefbf', padding: '25px', borderRadius: '10px', marginTop: '20px' }}>
                        <div className="row">
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn loại yêu cầu tìm kiếm"
                                    options={
                                        [
                                            { value: "Yêu cầu cấp mới phôi", label: "Yêu cầu cấp mới phôi" },
                                            { value: "Yêu cầu cấp lại phôi", label: "Yêu cầu cấp lại phôi" }
                                        ]
                                    }
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn đơn vị quản lý"
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn loại phôi"
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <Select
                                    placeholder="Tìm theo trạng thái"

                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    placeholder='Người tạo'
                                    className='form-control'
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="date"
                                    className='form-control'
                                />
                            </div>
                            <div className="col-md-1" style={{textAlign: 'center'}}>
                                <i className="fa-solid fa-arrow-right" style={{ marginTop: '10px'}}></i>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="date"
                                    className='form-control'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div style={{width: '100%', overflowY: 'hidden', overflowX: 'auto'}}>
                            <table style={{width: '1700px'}}>
                                <thead>
                                    <tr>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Đơn vị yêu cầu</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên loại phôi</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Đợt thi/Đợt cấp văn bằng (D/M/Y)</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng phôi</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Cán bộ tạo yêu cầu</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                        <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem phiếu xuất kho</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

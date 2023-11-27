import './DiplomaStatistics.css'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import BarChart_TK_Diploma from '../BarChart/BarChart_TK_Diploma';
import axios from 'axios';
export default function DiplomaStatistics() {
    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            let result = [];
            res.data.forEach((currentValue) => {
                if (currentValue.management_unit_id != 13) {
                    result = [...result, currentValue];
                }
            })
            setAllManagementUnit(result);
        } catch (error) {
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

    //Các state thống kê theo tháng
    const [van_bang_dc_nhap_theo_thang, setVan_bang_dc_nhap_theo_thang] = useState([])
    const [van_bang_dc_duyet_theo_thang, setVan_bang_dc_duyet_theo_thang] = useState([])
    const [van_bang_ko_dc_duyet_theo_thang, setVan_bang_ko_dc_duyet_theo_thang] = useState([])
    
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

    //Các state thống kê theo DVQL
    const [van_bang_dc_nhap_theo_dvql, setVan_bang_dc_nhap_theo_dvql] = useState([]);
    const [van_bang_dc_duyet_theo_dvql, setVan_bang_dc_duyet_theo_dvql] = useState([]);
    const [van_bang_ko_dc_duyet_theo_dvql, setVan_bang_ko_dc_duyet_theo_dvql] = useState([]);


    useEffect(() => {
        if (statisticalType != "") {
            if (statisticalType.value == "Thống kê theo tháng") {
                setshowMonthStatistical(true);
                setShowStatisticalMU(false);
                setStatistical_year(currentYear);
                setStartDate("");
                setEndDate("");
                // setShowChart(false);
                // setCount(0);
                // setCount2(0);
                // setCount3(0);
            }
            if (statisticalType.value == "Thống kê theo đơn vị quản lý") {
                setshowMonthStatistical(false);
                setShowStatisticalMU(true);
                setStatistical_year("");
                // setShowChart(false);
                // setCount(0);
                // setCount2(0);
                // setCount3(0);
            }
        }
    }, [statisticalType])

    //Hàm lấy số liệu thống kê theo tháng
    const thongKeTheoThang = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma/tk_vb_theo_thang?year=${statistical_year}`);
            setTimeout(() => {
                setVan_bang_dc_nhap_theo_thang(res.data.finalResult1)
                setVan_bang_dc_duyet_theo_thang(res.data.finalResult2)
                setVan_bang_ko_dc_duyet_theo_thang(res.data.finalResult3);    
            }, 1000);
            setShowChart(true);
        }catch(error){
            console.log(error);
        }
    }

    //Hàm lấy số liệu theo DVQL
    const thongKeTheoDVQL = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma/tk_vb_theo_dvql?from=${startDate}&to=${endDate}`);
            setTimeout(() => {
                setVan_bang_dc_nhap_theo_dvql(res.data.finalResult1)
                setVan_bang_dc_duyet_theo_dvql(res.data.finalResult2)
                setVan_bang_ko_dc_duyet_theo_dvql(res.data.finalResult3);    
            }, 1000);
            setShowChart(true);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        if (statisticalType.value == "Thống kê theo tháng") {
            if (statistical_year != "") {
                // setShowChart(true);
                thongKeTheoThang();
            } else {
                setShowChart(false);
            }
        }

        if (statisticalType.value == "Thống kê theo đơn vị quản lý") {
            if (startDate != "" && endDate != "") {
                // setShowChart(true);
                thongKeTheoDVQL();
            } else {
                setShowChart(false);
            }
        }
    }, [statistical_year, startDate, endDate]);

    useEffect(()=>{
        let count = 0;
        let count2 = 0;
        let count3 = 0;
        if (statisticalType.value == "Thống kê theo tháng" && van_bang_dc_nhap_theo_thang.length>0) {
            for (let i = 0; i < 12; i++) {
                count = count + van_bang_dc_nhap_theo_thang[i];
                count2 = count2 + van_bang_dc_duyet_theo_thang[i];
                count3 = count3 + van_bang_ko_dc_duyet_theo_thang[i];
            }
        } else {
            if (allManagementUnit.length > 0) {
                for (let i = 0; i < allManagementUnit.length; i++) {
                    count += van_bang_dc_nhap_theo_dvql[i];
                    count2 += van_bang_dc_duyet_theo_dvql[i];
                    count3 += van_bang_ko_dc_duyet_theo_dvql[i];
                }
            }
        }
        setCount(count);
        setCount2(count2);
        setCount3(count3);
    },[
        van_bang_dc_nhap_theo_thang,
        van_bang_dc_duyet_theo_thang,
        van_bang_ko_dc_duyet_theo_thang,
        van_bang_dc_nhap_theo_dvql,
        van_bang_dc_duyet_theo_dvql,
        van_bang_ko_dc_duyet_theo_dvql 
    ])
    
    return (
        <>
            <Header />
            <div className="container" id='body-diploma-statistics'>
                <div className='row' style={{ backgroundColor: '#e4e5e7', paddingTop: '10px', paddingBottom: '10px' }}>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#21acdd" }}>
                            <div className='count-statistical'>
                                <div>
                                    {count}
                                </div>
                                <div>
                                    <i
                                        style={{ width: '42px', fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-book"
                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Văn bằng được nhập</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#63c5de" }}>
                            <div className='count-statistical'>
                                <div>{count2}</div>
                                <div>
                                    <i
                                        style={{ fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-check"

                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Văn bằng được duyệt</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className='info-statistical' style={{ backgroundColor: "#fd6b6b" }}>
                            <div className='count-statistical'>
                                <div>{count3}</div>
                                <div>
                                    <i
                                        style={{ textAlign: 'center', width: '42px', fontSize: '27px', backgroundColor: "white", padding: '7px', borderRadius: '5px', color: 'black' }}
                                        className="fa-solid fa-x"

                                    >
                                    </i>
                                </div>
                            </div>
                            <div className='count-type-statistical'>Văn bằng không được duyệt</div>
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
                            <>
                            
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
                                {/* <button 
                                    className='btn btn-primary'
                                    style={{marginTop: '10px', marginLeft: '185px'}}
                                    onClick={(e)=>{
                                        thongKeTheoThang()
                                    }}
                                    >
                                    Thống kê
                                </button> */}
                            </div>
                           
                            </>
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
                                    {/* <button className='btn btn-primary' style={{marginTop: '10px', marginLeft: '390px'}} onClick={(e)=>{thongKeTheoDVQL()}}>
                                        Thống kê
                                    </button> */}
                                </div>
                            ) : ("")
                        }
                    </div>
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        THỐNG KÊ VĂN BẰNG
                    </div>

                    <div style={{ padding: '20px' }}>
                        {
                            showChart ? (
                                <div className="row mt-2" style={{ padding: '30px' }}>
                                    <BarChart_TK_Diploma
                                        statisticalType={statisticalType.value}
                                        van_bang_dc_nhap_theo_thang= {van_bang_dc_nhap_theo_thang}
                                        van_bang_dc_duyet_theo_thang={van_bang_dc_duyet_theo_thang}
                                        van_bang_ko_dc_duyet_theo_thang={van_bang_ko_dc_duyet_theo_thang}

                                        van_bang_dc_nhap_theo_dvql= {van_bang_dc_nhap_theo_dvql}
                                        van_bang_dc_duyet_theo_dvql={van_bang_dc_duyet_theo_dvql}
                                        van_bang_ko_dc_duyet_theo_dvql={van_bang_ko_dc_duyet_theo_dvql}
                                    >
                                    </BarChart_TK_Diploma>
                                </div>
                            ) : ("")
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
import './DiplomaStatistics.css'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import BarChart_TK_Diploma from '../BarChart/BarChart_TK_Diploma';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { getAllDiplomaName, getAllDiplomaType } from '../../redux/apiRequest';
export default function DiplomaStatistics() {
    const dispatch = useDispatch();

    //State chứa all ngành đào tạo
    const [allMajorInDB, setAllMajorInDB] = useState([]);

    //Hàm lấy ra all majors
    const getAllMajorsShowModal = async () => {
        try {
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorInDB(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
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

    const [allDCVB, setAllDCVB] = useState([]);

    const layAllDCVB = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/diploma_issuance/lay_all_dcvb");
            setAllDCVB(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllManagementUnit();
        getAllDiplomaName(dispatch);
        layAllDCVB();
        getAllUserAccount();
        getAllMajorsShowModal();
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
        try {
            const res = await axios.get(`http://localhost:8000/v1/diploma/tk_vb_theo_thang?year=${statistical_year}`);
            setTimeout(() => {
                setVan_bang_dc_nhap_theo_thang(res.data.finalResult1)
                setVan_bang_dc_duyet_theo_thang(res.data.finalResult2)
                setVan_bang_ko_dc_duyet_theo_thang(res.data.finalResult3);
            }, 1000);
            setShowChart(true);
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm lấy số liệu theo DVQL
    const thongKeTheoDVQL = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/diploma/tk_vb_theo_dvql?from=${startDate}&to=${endDate}`);
            setTimeout(() => {
                setVan_bang_dc_nhap_theo_dvql(res.data.finalResult1)
                setVan_bang_dc_duyet_theo_dvql(res.data.finalResult2)
                setVan_bang_ko_dc_duyet_theo_dvql(res.data.finalResult3);
            }, 1000);
            setShowChart(true);
        } catch (error) {
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

    useEffect(() => {
        let count = 0;
        let count2 = 0;
        let count3 = 0;
        if (statisticalType.value == "Thống kê theo tháng" && van_bang_dc_nhap_theo_thang.length > 0) {
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
    }, [
        van_bang_dc_nhap_theo_thang,
        van_bang_dc_duyet_theo_thang,
        van_bang_ko_dc_duyet_theo_thang,
        van_bang_dc_nhap_theo_dvql,
        van_bang_dc_duyet_theo_dvql,
        van_bang_ko_dc_duyet_theo_dvql
    ])

    //Xử lý phần tìm kiếm tổng hợp văn bằng
    const [optionsDiplomaName_TKTH, setOptionsDiplomaName_TKTH] = useState([]);
    const [diplomaName_TKTH, setDiplomaName_TKTH] = useState({ value: '', label: "Tất cả loại văn bằng" });
    const handleChangeDiplomaName_TKTH = (selectedOption) => {
        setDiplomaName_TKTH(selectedOption);
    }

    const [receiver_TKTH, setReceiver_TKTH] = useState("");

    const [optionDCVB_TKTH, setOptionDCVB_TKTH] = useState([]);
    const [dcvb_TKTH, setDcvb_TKTH] = useState({ value: '', label: 'Tất cả đợt cấp' });
    const handleChangeDCVB_TKTH = (selectedOption) => {
        setDcvb_TKTH(selectedOption);
    }

    const [status_TKTH, setStatus_TKTH] = useState({ value: '', label: 'Tất cả trạng thái' });
    const handleChangeStatus_TKTH = (selectedOption) => {
        setStatus_TKTH(selectedOption);
    }

    const [soHieu_TKTH, setSoHieu_TKTH] = useState("");
    const [soVaoSo_TKTH, setSoVaoSo_TKTH] = useState("");

    const [startDate_TKTH, setStateDate_TKTH] = useState("");
    const [endDate_TKTH, setEndDate_TKTH] = useState("");

    useEffect(() => {
        let resultOption = [{ value: '', label: "Tất cả loại văn bằng" }];
        allDiplomaName?.forEach((currentValue) => {
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptionsDiplomaName_TKTH(resultOption);
    }, [allDiplomaName])

    useEffect(() => {
        let resultOption = [{ value: '', label: 'Tất cả đợt cấp' }]

        if (diplomaName_TKTH.value != "") {
            allDCVB?.forEach((currentValue) => {
                if (currentValue.diploma_name_id == diplomaName_TKTH.value) {
                    const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name };
                    resultOption = [...resultOption, newOption];
                }
            })
            setOptionDCVB_TKTH(resultOption);
        } else {
            allDCVB?.forEach((currentValue) => {
                const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name };
                resultOption = [...resultOption, newOption];
            })
            setOptionDCVB_TKTH(resultOption);
        }
    }, [diplomaName_TKTH, allDCVB])

    //---------Tìm kiếm tổng hợp
    const [allVB, setAllVB] = useState([]);
    const [allVB_PT, setAllVB_PT] = useState([]);

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        if (page != undefined && allVB != undefined) {
            if (allVB.length > 5) {
                const numberOfPage = Math.ceil(allVB?.length / 5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if (page == numberOfPage) {
                    endElement = allVB.length - 1;
                } else {
                    endElement = page * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allVB[i]];
                }
                setAllVB_PT(result);
            } else {
                setAllVB_PT(allVB);
            }
        }
    }, [page, allVB])

    //Hàm tìm kiếm tổng hợp văn bằng
    const TKTH_VB = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/diploma/tkth_vb?fullname=${receiver_TKTH}&status=${status_TKTH.value}&diploma_number=${soHieu_TKTH}&numbersIntoTheNotebook=${soVaoSo_TKTH}&diploma_name_id=${diplomaName_TKTH.value}&diploma_issuance_id=${dcvb_TKTH.value}&from=${startDate_TKTH}&to=${endDate_TKTH}`);
            setAllVB(res.data);

        } catch (error) {
            console.log(error);
        }
        // console.log({
        //     1: diplomaName_TKTH.value,
        //     2: receiver_TKTH,
        //     3: dcvb_TKTH.value,
        //     4: status_TKTH.value,
        //     5: soHieu_TKTH,
        //     6: soVaoSo_TKTH,
        //     7: startDate_TKTH,
        //     8: endDate_TKTH
        // })
    }

    function handleDateToDMY(date) {
        const splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //State hiển thị chi tiết văn bằng
    const [fullnameModalReview, setFullnameModalReview] = useState("");
    const [sexModalReview, setSexModalReview] = useState();
    const [dateofbirthModalReview, setDateofBirthModalReview] = useState("");
    const [addressModalReview, setAddressModalReview] = useState("");
    const [CCCDModalReview, setCCCDModalReview] = useState("");
    const [signDayModalReview, setSignDayModalReview] = useState("");
    const [diplomaNumberModalReview, setDiplomaNumberModalReview] = useState("");
    const [numberInNoteModalReview, setNumberInNoteModalReview] = useState("");

    const [diemTNModalReview, setDiemTNModalReview] = useState("");
    const [diemTHModalReview, setDiemTHModalReview] = useState("");
    const [ngheModalReview, setNgheModalReview] = useState("");
    const [noiModalReview, setNoiModalReview] = useState("");
    const [docModalReview, setDocModalReview] = useState("");
    const [vietModalReview, setVietModalReview] = useState("");
    const [testDayModalReview, setTestdayModalReview] = useState("");
    const [graduationYearModalReview, setGraduationYearModalReview] = useState("");
    const [classificationModalReview, setClassificationModalReview] = useState("");
    const [nganhDaoTaoModalReview, setNganhDaoTaoModalReview] = useState("");
    const [councilModalReview, setCouncilModalReview] = useState("");

    const [optionsOfDiplomaNameModalReview, setOptionsOfDiplomaNameModalReview] = useState("");
    const [statusModalReview, setStatusModalReview] = useState("");



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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 5000;
                                            document.documentElement.scrollTop = 5000;
                                        }}
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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 5000;
                                            document.documentElement.scrollTop = 5000;
                                        }}
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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 5000;
                                            document.documentElement.scrollTop = 5000;
                                        }}
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
                                        van_bang_dc_nhap_theo_thang={van_bang_dc_nhap_theo_thang}
                                        van_bang_dc_duyet_theo_thang={van_bang_dc_duyet_theo_thang}
                                        van_bang_ko_dc_duyet_theo_thang={van_bang_ko_dc_duyet_theo_thang}

                                        van_bang_dc_nhap_theo_dvql={van_bang_dc_nhap_theo_dvql}
                                        van_bang_dc_duyet_theo_dvql={van_bang_dc_duyet_theo_dvql}
                                        van_bang_ko_dc_duyet_theo_dvql={van_bang_ko_dc_duyet_theo_dvql}
                                    >
                                    </BarChart_TK_Diploma>
                                </div>
                            ) : ("")
                        }
                    </div>
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        TÌM KIẾM TỔNG HỢP VĂN BẰNG
                    </div>
                    <div style={{ backgroundColor: '#A2B5CD', padding: '25px', borderRadius: '10px', marginTop: '20px' }}>
                        <div className="row">
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn loại văn bằng"
                                    options={optionsDiplomaName_TKTH}
                                    value={diplomaName_TKTH}
                                    onChange={handleChangeDiplomaName_TKTH}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    placeholder='Tìm theo tên người được cấp'
                                    className='form-control'
                                    value={receiver_TKTH}
                                    onChange={(e) => {
                                        setReceiver_TKTH(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    placeholder='Chọn đợt cấp văn bằng'
                                    options={optionDCVB_TKTH}
                                    value={dcvb_TKTH}
                                    onChange={handleChangeDCVB_TKTH}
                                />
                            </div>

                        </div>
                        <div className="row mt-3">
                            <div className="col-md-4">
                                <Select
                                    placeholder='Chọn trạng thái'
                                    value={status_TKTH}
                                    options={[
                                        { value: 'Tất cả trạng thái', label: 'Tất cả trạng thái' },
                                        { value: 'Chờ duyệt', label: 'Chờ duyệt' },
                                        { value: 'Đã duyệt', label: 'Đã duyệt' },
                                        { value: 'Không duyệt', label: 'Không duyệt' }
                                    ]}
                                    onChange={handleChangeStatus_TKTH}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    placeholder='Lọc theo số hiệu'
                                    className='form-control'
                                    value={soHieu_TKTH}
                                    onChange={(e) => {
                                        setSoHieu_TKTH(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <input type="text"
                                    placeholder='Lọc theo số vào sổ'
                                    className='form-control'
                                    value={soVaoSo_TKTH}
                                    onChange={(e) => {
                                        setSoVaoSo_TKTH(e.target.value);
                                    }}
                                />
                            </div>

                        </div>
                        <div className="row mt-3">
                            {/* <div className='col-md-3'>
                                <input 
                                    type="text"
                                    className='form-control'
                                    placeholder='Tìm theo cán bộ nhập văn bằng'
                                />
                            </div> */}
                            <div className="col-md-2 offset-md-3">
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDate_TKTH}
                                    onChange={(e) => {
                                        setStateDate_TKTH(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-1" style={{ textAlign: 'center' }}>
                                <i className="fa-solid fa-arrow-right" style={{ marginTop: '10px' }}></i>
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="date"
                                    className='form-control'
                                    value={endDate_TKTH}
                                    onChange={(e) => {
                                        setEndDate_TKTH(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-1">
                                <i
                                    className="fa-solid fa-filter nut-loc"
                                    style={{ backgroundColor: "white", padding: '9px', marginTop: '1px', borderRadius: '5px', color: 'black', width: '37px' }}
                                    onClick={(e) => {
                                        TKTH_VB()
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div style={{ width: '100%', overflowY: 'hidden', overflowX: 'auto', marginTop: '20px' }}>
                        <table className='table table-striped table-hover table-bordered' style={{ width: '2200px', border: '2px solid #fed25c', textAlign: 'center' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">STT</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Tên văn bằng</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Họ tên</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Giới tính</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Ngày sinh</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Nơi sinh</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">CCCD</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Ngày ký</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Số hiệu</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Số vào sổ</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Người nhập</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Ngày nhập</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Người duyệt</th>
                                    <th style={{ textAlign: 'center', backgroundColor: '#fed25c' }} scope="col">Xem chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allVB_PT?.map((currentValue, index) => {
                                        let ten_vb = '';
                                        let nganh_dao_tao = '';
                                        let options;
                                        allDiplomaName?.forEach((diplomaName) => {
                                            if (diplomaName.diploma_name_id == currentValue.diploma_name_id) {
                                                ten_vb = diplomaName.diploma_name_name;
                                                options = diplomaName.options;
                                            }
                                        })

                                        allMajorInDB?.forEach((major) => {
                                            if (major.majors_id == currentValue.nganh_dao_tao) {
                                                nganh_dao_tao = major.majors_name;
                                            }
                                        })
                                        let gioitinh;
                                        if (currentValue.sex) {
                                            gioitinh = 'Nam'
                                        } else {
                                            gioitinh = 'Nữ'
                                        }

                                        let nguoi_nhap = '';
                                        let nguoi_duyet = '';
                                        allUserAccount?.forEach((user) => {
                                            if (user.mssv_cb == currentValue.mscb_import) {
                                                nguoi_nhap = user.fullname
                                            }
                                            if (user.mssv_cb == currentValue.mscb) {
                                                nguoi_duyet = user.fullname;
                                            }
                                        })

                                        return (
                                            <tr key={index}>
                                                <td>{(index + 1)}</td>
                                                <td>{ten_vb}</td>
                                                <td>{currentValue.fullname}</td>
                                                <td>{gioitinh}</td>
                                                <td>{handleDateToDMY(currentValue.dateofbirth)}</td>
                                                <td>{currentValue.address}</td>
                                                <td>{currentValue.cccd}</td>
                                                <td>{handleDateToDMY(currentValue.sign_day)}</td>
                                                <td>{currentValue.diploma_number}</td>
                                                <td>{currentValue.numbersIntoTheNotebook}</td>
                                                <td>
                                                    <Tooltip
                                                        // options
                                                        theme='dark'
                                                        html={(
                                                            <div>
                                                                <strong>
                                                                    {currentValue.explain}
                                                                </strong>
                                                            </div>
                                                        )}
                                                        arrow={true}
                                                        position="top"
                                                    >
                                                        <div style={{ backgroundColor: 'red', padding: '1px', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                                            {currentValue.status}
                                                        </div>
                                                    </Tooltip>
                                                </td>
                                                <td>
                                                    {`${nguoi_nhap} / ${currentValue.mscb_import}`}
                                                </td>
                                                <td>{
                                                    handleDateToDMY(currentValue.time_import)
                                                }</td>
                                                <td>
                                                    {nguoi_duyet == "" ? ("") : (`${nguoi_duyet} / ${currentValue.mscb}`)}
                                                </td>
                                                <td>
                                                    <i
                                                        className="fa-solid fa-eye"
                                                        style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                        data-bs-toggle="modal" data-bs-target="#showDiplomaModal_TKTH"
                                                        onClick={(e) => {
                                                            setFullnameModalReview(currentValue.fullname);
                                                            setSexModalReview(currentValue.sex);
                                                            setDateofBirthModalReview(currentValue.dateofbirth);
                                                            setAddressModalReview(currentValue.address);
                                                            setCCCDModalReview(currentValue.cccd);
                                                            setSignDayModalReview(currentValue.sign_day);
                                                            setDiplomaNumberModalReview(currentValue.diploma_number);
                                                            setNumberInNoteModalReview(currentValue.numbersIntoTheNotebook);

                                                            setDiemTNModalReview(currentValue.diem_tn);
                                                            setDiemTHModalReview(currentValue.diem_th);
                                                            setNgheModalReview(currentValue.nghe);
                                                            setNoiModalReview(currentValue.noi);
                                                            setDocModalReview(currentValue.doc);
                                                            setVietModalReview(currentValue.viet);
                                                            setTestdayModalReview(currentValue.test_day);
                                                            setGraduationYearModalReview(currentValue.graduationYear);
                                                            setClassificationModalReview(currentValue.classification);
                                                            setNganhDaoTaoModalReview(nganh_dao_tao)
                                                            setCouncilModalReview(currentValue.council);

                                                            setOptionsOfDiplomaNameModalReview(options);
                                                            setStatusModalReview(currentValue.status);
                                                        }}
                                                    ></i>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                            {/* Modal xem chi tiết văn bằng */}
                            <div className="modal fade" id="showDiplomaModal_TKTH" tabIndex="-1" aria-labelledby="showDiplomaModal_TKTHLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="showDiplomaModal_TKTHLabel">Thông tin văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Họ tên người được cấp
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {fullnameModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Giới tính
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {sexModalReview ? "Nam" : "Nữ"}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Ngày sinh
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {dateofbirthModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Nơi sinh
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {addressModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    CCCD
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {CCCDModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Ngày ký
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {signDayModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Số hiệu
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {diplomaNumberModalReview}
                                                </div>
                                            </div>
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Số vào sổ
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {numberInNoteModalReview}
                                                </div>
                                            </div>

                                            {
                                                optionsOfDiplomaNameModalReview.includes(1) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm trắc nghiệm
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {diemTNModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(2) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm thực hành
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {diemTHModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(3) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm kỹ năng nghe
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {ngheModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(4) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm kỹ năng nói
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {noiModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(5) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm kỹ năng đọc
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {docModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(6) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Điểm kỹ năng viết
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {vietModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(7) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Ngày thi
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {testDayModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(8) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Năm tốt nghiệp
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {graduationYearModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(9) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Xếp loại
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {classificationModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(10) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Ngành đào tạo
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {nganhDaoTaoModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }

                                            {
                                                optionsOfDiplomaNameModalReview.includes(11) ? (
                                                    <div className="row mt-2 inForDiploma-DR">
                                                        <div className="col-4 text-end fst-italic">
                                                            Hội đồng thi
                                                        </div>
                                                        <div className="col-8 fw-bold">
                                                            {councilModalReview}
                                                        </div>
                                                    </div>
                                                ) : ("")
                                            }
                                        </div>
                                        <div id='footer-modal-review-DR'>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </table>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <Stack spacing={2}>
                            <Pagination
                                count={Math.ceil(allVB?.length / 5)}
                                variant="outlined"
                                page={page}
                                onChange={handleChange}
                                color="info"
                            />
                        </Stack>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
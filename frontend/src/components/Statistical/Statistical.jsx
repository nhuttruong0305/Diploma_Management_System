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
import { useDispatch, useSelector } from 'react-redux';
import DetailRequest from '../DetailRequest/DetailRequest';
import { Tooltip } from 'react-tippy';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DetailRequestForReissue from '../DetailRequestForReissue/DetailRequestForReissue';
import { getAllDiplomaName, getAllDiplomaType } from '../../redux/apiRequest';
export default function Statistical() {
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

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

    useEffect(() => {
        getAllManagementUnit();
        getAllUserAccount();
        getAllMajorsShowModal()
        getAllDiplomaType(dispatch)
        getAllDiplomaName(dispatch);
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

    const [yc_xin_cap_moi_theo_dvql, setYc_xin_cap_moi_theo_dvql] = useState([]);
    const [yc_xin_cap_lai_theo_dvql, setYc_xin_cap_lai_theo_dvql] = useState([]);
    const [yc_da_dc_xl_theo_dvql, setYc_da_dc_xl_theo_dvql] = useState([]);
    const [phoi_da_cap_theo_dvql, setPhoi_da_cap_theo_dvql] = useState([]);

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
            setTimeout(() => {
                setYc_dc_tao_theo_thang(res.data)
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm lấy số yc cấp lại dc tạo theo tháng
    const getRequestReissueCreateByMonth = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/statistical_request_reissue_by_month?year=${statistical_year}`);
            setTimeout(() => {
                setYc_xin_cap_lai_theo_thang(res.data);    
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    //Hàm lấy số yc đã dc xl và số phôi dc cấp theo tháng
    const getSoPhoi_YCByMonth = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/statistical_yc_dc_xl_by_month?year=${statistical_year}`);
            setTimeout(() => {
                setYc_da_dc_xl_theo_thang(res.data.finalResultYC_Processed);
                setSo_phoi_da_cap_theo_thang(res.data.finalResult_SoPhoi_DaCap);
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    }

    //----------------------------thống kê theo DVQL
    const getRequestIssuanceCreatedByDVQL = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/thong_ke_so_yc_tao_moi_theo_dvql?from=${startDate}&to=${endDate}`);
            setTimeout(() => {
                setYc_xin_cap_moi_theo_dvql(res.data);
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    }

    const getRequestReissueCreateByDVQL = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/thongke_so_yc_cap_lai_dc_tao_theo_dvql?from=${startDate}&to=${endDate}`);
            setTimeout(() => {
                setYc_xin_cap_lai_theo_dvql(res.data);
            }, 1000);
        } catch (error) {
            console.log(error)
        }
    }
    const getSoPhoi_YCByDVQL = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/tk_yc_dc_xl_so_phoi_da_cap_theo_dvql?from=${startDate}&to=${endDate}`);
            setTimeout(() => {
                setYc_da_dc_xl_theo_dvql(res.data.finalResultYC_Processed)
                setPhoi_da_cap_theo_dvql(res.data.finalResult_SoPhoi_DaCap)    
            }, 1000);
        } catch (error) {
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
        if (statisticalType.value == "Thống kê theo tháng") {
            for (let i = 0; i < 12; i++) {
                count = count + yc_dc_tao_theo_thang[i] + yc_xin_cap_lai_theo_thang[i];
                count2 = count2 + yc_da_dc_xl_theo_thang[i];
                count3 = count3 + so_phoi_da_cap_theo_thang[i];
            }
        } else {
            if (allManagementUnit.length > 0) {
                for (let i = 0; i < allManagementUnit.length; i++) {
                    count += yc_xin_cap_moi_theo_dvql[i] + yc_xin_cap_lai_theo_dvql[i];
                    count2 += yc_da_dc_xl_theo_dvql[i];
                    count3 += phoi_da_cap_theo_dvql[i];
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

    const handleDateToDMY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //Xem chi tiết YCCP
    //State để ẩn hiện chi tiết yêu cầu
    const [showRequestDetail, setShowRequestDetail] = useState(false);
    //State để tạo nút đóng cho nút hiển thị chi tiết yêu cầu xin cấp phôi
    const [closeButton, setCloseButton] = useState(null);

    //State để lấy dữ liệu điền vào form //các state này truyền props
    const [embryoIssuanceRequest_id, setEmbryoIssuanceRequest_id] = useState("");
    const [managementUnitPhieuYC, setManagementUnitPhieuYC] = useState("");
    const [diplomaNameInPhieuYC, setDiplomaNameInPhieuYC] = useState("");
    const [examinationsInPhieuYC, setExaminationsInPhieuYC] = useState("");
    const [numberOfEmbryosInPhieuYC, setNumberOfEmbryosInPhieuYC] = useState();
    const [diplomaType, setDiplomaType] = useState("");

    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType); //state lấy ra all diploma type
    //state để lấy ra trường options của diplomaName được chọn trong chi tiết yêu cầu cấp phôi
    const [optionsOfDiplomaName, setOptionsOfDiplomaName] = useState([]); //state này truyền cho props

    //Phần dưới xử lý logic cho việc lấy dshv kèm theo ra
    //state chứa danh sách học viên kèm theo dựa trên yêu cầu cấp phôi
    const [allDSHVByEIR, setAllDSHVByEIR] = useState([]); //state này truyền props

    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
        return result;
    }

    //Hàm call api lấy danh sách học viên kèm theo
    const getAllDSHVByEIR = async (embryoIssuanceRequest_id, optionsOfDiplomaName) => {
        const ascending = optionsOfDiplomaName?.slice().sort((a, b) => a - b);
        let dshv = [];
        try {
            const res = await axios.get(`http://localhost:8000/v1/DSHV/get_DSHV/${embryoIssuanceRequest_id}`);
            dshv = [...dshv, ...res.data];
        } catch (error) {
            console.log(error);
        }

        const options2 = [
            "diem_tn",
            "diem_th",
            "nghe",
            "noi",
            "doc",
            "viet",
            "test_day",
            "graduationYear",
            "classification",
            "nganh_dao_tao",
            "council"
        ];

        let data = [];
        for (let i = 0; i < dshv.length; i++) {
            const newData = {
                STT: i + 1,
                fullname: dshv[i].fullname,
                sex: dshv[i].sex,
                // dateOfBirth:dshv[i].dateOfBirth,
                dateOfBirth: handleDateToMDY(dshv[i].dateOfBirth),
                address: dshv[i].address,
                CCCD: dshv[i].CCCD,
            }

            if (ascending.includes(1)) {
                newData[options2[0]] = dshv[i].diem_tn;
            }
            if (ascending.includes(2)) {
                newData[options2[1]] = dshv[i].diem_th;
            }
            if (ascending.includes(3)) {
                newData[options2[2]] = dshv[i].nghe;
            }
            if (ascending.includes(4)) {
                newData[options2[3]] = dshv[i].noi;
            }
            if (ascending.includes(5)) {
                newData[options2[4]] = dshv[i].doc;
            }
            if (ascending.includes(6)) {
                newData[options2[5]] = dshv[i].viet;
            }
            if (ascending.includes(7)) {
                newData[options2[6]] = handleDateToMDY(dshv[i].test_day);
            }
            if (ascending.includes(8)) {
                newData[options2[7]] = dshv[i].graduationYear;
            }
            if (ascending.includes(9)) {
                newData[options2[8]] = dshv[i].classification;
            }
            if (ascending.includes(10)) {
                allMajorInDB?.forEach((major) => {
                    if (major.majors_id == dshv[i].nganh_dao_tao) {
                        newData[options2[9]] = major.majors_name;
                    }
                })

            }
            if (ascending.includes(11)) {
                newData[options2[10]] = dshv[i].council;
            }
            data = [...data, newData];
        }
        setAllDSHVByEIR(data);
    }

    //Xử lý việc xem chi tiết yêu cầu xin cấp lại phôi
    const [closeButtonDetailRequestReissue, setCloseButtonDetailRequestReissue] = useState(null);
    const [showDetailRequestReissue, setShowDetailRequestReissue] = useState(false);

    //Các state để truyền qua props để hiển thị dữ liệu trong phiếu
    const [managementUnit_CV, setManagementUnit_CV] = useState("");
    const [requestForReissue_id_CV, setRequestForReissue_id_CV] = useState("");
    const [diplomaName_CV, setDiplomaName_CV] = useState("");
    const [numberOfEmbryos_CV, setNumberOfEmbryos_CV] = useState("");
    const [reason_CV, setReason_CV] = useState("");
    const [resultSeri, setResultSeri] = useState("");

    //------------------------Xử lý phần tìm kiếm tổng hợp
    const [searchRequestType, setSearchRequestType] = useState({ value: "Yêu cầu xin cấp mới phôi", label: "Yêu cầu xin cấp mới phôi" });
    const handleChangeRequestType = (selectedOption) => {
        setSearchRequestType(selectedOption);
    }

    useEffect(() => {
        setShowRequestDetail(false);
        setCloseButton(null);
        setShowDetailRequestReissue(false);
        setCloseButtonDetailRequestReissue(null);
    }, [searchRequestType])
    //1. Tìm kiếm tổng hợp YÊU CẦU XIN CẤP PHÔI
    //Chọn ĐVQL
    const [optionsMU_YCCP, setOptionsMU_YCCP] = useState([]);
    const [selectedMU_YCCP, setSelectedMU_YCCP] = useState({ value: '', label: 'Tất cả đơn vị quản lý' });
    const handleChangeSelectedMU_YCCP = (selectedOption) => {
        setSelectedMU_YCCP(selectedOption);
    }

    useEffect(() => {
        let resultOption = [{ value: '', label: 'Tất cả đơn vị quản lý' }];
        allManagementUnit?.forEach((currentValue) => {
            const newOption = { value: currentValue.management_unit_id, label: currentValue.management_unit_name };
            resultOption = [...resultOption, newOption];
        })
        setOptionsMU_YCCP(resultOption)
    }, [allManagementUnit]);

    //Chọn loại phôi
    const [optionsDiplomaName_YCCP, setOptionsDiplomaName_YCCP] = useState([]);
    const [selectedDiplomaName_YCCP, setSelectedDiplomaName_YCCP] = useState([{ value: '', label: 'Tất cả loại phôi' }]);
    const handleChangeDiplomaName_YCCP = (selectedOption) => {
        setSelectedDiplomaName_YCCP(selectedOption);
    }

    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try {
            if (management_unit_id != "") {
                const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
                let resultOption = [{ value: '', label: 'Tất cả loại phôi' }];
                res.data.forEach((currentValue) => {
                    const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
                    resultOption = [...resultOption, newOption];
                })
                setOptionsDiplomaName_YCCP(resultOption);
            } else {
                const res = await axios.get("http://localhost:8000/v1/diploma_name/get_all_diploma_name");
                let resultOption = [{ value: '', label: 'Tất cả loại phôi' }];
                res.data.forEach((currentValue) => {
                    const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
                    resultOption = [...resultOption, newOption];
                })
                setOptionsDiplomaName_YCCP(resultOption);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setSelectedDiplomaName_YCCP({ value: '', label: 'Tất cả loại phôi' })
        getAllDiplomaNameByMU(selectedMU_YCCP.value)
    }, [selectedMU_YCCP])

    //Chọn trạng thái
    const [selectedStatus_YCCP, setSelectedStatus_YCCP] = useState({ value: "", label: "Tất cả trạng thái" });
    const handleChangeselectedStatus_YCCP = (selectedOption) => {
        setSelectedStatus_YCCP(selectedOption);
    }

    //Người tạo
    const [creator, setCreator] = useState("");

    //Lọc theo ngày tạo
    const [startDate_YCCP, setStartDate_YCCP] = useState("")
    const [endDate_YCCP, setEndDate_YCCP] = useState("")

    const [allRequestIssuance_YCCP, setAllRequestIssuance_YCCP] = useState([]);
    const [allRequestReissue_YCCL, setAllRequestReissue_YCCL] = useState([]);

    //Phân trang
    const [allRequestIssuance_YCCP_PT, setAllRequestIssuance_YCCP_PT] = useState([]);
    const [allRequestReissue_YCCL_PT, setAllRequestReissue_YCCL_PT] = useState([]);

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        if (page != undefined && allRequestIssuance_YCCP != undefined) {
            if (allRequestIssuance_YCCP.length > 5) {
                const numberOfPage = Math.ceil(allRequestIssuance_YCCP?.length / 5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if (page == numberOfPage) {
                    endElement = allRequestIssuance_YCCP.length - 1;
                } else {
                    endElement = page * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allRequestIssuance_YCCP[i]];
                }
                setAllRequestIssuance_YCCP_PT(result);
            } else {
                setAllRequestIssuance_YCCP_PT(allRequestIssuance_YCCP);
            }
        }
    }, [page, allRequestIssuance_YCCP])

    const [page_YCCL, setPage_YCCL] = useState(1);
    const handleChange_YCCL = (event, value) => {
        setPage_YCCL(value);
    };

    useEffect(() => {
        if (page_YCCL != undefined && allRequestReissue_YCCL != undefined) {
            if (allRequestReissue_YCCL.length > 5) {
                const numberOfPage = Math.ceil(allRequestReissue_YCCL?.length / 5);
                const startElement = (page_YCCL - 1) * 5;
                let endElement = 0;
                if (page_YCCL == numberOfPage) {
                    endElement = allRequestReissue_YCCL.length - 1;
                } else {
                    endElement = page_YCCL * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allRequestReissue_YCCL[i]];
                }
                setAllRequestReissue_YCCL_PT(result);
            } else {
                setAllRequestReissue_YCCL_PT(allRequestReissue_YCCL);
            }
        }
    }, [page_YCCL, allRequestReissue_YCCL])

    //Hàm tìm YCCP theo nhiều DK
    const handleSearchYCCP_NHIEUDK = async () => {
        try {
            if (searchRequestType.value == "Yêu cầu xin cấp mới phôi") {
                const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/search_YCCP_theo_nhieu_dk?management_unit_id=${selectedMU_YCCP.value}&diploma_name_id=${selectedDiplomaName_YCCP.value}&from=${startDate_YCCP}&to=${endDate_YCCP}&status=${selectedStatus_YCCP.value}`);

                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < allUserAccount.length; j++) {
                        if (res.data[i].mscb == allUserAccount[j].mssv_cb) {
                            res.data[i]['fullname_create'] = allUserAccount[j].fullname;
                        }
                    }
                }
                //Tiến hành lọc theo tên người tạo yêu cầu
                if (creator != "") {
                    let result = [];
                    res.data.forEach((currentValue) => {
                        if (currentValue.fullname_create.toLowerCase().includes(creator.toLowerCase())) {
                            result = [...result, currentValue]
                        }
                    })
                    setAllRequestIssuance_YCCP(result);
                } else {
                    setAllRequestIssuance_YCCP(res.data);
                }
            } else if (searchRequestType.value == "Yêu cầu cấp lại phôi") {
                const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/tim_kiem_yc_cap_lai_theo_nhieu_dk?management_unit_id=${selectedMU_YCCP.value}&diploma_name_id=${selectedDiplomaName_YCCP.value}&status=${selectedStatus_YCCP.value}&from=${startDate_YCCP}&to=${endDate_YCCP}`);
                for (let i = 0; i < res.data.length; i++) {
                    for (let j = 0; j < allUserAccount.length; j++) {
                        if (res.data[i].mscb_create == allUserAccount[j].mssv_cb) {
                            res.data[i]['fullname_create'] = allUserAccount[j].fullname;
                        }
                    }
                }
                //Tiến hành lọc theo tên người tạo yêu cầu
                if (creator != "") {
                    let result = [];
                    res.data.forEach((currentValue) => {
                        if (currentValue.fullname_create.toLowerCase().includes(creator.toLowerCase())) {
                            result = [...result, currentValue]
                        }
                    })
                    setAllRequestReissue_YCCL(result);
                } else {
                    setAllRequestReissue_YCCL(res.data);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }


    const handleSeri = (seriNumber) => {
        let seriAfterProcessing = seriNumber.toString();
        switch (seriAfterProcessing.length) {
            case 1:
                seriAfterProcessing = `00000${seriAfterProcessing}`;
                break;
            case 2:
                seriAfterProcessing = `0000${seriAfterProcessing}`;
                break;
            case 3:
                seriAfterProcessing = `000${seriAfterProcessing}`;
                break;
            case 4:
                seriAfterProcessing = `00${seriAfterProcessing}`;
                break;
            case 5:
                seriAfterProcessing = `0${seriAfterProcessing}`;
                break;
            case 6:
                seriAfterProcessing = `${seriAfterProcessing}`;
                break;
        }
        return seriAfterProcessing;
    }

    const handleResultSeri = (seri_number_start, seri_number_end) => {
        let resultSeri = '';
        for (let i = 0; i < seri_number_start.length - 1; i++) {
            resultSeri += `${handleSeri(seri_number_start[i])} - ${handleSeri(seri_number_end[i])}, `
        }
        resultSeri += `${handleSeri(seri_number_start[seri_number_start.length - 1])} - ${handleSeri(seri_number_end[seri_number_end.length - 1])}`;
        return resultSeri;
    }

    //Tìm kiếm tổng hợp phiếu xuất kho
    const [muReceiveDBill, setMuReceiveDBill] = useState({ value: '', label: 'Tất cả đơn vị quản lý' });
    const handleChangeMuReceiveDBill = (selectedOption) => {
        setMuReceiveDBill(selectedOption);
    }

    const [receiver, setReceiver] = useState("");

    const [diplomaNameDBill, setDiplomaNameDBill] = useState({ value: '', label: 'Tất cả loại phôi' });
    const [optionsDiplomaNameDBill, setOptionsDiplomaNameDBill] = useState([]);
    const handleChangeDiplomaNameDBill = (selectedOption) => {
        setDiplomaNameDBill(selectedOption);
    }

    const getAllDiplomaNameByMU2 = async (management_unit_id) => {
        try {
            if (management_unit_id != "") {
                const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
                let resultOption = [{ value: '', label: 'Tất cả loại phôi' }];
                res.data.forEach((currentValue) => {
                    const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
                    resultOption = [...resultOption, newOption];
                })
                setOptionsDiplomaNameDBill(resultOption);
            } else {
                const res = await axios.get("http://localhost:8000/v1/diploma_name/get_all_diploma_name");
                let resultOption = [{ value: '', label: 'Tất cả loại phôi' }];
                res.data.forEach((currentValue) => {
                    const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
                    resultOption = [...resultOption, newOption];
                })
                setOptionsDiplomaNameDBill(resultOption);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setDiplomaNameDBill({ value: '', label: 'Tất cả loại phôi' });
        getAllDiplomaNameByMU2(muReceiveDBill.value)
    }, [muReceiveDBill])


    const [creatorDBill, setCreatorDBill] = useState("");
    const [startDateDBill, setStartDateDBill] = useState("");
    const [endDateDBill, setEndDateDBill] = useState("");

    const [allPhieuXK, setAllPhieuXK] = useState([]);
    const [allPhieuXK_PT, setAllPhieuXK_PT] = useState([]);

    const [page_XK, setPage_XK] = useState(1);
    const handleChange_XK = (event, value) => {
        setPage_XK(value);
    };

    useEffect(() => {
        if (page_XK != undefined && allPhieuXK != undefined) {
            if (allPhieuXK.length > 5) {
                const numberOfPage = Math.ceil(allPhieuXK?.length / 5);
                const startElement = (page_XK - 1) * 5;
                let endElement = 0;
                if (page_XK == numberOfPage) {
                    endElement = allPhieuXK.length - 1;
                } else {
                    endElement = page_XK * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allPhieuXK[i]];
                }
                setAllPhieuXK_PT(result);
            } else {
                setAllPhieuXK_PT(allPhieuXK);
            }
        }
    }, [page_XK, allPhieuXK])

    //Hàm tìm phiếu xuất kho theo nhiều điều kiện
    const handleTimPhieuXKNhieuDk = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/delivery_bill/tim_phieu_xk_theo_nhieu_dk?address_department=${muReceiveDBill.value}&fullname_of_consignee=${receiver}&embryo_type=${diplomaNameDBill.value}&from=${startDateDBill}&to=${endDateDBill}`);

            for (let i = 0; i < res.data.length; i++) {
                for (let j = 0; j < allUserAccount.length; j++) {
                    if (res.data[i].mscb == allUserAccount[j].mssv_cb) {
                        res.data[i]['fullname_create'] = allUserAccount[j].fullname;
                    }
                }
            }

            //Tiến hành lọc theo tên người tạo yêu cầu
            if (creatorDBill != "") {
                let result = [];
                res.data.forEach((currentValue) => {
                    if (currentValue.fullname_create.toLowerCase().includes(creatorDBill.toLowerCase())) {
                        result = [...result, currentValue]
                    }
                })
                setAllPhieuXK(result);
            } else {
                setAllPhieuXK(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 2300;
                                            document.documentElement.scrollTop = 2300;
                                        }}
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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 2300;
                                            document.documentElement.scrollTop = 2300;
                                        }}
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
                                        onClick={(e)=>{
                                            document.body.scrollTop = 5000;
                                            document.documentElement.scrollTop = 5000;
                                        }}
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

                                        yc_xin_cap_moi_theo_dvql={yc_xin_cap_moi_theo_dvql}
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
                    <hr />
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
                                            { value: "Yêu cầu xin cấp mới phôi", label: "Yêu cầu xin cấp mới phôi" },
                                            { value: "Yêu cầu cấp lại phôi", label: "Yêu cầu cấp lại phôi" }
                                        ]
                                    }
                                    value={searchRequestType}
                                    onChange={handleChangeRequestType}
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn đơn vị quản lý"
                                    options={optionsMU_YCCP}
                                    value={selectedMU_YCCP}
                                    onChange={handleChangeSelectedMU_YCCP}
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    placeholder="Chọn loại phôi"
                                    options={optionsDiplomaName_YCCP}
                                    onChange={handleChangeDiplomaName_YCCP}
                                    value={selectedDiplomaName_YCCP}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <Select
                                    placeholder="Tìm theo trạng thái"
                                    options={[
                                        { value: "", label: "Tất cả trạng thái" },
                                        { value: "Đã gửi yêu cầu", label: "Đã gửi yêu cầu" },
                                        { value: "Không duyệt", label: "Không duyệt" },
                                        { value: "Đã duyệt yêu cầu", label: "Đã duyệt yêu cầu" },
                                        { value: "Đã gửi thủ kho", label: "Đã gửi thủ kho" },
                                        { value: "Đã in phôi", label: "Đã in phôi" },
                                        { value: "Đã dán tem", label: "Đã dán tem" },
                                        { value: "Đã nhận phôi", label: "Đã nhận phôi" },
                                    ]}
                                    value={selectedStatus_YCCP}
                                    onChange={handleChangeselectedStatus_YCCP}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    placeholder='Người tạo'
                                    className='form-control'
                                    value={creator}
                                    onChange={(e) => {
                                        setCreator(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDate_YCCP}
                                    onChange={(e) => {
                                        setStartDate_YCCP(e.target.value)
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
                                    value={endDate_YCCP}
                                    onChange={(e) => {
                                        setEndDate_YCCP(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-1 text-center">
                                <i
                                    className="fa-solid fa-filter nut-loc"
                                    style={{ marginLeft: '35px', backgroundColor: "#b7b4b3", padding: '9px', marginTop: '1px', borderRadius: '5px', color: 'white', width: '37px' }}
                                    onClick={(e) => {
                                        handleSearchYCCP_NHIEUDK()
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div style={{ width: '100%', overflowY: 'hidden', overflowX: 'auto' }}>

                            {
                                searchRequestType.value == "Yêu cầu xin cấp mới phôi" ? (
                                    <>
                                        {/* Table yêu cầu cấp mới */}
                                        <table className='table table-striped table-hover table-bordered' style={{ width: '1900px', border: '2px solid #fed25c', textAlign: 'center' }} >
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Mã phiếu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Đơn vị yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên loại phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Đợt thi/Đợt cấp văn bằng (D/M/Y)</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Số lượng phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Cán bộ tạo yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">MSCB</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Thời gian tạo</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allRequestIssuance_YCCP_PT?.map((currentValue, index) => {
                                                        let don_vi_yc = '';
                                                        allManagementUnit?.forEach((MU) => {
                                                            if (currentValue.management_unit_id == MU.management_unit_id) {
                                                                don_vi_yc = MU.management_unit_name;
                                                            }
                                                        })
                                                        let ten_loai_phoi = '';
                                                        let nameOfDiplomaType = '';
                                                        let optionsOfDiplomaName;
                                                        allDiplomaName?.forEach((diplomaName) => {
                                                            if (currentValue.diploma_name_id == diplomaName.diploma_name_id) {
                                                                ten_loai_phoi = diplomaName.diploma_name_name;
                                                                optionsOfDiplomaName = diplomaName.options;
                                                                allDiplomaType?.forEach((diplomaType) => {
                                                                    if (diplomaType.diploma_type_id == diplomaName.diploma_type_id) {
                                                                        nameOfDiplomaType = diplomaType.diploma_type_name
                                                                    }
                                                                })
                                                            }
                                                        })
                                                        return (
                                                            <tr key={index}>
                                                                <td>#{currentValue.embryoIssuanceRequest_id}</td>
                                                                <td>{don_vi_yc}</td>
                                                                <td style={{ width: '300px' }}>{ten_loai_phoi}</td>
                                                                <td>{handleDateToDMY(currentValue.examination)}</td>
                                                                <td>{currentValue.numberOfEmbryos}</td>
                                                                <td>{currentValue.fullname_create}</td>
                                                                <td>{currentValue.mscb}</td>
                                                                <td>{handleDateToDMY(currentValue.time)}</td>
                                                                <td>
                                                                    <div style={{ backgroundColor: 'red', padding: '1px', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                                                        {currentValue.status}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        //Nút xem chi tiết yêu cầu xin cấp phôi
                                                                        closeButton == index ? (
                                                                            <i
                                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                className="fa-regular fa-circle-xmark"
                                                                                onClick={(e) => {
                                                                                    setShowRequestDetail(false);
                                                                                    setCloseButton(null)
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            <i
                                                                                style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                                className="fa-solid fa-eye"
                                                                                onClick={(e) => {
                                                                                    setShowRequestDetail(true);
                                                                                    setCloseButton(index)
                                                                                    setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                                    setDiplomaType(nameOfDiplomaType);
                                                                                    setManagementUnitPhieuYC(don_vi_yc);
                                                                                    setDiplomaNameInPhieuYC(ten_loai_phoi);
                                                                                    setExaminationsInPhieuYC(currentValue.examination);
                                                                                    setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos)
                                                                                    setOptionsOfDiplomaName(optionsOfDiplomaName);
                                                                                    getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, optionsOfDiplomaName)
                                                                                }}
                                                                            >
                                                                            </i>
                                                                        )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-center mt-3 mb-3">
                                            <Stack spacing={2}>
                                                <Pagination
                                                    count={Math.ceil(allRequestIssuance_YCCP?.length / 5)}
                                                    variant="outlined"
                                                    page={page}
                                                    onChange={handleChange}
                                                    color="info"
                                                />
                                            </Stack>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Table yêu cầu cấp lại */}
                                        <table className='table table-striped table-hover table-bordered' style={{ width: '1900px', border: '2px solid #fed25c', textAlign: 'center' }} >
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Mã phiếu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Đơn vị yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên loại phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Số lượng phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Cán bộ tạo yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">MSCB</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Thời gian tạo</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Lý do tái cấp</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Seri tái cấp</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allRequestReissue_YCCL_PT?.map((currentValue, index) => {
                                                        let don_vi_yc = '';
                                                        allManagementUnit?.forEach((MU) => {
                                                            if (currentValue.management_unit_id == MU.management_unit_id) {
                                                                don_vi_yc = MU.management_unit_name;
                                                            }
                                                        })
                                                        let ten_loai_phoi = '';
                                                        allDiplomaName?.forEach((diplomaName) => {
                                                            if (currentValue.diploma_name_id == diplomaName.diploma_name_id) {
                                                                ten_loai_phoi = diplomaName.diploma_name_name;

                                                            }
                                                        })
                                                        return (
                                                            <tr key={index}>
                                                                <td>#{currentValue.requestForReissue_id}</td>
                                                                <td>{don_vi_yc}</td>
                                                                <td style={{ width: '300px' }}>{ten_loai_phoi}</td>
                                                                <td>{currentValue.numberOfEmbryos}</td>
                                                                <td>{currentValue.fullname_create}</td>
                                                                <td>{currentValue.mscb_create}</td>
                                                                <td>{handleDateToDMY(currentValue.time_create)}</td>
                                                                <td>{currentValue.reason}</td>
                                                                <td>
                                                                    {
                                                                        <Tooltip
                                                                            theme='dark'
                                                                            html={(
                                                                                <div>
                                                                                    <strong>
                                                                                        {handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end)}
                                                                                    </strong>
                                                                                </div>
                                                                            )}
                                                                            arrow={true}
                                                                            position="top"
                                                                        >
                                                                            <i
                                                                                className="fa-brands fa-periscope"

                                                                                style={{ backgroundColor: "#2F4F4F", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                            ></i>
                                                                        </Tooltip>
                                                                    }
                                                                </td>
                                                                <td>
                                                                    <div style={{ backgroundColor: 'red', padding: '1px', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                                                        {currentValue.status}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        //Nút xem chi tiết yêu cầu xin cấp lại phôi
                                                                        closeButtonDetailRequestReissue == index ? (
                                                                            <i
                                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                className="fa-regular fa-circle-xmark"
                                                                                onClick={(e) => {
                                                                                    setShowDetailRequestReissue(false);
                                                                                    setCloseButtonDetailRequestReissue(null)
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            <i
                                                                                style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                                className="fa-solid fa-eye"
                                                                                onClick={(e) => {
                                                                                    setShowDetailRequestReissue(true);
                                                                                    setCloseButtonDetailRequestReissue(index)
                                                                                    setManagementUnit_CV(don_vi_yc)
                                                                                    setRequestForReissue_id_CV(currentValue.requestForReissue_id);
                                                                                    setDiplomaName_CV(ten_loai_phoi);
                                                                                    setNumberOfEmbryos_CV(currentValue.numberOfEmbryos);
                                                                                    setReason_CV(currentValue.reason);
                                                                                    setResultSeri(handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end))
                                                                                }}
                                                                            >
                                                                            </i>
                                                                        )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="d-flex justify-content-center mt-3 mb-3">
                                            <Stack spacing={2}>
                                                <Pagination
                                                    count={Math.ceil(allRequestReissue_YCCL?.length / 5)}
                                                    variant="outlined"
                                                    page={page_YCCL}
                                                    onChange={handleChange_YCCL}
                                                    color="info"
                                                />
                                            </Stack>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                    <div className="row mt-4">
                        {
                            showRequestDetail ? (
                                <>
                                    <DetailRequest
                                        embryoIssuanceRequest_id={embryoIssuanceRequest_id}
                                        managementUnitPhieuYC={managementUnitPhieuYC}
                                        diplomaNameInPhieuYC={diplomaNameInPhieuYC}
                                        examinationsInPhieuYC={examinationsInPhieuYC}
                                        numberOfEmbryosInPhieuYC={numberOfEmbryosInPhieuYC}
                                        diplomaType={diplomaType}
                                        optionsOfDiplomaName={optionsOfDiplomaName}
                                        allDSHVByEIR={allDSHVByEIR}
                                    ></DetailRequest>
                                </>
                            ) : (
                                <></>
                            )
                        }
                        {
                            showDetailRequestReissue ? (
                                <DetailRequestForReissue
                                    management_unit_detail_request_reissue={managementUnit_CV}
                                    requestForReissue_id_detail_request_reissue={requestForReissue_id_CV}
                                    diploma_name_detail_request_reissue={diplomaName_CV}
                                    numberOfEmbryos_detail_request_reissue={numberOfEmbryos_CV}
                                    reason_detail_request_reissue={reason_CV}
                                    result_seri_detail_request_reissue={resultSeri}
                                ></DetailRequestForReissue>
                            ) : ("")
                        }
                    </div>

                    <hr />
                    <div className='title-list-yc-xin-cap-phoi' style={{ marginTop: "30px" }}>
                        TÌM KIẾM TỔNG HỢP PHIẾU XUẤT KHO
                    </div>
                    <div style={{ backgroundColor: '#A2B5CD', padding: '25px', borderRadius: '10px', marginTop: '20px' }}>
                        <div className="row">
                            <div className="col-md-3">
                                <Select
                                    placeholder="Chọn đơn vị nhận phôi"
                                    options={optionsMU_YCCP}
                                    value={muReceiveDBill}
                                    onChange={handleChangeMuReceiveDBill}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    placeholder='Tìm theo tên người nhận'
                                    className='form-control'
                                    value={receiver}
                                    onChange={(e) => {
                                        setReceiver(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    placeholder='Chọn loại phôi xuất'
                                    options={optionsDiplomaNameDBill}
                                    value={diplomaNameDBill}
                                    onChange={handleChangeDiplomaNameDBill}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    placeholder='Người tạo'
                                    className='form-control'
                                    value={creatorDBill}
                                    onChange={(e) => {
                                        setCreatorDBill(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-2 offset-3">
                                <input
                                    type="date"
                                    className='form-control'
                                    value={startDateDBill}
                                    onChange={(e) => {
                                        setStartDateDBill(e.target.value)
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
                                    value={endDateDBill}
                                    onChange={(e) => {
                                        setEndDateDBill(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-md-1">
                                <i
                                    className="fa-solid fa-filter nut-loc"
                                    style={{ backgroundColor: "white", padding: '9px', marginTop: '1px', borderRadius: '5px', color: 'black', width: '37px' }}
                                    onClick={(e) => {
                                        handleTimPhieuXKNhieuDk()
                                    }}
                                ></i>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div style={{ width: '100%', overflowY: 'hidden', overflowX: 'auto' }}>
                            <table className='table table-striped table-hover table-bordered' style={{ width: '2100px', border: '2px solid #fed25c', textAlign: 'center' }}>
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Mã phiếu</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Người tạo</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">MSCB</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Ngày tạo phiếu (D/M/Y)</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên người nhận</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Địa chỉ/bộ phận nhận</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Lý do xuất</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Kho xuất</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Loại phôi</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Số lượng xuất</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Số seri phôi xuất</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Giá mỗi phôi</th>
                                        <th style={{ backgroundColor: '#fed25c' }} scope="col">Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        allPhieuXK_PT?.map((currentValue, index) => {
                                            let bo_phan_nhan = "";
                                            allManagementUnit?.forEach((MU) => {
                                                if (MU.management_unit_id == currentValue.address_department) {
                                                    bo_phan_nhan = MU.management_unit_name;
                                                }
                                            })
                                            let loai_phoi = "";
                                            allDiplomaName?.forEach((diplomaName) => {
                                                if (currentValue.embryo_type == diplomaName.diploma_name_id) {
                                                    loai_phoi = diplomaName.diploma_name_name;
                                                }
                                            })
                                            return (
                                                <tr key={index}>
                                                    <td>#{currentValue.delivery_bill}</td>
                                                    <td>{currentValue.fullname_create}</td>
                                                    <td>{currentValue.mscb}</td>
                                                    <td>{handleDateToDMY(currentValue.delivery_bill_creation_time)}</td>
                                                    <td>{currentValue.fullname_of_consignee}</td>
                                                    <td>{bo_phan_nhan}</td>
                                                    <td>{currentValue.reason}</td>
                                                    <td>{currentValue.export_warehouse}</td>
                                                    <td style={{ width: '300px' }}>{loai_phoi}</td>
                                                    <td>{currentValue.numberOfEmbryos}</td>
                                                    <td>{
                                                        <Tooltip
                                                            theme='dark'
                                                            html={(
                                                                <div>
                                                                    <strong>
                                                                        {handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end)}
                                                                    </strong>
                                                                </div>
                                                            )}
                                                            arrow={true}
                                                            position="top"
                                                        >
                                                            <i
                                                                className="fa-brands fa-periscope"

                                                                style={{ backgroundColor: "#2F4F4F", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                            ></i>
                                                        </Tooltip>
                                                    }</td>
                                                    <td>{formatter.format(currentValue.unit_price)}</td>
                                                    <td>{formatter.format(currentValue.unit_price*currentValue.numberOfEmbryos)}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-center mt-3 mb-3">
                                <Stack spacing={2}>
                                    <Pagination
                                        count={Math.ceil(allPhieuXK?.length / 5)}
                                        variant="outlined"
                                        page={page_XK}
                                        onChange={handleChange_XK}
                                        color="info"
                                    />
                                </Stack>
                            </div>
                        </div>

                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

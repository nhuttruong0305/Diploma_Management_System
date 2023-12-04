//Trang Nhật ký nhận phôi của tài khoản có chức vụ Thư ký của đơn vị quản lý

import './ManagementUnitSecretary.css'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Tooltip } from 'react-tippy';
import { getAllDiplomaType } from '../../redux/apiRequest';
import DetailRequest from '../DetailRequest/DetailRequest';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
import { Link } from 'react-router-dom';
import Toast from '../Toast/Toast';
export default function ManagementUnitSecretary() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    //State lấy ra all diploma name theo đơn vị quản lý
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    //State chứa all user account
    const [allUserAccount, setAllUserAccount] = useState([]);

    const getAllUserAccount = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    //State options của select có id = select-diploma-name
    const [optionsSelectDiplomaName, setOptionsSelectDiplomaName] = useState([]);
    const [selectedSelectDiplomaName, setSelectedSelectDiplomaName] = useState({ value: "", label: "Tất cả loại phôi" });
    const handleChangeSelectDiplomaName = (selectedOption) => {
        setSelectedSelectDiplomaName(selectedOption);
    }

    useEffect(() => {
        getAllDiplomaNameByMU(user.management_unit);
        getAllUserAccount()
        getAllDiplomaType(dispatch);
        getAllMajorsShowModal()
        getAllManagementUnit()
    }, [])

    const [allRequestIssuance, setAllRequestIssuance] = useState([]);

    //Xử lý count
    const [count1, setCount1] = useState(0);

    const getAllRequestIssuance = async (allDiplomaNameByMU) => {
        try {
            let result = [];
            for (let i = 0; i < allDiplomaNameByMU.length; i++) {
                const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/get_yccp_by_list_diploma_name_id/${allDiplomaNameByMU[i].diploma_name_id}`);
                result = [...result, ...res.data];
            }
            let finalResult = [];
            let resultCount1 = 0;
            result.forEach((currentValue) => {
                if (currentValue.status == "Đã dán tem" || currentValue.status == "Đã nhận phôi") {
                    finalResult = [...finalResult, currentValue];
                }
                if(currentValue.status == "Đã dán tem"){
                    resultCount1++;
                }
            })
            setCount1(resultCount1);
            setAllRequestIssuance(finalResult);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        let resultOption = [{ value: "", label: "Tất cả loại phôi" }];
        allDiplomaNameByMU?.forEach((currentValue) => {
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectDiplomaName(resultOption);
        getAllRequestIssuance(allDiplomaNameByMU);
    }, [allDiplomaNameByMU])

    //State lưu giữ các yc xin cấp mới phôi sau khi lọc theo loại phôi
    const [allRequestIssuanceFilter1, setAllRequestIssuanceFilter1] = useState([]);
    useEffect(() => {
        if (selectedSelectDiplomaName.value != "") {
            let result = [];
            allRequestIssuance?.forEach((currentValue) => {
                if (currentValue.diploma_name_id == selectedSelectDiplomaName.value) {
                    result = [...result, currentValue];
                }
            })
            setAllRequestIssuanceFilter1(result);
        } else {
            setAllRequestIssuanceFilter1(allRequestIssuance);
        }
    }, [selectedSelectDiplomaName, allRequestIssuance])

    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");

    //State lưu giữ các yc xin cấp mới phôi sau khi lọc theo mã phiếu
    const [allRequestIssuanceFilter2, setAllRequestIssuanceFilter2] = useState([]);

    useEffect(() => {
        let result = [];
        if (inputMaPhieuSearch != "") {
            allRequestIssuanceFilter1?.forEach((currentValue) => {
                if (inputMaPhieuSearch == currentValue.embryoIssuanceRequest_id) {
                    result = [...result, currentValue];
                }
            })
            setAllRequestIssuanceFilter2(result);
        } else {
            setAllRequestIssuanceFilter2(allRequestIssuanceFilter1);
        }
    }, [inputMaPhieuSearch, allRequestIssuanceFilter1])

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    //State chứa all YCCP sẽ được hiển thị lên màn hình sau khi phân trang
    const [allRequestIssuance_PT, setAllRequestIssuance_PT] = useState([]);

    useEffect(() => {
        if (page != undefined && allRequestIssuanceFilter2 != undefined) {
            if (allRequestIssuanceFilter2.length > 5) {
                const numberOfPage = Math.ceil(allRequestIssuanceFilter2?.length / 5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if (page == numberOfPage) {
                    endElement = allRequestIssuanceFilter2.length - 1;
                } else {
                    endElement = page * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allRequestIssuanceFilter2[i]];
                }
                setAllRequestIssuance_PT(result);
            } else {
                setAllRequestIssuance_PT(allRequestIssuanceFilter2);
            }
        }
    }, [page, allRequestIssuanceFilter2])

    function handleDateToDMY(date) {
        const splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //State và xử lý logic hiện chi tiết yêu cầu cấp phôi và danh sách học viên kèm theo
    //State để ẩn hiện chi tiết yêu cầu
    const [showDetailRequest, setShowDetailRequest] = useState(false);
    //State để tạo nút đóng
    const [closeButton, setCloseButton] = useState(null);

    //State để lấy dữ liệu chi tiết yêu cầu và điền vào mẫu xin cấp phôi
    const [embryoIssuanceRequest_id, setEmbryoIssuanceRequest_id] = useState("");
    const [managementUnitPhieuYC, setManagementUnitPhieuYC] = useState("");
    const [diplomaNameInPhieuYC, setDiplomaNameInPhieuYC] = useState("");
    const [examinationsInPhieuYC, setExaminationsInPhieuYC] = useState("");
    const [numberOfEmbryosInPhieuYC, setNumberOfEmbryosInPhieuYC] = useState();

    const [diplomaType, setDiplomaType] = useState("");

    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType); //state lấy ra all diploma type
    //state để lấy ra trường options của diplomaName được chọn trong chi tiết yêu cầu cấp phôi
    const [optionsOfDiplomaName, setOptionsOfDiplomaName] = useState([]);
    //state chứa danh sách học viên kèm theo dựa trên yêu cầu cấp phôi
    const [allDSHVByEIR, setAllDSHVByEIR] = useState([]);

    const scrollToDetailRequest = () => {
        setTimeout(() => {
            document.body.scrollTop = 1120;
            document.documentElement.scrollTop = 1120;
        }, 200)
    }

    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
        return result;
    }

    //State để lấy all major trong DB ra
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

    function scrollToDeliveryBill() {
        if (showDetailRequest == false) {
            setTimeout(() => {
                document.body.scrollTop = 1120;
                document.documentElement.scrollTop = 1120;
            }, 200)
        } else {
            setTimeout(() => {
                document.body.scrollTop = 3000;
                document.documentElement.scrollTop = 3000;
            }, 200)
        }
    }

    //Xử lý logic để hiển thị chi tiết phiếu xuất kho
    const [showDeliveryBill, setShowDeliveryBill] = useState(false);
    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);

    const [detailDeliveryBill, setDetailDeliveryBill] = useState([]);

    //Hàm call api lấy chi tiết phiếu xuất kho
    const getDetailDeliveryBill = async (embryoIssuanceRequest_id) => {
        try {
            const result = await axios.get(`http://localhost:8000/v1/delivery_bill/get_detail_delivery_bill/${embryoIssuanceRequest_id}`);
            setDetailDeliveryBill(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSeri = (seriNumber) => {
        let seriAfterProcessing = seriNumber.toString();
        switch(seriAfterProcessing.length){
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

    //xử lý logic cập nhật nhật ký nhận phôi
    const [diary, setDiary] = useState("");
    const [_IdRequestIssuance, set_IdRequestIssuance] = useState({});
    const noti = useRef();
    const handleAddDiaryRequestIssuance = async () => {
        try {

            //Lấy ngày hiện tại để điền time tạo yêu cầu
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            const year = today.getFullYear();

            if (day < 10) {
                day = `0${day}`;
            }

            if (month < 10) {
                month = `0${month}`;
            }

            const updateDoc = {
                status: "Đã nhận phôi",
                embryo_receipt_diary: diary,
                mscb_diary_creator: user.mssv_cb,
                time_diary_creator: `${year}-${month}-${day}`
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_IdRequestIssuance._id}`, updateDoc);
            noti.current.showToast();
            setTimeout(async () => {
                await getAllRequestIssuance(allDiplomaNameByMU);
            }, 200);
        } catch (error) {
            console.log(error);
        }

        //Gửi mail cho thư ký của Tổ quản lý phôi vbcc
        let allUserSecretary = [];
        allUserAccount?.forEach((currentValue) => {
            if (currentValue.role[0] == "Secretary" && currentValue.management_unit == 13) {
                allUserSecretary = [...allUserSecretary, currentValue];
            }
        })

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        let ten_cb_tao_phieu_xk = '';
        allUserAccount?.forEach((user) => {
            if(user.mssv_cb == _IdRequestIssuance.mscb){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
            if(user.mssv_cb == detailDeliveryBill[0].mscb){
                ten_cb_tao_phieu_xk = user.fullname;
            }
        })

        //Lấy ra tên đơn vị quản lý để điền vào "Đơn vị yêu cầu" và địa chỉ (bộ phận) nhận hàng
        let don_vi_yc = '';
        let receiving_address = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _IdRequestIssuance.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
            if(management_unit.management_unit_id == detailDeliveryBill[0].address_department){
                receiving_address = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaNameByMU?.forEach((diplomaName)=>{
            if(_IdRequestIssuance.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        //Lấy ra số seri để điền vào phiếu xuất kho
        let resultSeri = '';
        let resultSeriStart = detailDeliveryBill[0].seri_number_start;
        let resultSeriEnd = detailDeliveryBill[0].seri_number_end;
        for(let i = 0; i<resultSeriStart.length-1; i++){
            resultSeri+=`${handleSeri(resultSeriStart[i])} - ${handleSeri(resultSeriEnd[i])}, `;
        }
        resultSeri+=`${handleSeri(resultSeriStart[resultSeriStart.length-1])} - ${handleSeri(resultSeriEnd[resultSeriEnd.length-1])}`;

        for (let i = 0; i < allUserSecretary.length; i++) {
            try {
                const mailOptions = {
                    to: allUserSecretary[i].email,
                    subject: "Đã nhận được phôi",
                    html: `<div
                            style="
                            background-color: #f3f2f0;
                            padding: 50px 150px 50px 150px;
                            color: black;
                            "
                        >
                            <div style="background-color: white;">
                            <div>
                                <img
                                style="width: 50px; margin-top: 25px; margin-left: 25px;"
                                src="https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png"
                                />
                            </div>
                            <h1 style="text-align: center; font-size: 24px; padding: 15px;">
                                Đã nhận được phôi
                            </h1>
                            <hr />
                            <h3 style="text-align: center;">Chi tiết yêu cầu</h3>
                            <div style="padding: 0px 25px 10px 25px;">
                                <div>Mã phiếu: #${_IdRequestIssuance.embryoIssuanceRequest_id}</div>
                                <div style="margin-top: 10px;">
                                Đơn vị yêu cầu: ${don_vi_yc}
                                </div>
                                <div style="margin-top: 10px;">
                                Loại phôi cần cấp: ${loai_phoi}
                                </div>
                                <div style="margin-top: 10px;">
                                Đợt thi/đợt cấp bằng: ${handleDateToDMY(_IdRequestIssuance.examination)}
                                </div>
                                <div style="margin-top: 10px;">
                                Số lượng phôi cần cấp: ${_IdRequestIssuance.numberOfEmbryos}
                                </div>
                                <div style="margin-top: 10px;">
                                Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_IdRequestIssuance.mscb}
                                </div>
                                <div style="margin-top: 10px;">
                                Thời gian tạo: ${handleDateToDMY(_IdRequestIssuance.time)}
                                </div>
                            </div>
                            <hr />
                            <h3 style="margin-top: 15px; text-align: center;">
                                Chi tiết phiếu xuất kho
                            </h3>
                            <div style="padding: 0px 25px 10px 25px;">
                                <div>Số phiếu xuất kho: ${detailDeliveryBill[0].delivery_bill}</div>
                                <div style="margin-top: 10px;">Ngày tạo phiếu: ${handleDateToDMY(detailDeliveryBill[0].delivery_bill_creation_time)}</div>
                                <div style="margin-top: 10px;">Người nhận hàng: ${detailDeliveryBill[0].fullname_of_consignee}</div>
                                <div style="margin-top: 10px;">
                                Địa chỉ (bộ phận) nhận hàng: ${receiving_address}
                                </div>
                                <div style="margin-top: 10px;">
                                Lý do xuất: ${detailDeliveryBill[0].reason}
                                </div>
                                <div style="margin-top: 10px;">
                                Kho xuất: ${detailDeliveryBill[0].export_warehouse}
                                </div>
                                <div style="margin-top: 10px;">
                                Địa điểm xuất: ${detailDeliveryBill[0].address_export_warehouse}
                                </div>
                                <div style="margin-top: 10px;">
                                Loại phôi: ${loai_phoi}
                                </div>
                                <div style="margin-top: 10px;">
                                Số lượng phôi xuất: ${detailDeliveryBill[0].numberOfEmbryos}
                                </div>
                                <div style="margin-top: 10px;">
                                Số seri: ${resultSeri}
                                </div>
                                <div style="margin-top: 10px;">
                                Đơn giá mỗi phôi: ${detailDeliveryBill[0].unit_price}
                                </div>
                                <div style="margin-top: 10px;">
                                Thành tiền: ${detailDeliveryBill[0].unit_price * detailDeliveryBill[0].numberOfEmbryos}
                                </div>
                                <div style="margin-top: 10px;">
                                Người tạo phiếu xuất kho: ${ten_cb_tao_phieu_xk} / ${detailDeliveryBill[0].mscb}
                                </div>
                                <div style="margin-top: 15px;">
                                <a
                                    href="http://localhost:3000/request_for_issuance_of_embryos_processed"
                                >
                                    <button
                                    style="
                                        border-radius: 20px;
                                        padding: 10px;
                                        color: #146ec6;
                                        font-weight: bold;
                                        border: 2px solid #146ec6;
                                        background-color: white;
                                    "
                                    >
                                    Xem thêm
                                    </button>
                                </a>
                                </div>
                            </div>
                            </div>
                        </div>`
                }
                const sendEmail = await axios.post("http://localhost:8000/v1/send_email/sendEmail", mailOptions);
            } catch (error) {
                console.log(error);
            }
        }
    }
    return (
        <>
            <Header />
            <div className="container body-management-unit-secretary">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className='row'>
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li style={{ backgroundColor: '#1b95a2', color: "white" }} className="list-group-item">Nhận phôi theo yêu cầu cấp mới</li>
                                    <Link style={{textDecoration: 'none'}} to="/management_unit_secretary_request_reissue">
                                        <li className="list-group-item">Nhận phôi theo yêu cầu cấp lại</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div className="row">
                                    <div className="col-6">
                                        <Select
                                            id='select-diploma-name'
                                            options={optionsSelectDiplomaName}
                                            value={selectedSelectDiplomaName}
                                            onChange={handleChangeSelectDiplomaName}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            placeholder='Tìm kiếm theo mã phiếu'
                                            className='form-control'
                                            value={inputMaPhieuSearch}
                                            onChange={(e)=>{
                                                setInputMaPhieuSearch(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <p className='title-list-yc-xin-cap-phoi'>CÁC YÊU CẦU CẤP PHÔI ĐÃ ĐƯỢC XỬ LÝ VÀ GỬI VỀ</p>
                                </div>
                                <div className="row mt-3 p-3">
                                    <div>
                                        <div className="oval">
                                            Có {count1} yêu cầu cần cập nhật nhật ký nhận phôi
                                        </div>
                                        <div className="triangle2"></div>
                                    </div>
                                    <div className="contain-table-receive-request-issuance">
                                        <table className='table table-striped table-hover table-bordered' style={{ width: '1700px', border: '2px solid #fed25c', textAlign: 'center' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Mã phiếu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên loại phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Số lượng phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Cán bộ tạo yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">MSCB</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem chi tiết</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem phiếu xuất kho</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Thêm nhật ký nhận phôi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allRequestIssuance_PT?.map((currentValue, index) => {
                                                        let ten_loai_phoi = '';
                                                        let loai_van_bang = '';
                                                        let options;
                                                        allDiplomaNameByMU?.forEach((diplomaName) => {
                                                            if (currentValue.diploma_name_id == diplomaName.diploma_name_id) {
                                                                ten_loai_phoi = diplomaName.diploma_name_name;
                                                                options = diplomaName.options;
                                                                allDiplomaType?.forEach((diplomaType) => {
                                                                    if (diplomaType.diploma_type_id == diplomaName.diploma_type_id) {
                                                                        loai_van_bang = diplomaType.diploma_type_name;
                                                                    }
                                                                })
                                                            }
                                                        })

                                                        let ten_cb_tao_yc = '';
                                                        allUserAccount?.forEach((user) => {
                                                            if (currentValue.mscb == user.mssv_cb) {
                                                                ten_cb_tao_yc = user.fullname;
                                                            }
                                                        })
                                                        return (
                                                            <tr key={index}>
                                                                <td>#{currentValue.embryoIssuanceRequest_id}</td>
                                                                <td>{ten_loai_phoi}</td>
                                                                <td>{handleDateToDMY(currentValue.examination)}</td>
                                                                <td>{currentValue.numberOfEmbryos}</td>
                                                                <td>{ten_cb_tao_yc}</td>
                                                                <td>{currentValue.mscb}</td>
                                                                <td style={{ color: "red", fontWeight: 'bold' }}>
                                                                    <Tooltip
                                                                        // options
                                                                        theme='dark'
                                                                        html={(
                                                                            <div>
                                                                                <strong>
                                                                                    {currentValue.comment}
                                                                                </strong>
                                                                            </div>
                                                                        )}
                                                                        arrow={true}
                                                                        position="top"
                                                                    >
                                                                        {currentValue.status}
                                                                    </Tooltip>
                                                                </td>
                                                                <td>

                                                                    {
                                                                        closeButton == index ? (
                                                                            <i
                                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                className="fa-regular fa-circle-xmark"
                                                                                onClick={(e) => {
                                                                                    setShowDetailRequest(false)
                                                                                    setCloseButton(null)
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            <i
                                                                                className="fa-solid fa-eye"
                                                                                style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                                onClick={(e) => {
                                                                                    setCloseButton(index)
                                                                                    setShowDetailRequest(true)
                                                                                    setDiplomaType(loai_van_bang);
                                                                                    allManagementUnit?.forEach((management_unit) => {
                                                                                        if (management_unit.management_unit_id == currentValue.management_unit_id) {
                                                                                            setManagementUnitPhieuYC(management_unit.management_unit_name);
                                                                                        }
                                                                                    })
                                                                                    setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                                    setDiplomaNameInPhieuYC(ten_loai_phoi);
                                                                                    setExaminationsInPhieuYC(currentValue.examination);
                                                                                    setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos);
                                                                                    setOptionsOfDiplomaName(options);
                                                                                    getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options);
                                                                                    scrollToDetailRequest()
                                                                                }}
                                                                            ></i>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        //Nút xem phiếu xuất kho
                                                                        closeButtonDeliveryBill == index ? (
                                                                            <i
                                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                className="fa-regular fa-circle-xmark"
                                                                                onClick={(e) => {
                                                                                    setShowDeliveryBill(false);
                                                                                    setCloseButtonDeliveryBill(null)
                                                                                }}
                                                                            ></i>
                                                                        ) : currentValue.status == "Đã in phôi" || currentValue.status == "Đã dán tem" || currentValue.status == "Đã nhận phôi" ? (
                                                                            <i
                                                                                className="fa-solid fa-info"
                                                                                style={{ backgroundColor: "#FF6A6A", width: '32px', padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                                onClick={(e) => {
                                                                                    setCloseButtonDeliveryBill(index);
                                                                                    setShowDeliveryBill(true);
                                                                                    getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
                                                                                    scrollToDeliveryBill();
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            <i
                                                                                className="fa-solid fa-info"
                                                                                style={{ backgroundColor: "grey", width: '32px', padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                            ></i>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        //nút thêm nhật ký nhận phôi
                                                                        currentValue.status == "Đã dán tem" ? (
                                                                            <i
                                                                                className="fa-solid fa-book"
                                                                                style={{ backgroundColor: "#339966", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                data-bs-toggle="modal" data-bs-target="#modalDiaryRequestIssuance"
                                                                                onClick={(e) => {
                                                                                    set_IdRequestIssuance(currentValue);
                                                                                    getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            
                                                                                <Tooltip
                                                                                    // options
                                                                                    theme='dark'
                                                                                    html={(
                                                                                        <div>
                                                                                            <strong>
                                                                                                {currentValue.embryo_receipt_diary}
                                                                                            </strong>
                                                                                        </div>
                                                                                    )}
                                                                                    arrow={true}
                                                                                    position="top"
                                                                                >
                                                                                    <i
                                                                                        className="fa-solid fa-book-open"
                                                                                        style={{ backgroundColor: "pink", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                                    >
                                                                                        </i>
                                                                                </Tooltip>
                                                                            
                                                                        )
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Modal thêm nhật ký nhận phôi */}
                                    <div className="modal fade" id="modalDiaryRequestIssuance" tabIndex="-1" aria-labelledby="modalDiaryRequestIssuanceLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header" style={{ backgroundColor: '#feefbf' }}>
                                                    <h1 className="modal-title fs-5" id="modalDiaryRequestIssuanceLabel">Thêm nhật ký nhận phôi</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="form-floating">
                                                                <textarea
                                                                    className="form-control"
                                                                    value={diary}
                                                                    onChange={(e) => {
                                                                        setDiary(e.target.value);
                                                                    }}
                                                                    placeholder="Leave a comment here"
                                                                    id="diaryRequestIssuance" style={{ height: "100px" }}></textarea>
                                                                <label htmlFor="diaryRequestIssuance">Nhập nhật ký nhận phôi</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={(e) => {
                                                            handleAddDiaryRequestIssuance();
                                                        }}
                                                        style={{ background: '#1b95a2' }}>Thêm</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="d-flex justify-content-center mt-3 mb-3">
                                        <Stack spacing={2}>
                                            <Pagination
                                                count={Math.ceil(allRequestIssuanceFilter2?.length / 5)}
                                                variant="outlined"
                                                page={page}
                                                onChange={handleChange}
                                                color="info"
                                            />
                                        </Stack>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        {
                            showDetailRequest ? (
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
                            ) : ("")
                        }
                        {
                            showDeliveryBill ? (
                                detailDeliveryBill?.map((currentValue, index) => {
                                    return (
                                        <div key={index}>
                                            <DetailDeliveryBill
                                                delivery_bill={currentValue?.delivery_bill}
                                                delivery_bill_creation_time={currentValue?.delivery_bill_creation_time}
                                                fullname_of_consignee={currentValue?.fullname_of_consignee}
                                                address_department={currentValue?.address_department}
                                                reason={currentValue?.reason}
                                                export_warehouse={currentValue?.export_warehouse}
                                                address_export_warehouse={currentValue?.address_export_warehouse}
                                                embryo_type={currentValue?.embryo_type}
                                                numberOfEmbryos={currentValue?.numberOfEmbryos}
                                                seri_number_start={currentValue?.seri_number_start}
                                                seri_number_end={currentValue?.seri_number_end}
                                                unit_price={currentValue?.unit_price}
                                                mscb={currentValue?.mscb}
                                            >
                                            </DetailDeliveryBill>
                                        </div>
                                    )
                                })
                            ) : ("")
                        }
                    </div>
                </div>
            </div>
            <Footer />
            <Toast
                message="Thêm nhật ký nhận phôi thành công"
                type="success"
                ref={noti}
            />
        </>
    )
}


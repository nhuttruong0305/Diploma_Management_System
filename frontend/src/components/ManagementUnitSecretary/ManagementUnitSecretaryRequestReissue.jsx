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
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
import DetailRequestForReissue from '../DetailRequestForReissue/DetailRequestForReissue';
import { Link } from 'react-router-dom';
import Toast from '../Toast/Toast';
export default function ManagementUnitSecretaryRequestReissue() {
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
        getAllUserAccount();
        getAllManagementUnit();
    }, [])

    const [allRequestReissue, setAllRequestReissue] = useState([]);

    //Hàm lấy ra các yc xin cấp lại phôi dựa theo danh sách các diploma_name của đơn vị quản lý, mã phiếu và trạng thái. Loại phôi và người tạo sẽ xử lý tại frontend
    const getAllRequestForReissueByListMU_ID_Status = async (allDiplomaNameByMU, inputMaPhieuSearch, statusYC) => {
        try {
            let result1 = [];
            for (let i = 0; i < allDiplomaNameByMU.length; i++) {
                const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/get_all_request_for_reissue_by_list_diploma_name_id/${allDiplomaNameByMU[i].diploma_name_id}?status=${statusYC}&requestForReissue_id=${inputMaPhieuSearch}`);
                result1 = [...result1, ...res.data];
            }
            let result = [];
            result1.forEach((currentValue)=>{
                if(currentValue.status == "Đã dán tem" || currentValue.status == "Đã nhận phôi"){
                    result = [...result, currentValue];
                }
            })

            for (let i = 0; i < result.length; i++) {
                for (let j = 0; j < allUserAccount.length; j++) {
                    if (result[i].mscb_create == allUserAccount[j].mssv_cb) {
                        result[i]['fullname_create'] = allUserAccount[j].fullname;
                    }
                }
            }

            setAllRequestReissue(result);
        } catch (error) {
            console.log(error)
        }
    }
    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");
    useEffect(() => {
        let resultOption = [{ value: "", label: "Tất cả loại phôi" }];
        allDiplomaNameByMU?.forEach((currentValue) => {
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectDiplomaName(resultOption);
        getAllRequestForReissueByListMU_ID_Status(allDiplomaNameByMU, inputMaPhieuSearch, "");
    }, [allDiplomaNameByMU, inputMaPhieuSearch])

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    //State chứa all YCCP sẽ được hiển thị lên màn hình sau khi phân trang
    const [allRequestReissue_PT, setAllRequestReissue_PT] = useState([]);

    useEffect(() => {
        if (page != undefined && allRequestReissue != undefined) {
            if (allRequestReissue.length > 5) {
                const numberOfPage = Math.ceil(allRequestReissue?.length / 5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if (page == numberOfPage) {
                    endElement = allRequestReissue.length - 1;
                } else {
                    endElement = page * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allRequestReissue[i]];
                }
                setAllRequestReissue_PT(result);
            } else {
                setAllRequestReissue_PT(allRequestReissue);
            }
        }
    }, [page, allRequestReissue])
    function handleDateToDMY(date) {
        const splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
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

    const scrollToDetailRequest = () => {
        setTimeout(() => {
            document.body.scrollTop = 1120;
            document.documentElement.scrollTop = 1120;
        }, 200)
    }

    //Xử lý việc lấy chi tiết phiếu xuất kho
    const [showDeliveryBill, setShowDeliveryBill] = useState(false);
    const [detailDeliveryBill, setDetailDeliveryBill] = useState([]);

    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);

    //Hàm call api lấy chi tiết phiếu xuất kho
    const getDetailDeliveryBill = async (requestForReissue_id) => {
        try {
            const result = await axios.get(`http://localhost:8000/v1/delivery_bill/get_detail_delivery_bill_request_reissue/${requestForReissue_id}`);
            setDetailDeliveryBill(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    function scrollToDeliveryBill() {
        if (showDetailRequestReissue == false) {
            setTimeout(() => {
                document.body.scrollTop = 1000;
                document.documentElement.scrollTop = 1000;
            }, 200)
        } else {
            setTimeout(() => {
                document.body.scrollTop = 2850;
                document.documentElement.scrollTop = 2850;
            }, 200)
        }
    }

    //xử lý logic cập nhật nhật ký nhận phôi
    const [diary, setDiary] = useState("");
    const [_IdRequestReissue, set_IdRequestReissue] = useState({});
    const noti = useRef();
    const handleAddDiaryRequestReissue = async () => {
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

            const updateStatus = await axios.put(`http://localhost:8000/v1/request_for_reissue/update_request_reissue_by_req_body/${_IdRequestReissue._id}`, updateDoc);
            noti.current.showToast();
            setTimeout(async () => {
                await getAllRequestForReissueByListMU_ID_Status(allDiplomaNameByMU, inputMaPhieuSearch, "");
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

        //Lấy ra tên đơn vị quản lý để điền vào "Đơn vị yêu cầu" và địa chỉ (bộ phận) nhận hàng
        let don_vi_yc = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _IdRequestReissue.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaNameByMU?.forEach((diplomaName)=>{
            if(_IdRequestReissue.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let nguoi_duyet = '';
        allUserAccount?.forEach((user) => {
            if(user.mssv_cb == _IdRequestReissue.mscb_create){
                ten_cb_tao_yc = user.fullname;
            }
            if(user.mssv_cb == _IdRequestReissue.mscb_approve){
                nguoi_duyet = user.fullname
            }
        })

        for (let i = 0; i < allUserSecretary.length; i++) {
            try {
                const mailOptions = {
                    to: allUserSecretary[i].email,
                    subject: "Đã nhận được phôi",
                    html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                    <div style='background-color: white;'>
                        <div>
                            <img
                                style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                            />
                        </div>
                        <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                            Đã nhận được phôi
                        </h1>
                        <hr />
                        <h3 style='text-align: center;'>Chi tiết yêu cầu</h3>
                        <div style='padding: 0px 25px 10px 25px;'>
                            <div>Mã phiếu: #${_IdRequestReissue.requestForReissue_id}</div>
                            <div style='margin-top: 10px;'>
                                Đơn vị yêu cầu: ${don_vi_yc}
                            </div>
                            <div style='margin-top: 10px;'>
                                Loại phôi cần cấp: ${loai_phoi}
                            </div>
                            <div style='margin-top: 10px;'>
                                Số lượng tái cấp: ${_IdRequestReissue.numberOfEmbryos}
                            </div>
                            <div style='margin-top: 10px;'>
                                Số seri tái cấp: ${handleResultSeri(_IdRequestReissue.seri_number_start, _IdRequestReissue.seri_number_end)}
                            </div>
                            <div style='margin-top: 10px;'>
                                Lý do: ${_IdRequestReissue.reason}
                            </div>
                            <div style='margin-top: 10px;'>
                                Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_IdRequestReissue.mscb_create}
                            </div>
                            <div style='margin-top: 10px;'>
                                Thời gian tạo: ${handleDateToDMY(_IdRequestReissue.time_create)}
                            </div>
                            <div style='margin-top: 10px;'>
                                Người xét duyệt: ${nguoi_duyet} / ${_IdRequestReissue.mscb_approve}
                            </div>
                            <div style='margin-top: 15px;'>
                            <a href='http://localhost:3000/'>
                                <button
                                style='
                                    border-radius: 20px;
                                    padding: 10px;
                                    color: #146ec6;
                                    font-weight: bold;
                                    border: 2px solid #146ec6;
                                    background-color: white;
                                '
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
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{ textDecoration: 'none' }} to="/management_unit_secretary">
                                        <li className="list-group-item">Nhận phôi theo yêu cầu cấp mới</li>
                                    </Link>
                                    <li style={{ backgroundColor: '#1b95a2', color: "white" }} className="list-group-item">Nhận phôi theo yêu cầu cấp lại</li>
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
                                            onChange={(e) => {
                                                setInputMaPhieuSearch(e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <p className='title-list-yc-xin-cap-phoi'>CÁC YÊU CẦU CẤP LẠI PHÔI ĐÃ ĐƯỢC XỬ LÝ VÀ GỬI VỀ</p>
                                </div>
                                <div className="row mt-3 p-3">
                                    <div className="contain-table-receive-request-issuance">
                                        <table className='table table-striped table-hover table-bordered' style={{ width: '1700px', border: '2px solid #fed25c', textAlign: 'center' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Mã phiếu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên loại phôi</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Số lượng tái cấp</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên cán bộ tạo yêu cầu</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">MSCB</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Thời gian tạo</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Lý do</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Số seri tái cấp</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem chi tiết</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Xem phiếu xuất kho</th>
                                                    <th style={{ backgroundColor: '#fed25c' }} scope="col">Thêm nhật ký nhận phôi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allRequestReissue_PT?.map((currentValue, index) => {
                                                        let ten_loai_phoi = '';
                                                        allDiplomaNameByMU?.forEach((diplomaName) => {
                                                            if (currentValue.diploma_name_id == diplomaName.diploma_name_id) {
                                                                ten_loai_phoi = diplomaName.diploma_name_name;
                                                            }
                                                        })

                                                        return (
                                                            <tr key={index}>
                                                                <td>#{currentValue.requestForReissue_id}</td>
                                                                <td>{ten_loai_phoi}</td>
                                                                <td>{currentValue.numberOfEmbryos}</td>
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
                                                                <td>{currentValue.fullname_create}</td>
                                                                <td>{currentValue.mscb_create}</td>
                                                                <td>{handleDateToDMY(currentValue.time_create)}</td>
                                                                <td>{currentValue.reason}</td>
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
                                                                <td>
                                                                    {
                                                                        //Nút xem chi tiết yêu cầu xin cấp phôi
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
                                                                                    allManagementUnit?.forEach((management_unit) => {
                                                                                        if (management_unit.management_unit_id == currentValue.management_unit_id) {
                                                                                            setManagementUnit_CV(management_unit.management_unit_name)
                                                                                        }
                                                                                    })
                                                                                    setRequestForReissue_id_CV(currentValue.requestForReissue_id);
                                                                                    allDiplomaNameByMU?.forEach((diplomaName) => {
                                                                                        if (diplomaName.diploma_name_id == currentValue.diploma_name_id) {
                                                                                            setDiplomaName_CV(diplomaName.diploma_name_name);
                                                                                        }
                                                                                    })
                                                                                    setNumberOfEmbryos_CV(currentValue.numberOfEmbryos);
                                                                                    setReason_CV(currentValue.reason);
                                                                                    setResultSeri(handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end))
                                                                                    scrollToDetailRequest()
                                                                                }}
                                                                            >
                                                                            </i>
                                                                        )
                                                                    }
                                                                </td>
                                                                <td>{
                                                                    closeButtonDeliveryBill == index ? (
                                                                        <i
                                                                            style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                            className="fa-regular fa-circle-xmark"
                                                                            onClick={(e) => {
                                                                                setShowDeliveryBill(false);
                                                                                setCloseButtonDeliveryBill(null);
                                                                            }}
                                                                        ></i>
                                                                    ) : (
                                                                        // nút xem chi tiết phiếu xuất kho 
                                                                        <i
                                                                            className="fa-solid fa-circle-info"
                                                                            style={{ backgroundColor: "#0dcaf0", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                            onClick={(e) => {
                                                                                getDetailDeliveryBill(currentValue.requestForReissue_id);
                                                                                setCloseButtonDeliveryBill(index);
                                                                                setShowDeliveryBill(true);
                                                                                scrollToDeliveryBill()
                                                                            }}
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
                                                                                data-bs-toggle="modal" data-bs-target="#modalDiaryRequestReissue"
                                                                                onClick={(e) => {
                                                                                    set_IdRequestReissue(currentValue);
                                                                                    getDetailDeliveryBill(currentValue.requestForReissue_id);
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

                                    <div className="modal fade" id="modalDiaryRequestReissue" tabIndex="-1" aria-labelledby="modalDiaryRequestReissueLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header" style={{ backgroundColor: '#feefbf' }}>
                                                    <h1 className="modal-title fs-5" id="modalDiaryRequestReissueLabel">Thêm nhật ký nhận phôi</h1>
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
                                                                    id="diaryRequestReissue" style={{ height: "100px" }}></textarea>
                                                                <label htmlFor="diaryRequestReissue">Nhập nhật ký nhận phôi</label>
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
                                                            handleAddDiaryRequestReissue()
                                                        }}
                                                        style={{ background: '#1b95a2' }}>Thêm</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-center mt-3">
                                        <Stack spacing={2}>
                                            <Pagination
                                                count={Math.ceil(allRequestReissue?.length / 5)}
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
                    <div className="row pb-3 mt-4">
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
                        {
                            showDeliveryBill ? (
                                //Lưu ý mỗi yêu cầu xin cấp phôi chỉ có duy nhất 1 delivery bill trong DB
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
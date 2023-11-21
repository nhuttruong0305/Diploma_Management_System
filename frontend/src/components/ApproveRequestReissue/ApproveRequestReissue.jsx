import './ApproveRequestReissue.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName } from '../../redux/apiRequest';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DetailRequestForReissue from '../DetailRequestForReissue/DetailRequestForReissue';
import { Tooltip } from 'react-tippy';
import Toast from '../Toast/Toast';
export default function ApproveRequestReissue(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName);

    //State chứa all user account
    const [allUserAccount, setAllUserAccount] = useState([]);

    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        }catch(error){
            console.log(error);
        }
    }

    const handleDateToDMY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
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

    const handleResultSeri = (seri_number_start, seri_number_end) => {
        let resultSeri = '';
        for(let i = 0; i<seri_number_start.length-1; i++){
            resultSeri+=`${handleSeri(seri_number_start[i])} - ${handleSeri(seri_number_end[i])}, `
        }
        resultSeri+=`${handleSeri(seri_number_start[seri_number_start.length-1])} - ${handleSeri(seri_number_end[seri_number_end.length-1])}`;
        return resultSeri;
    }

    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

    //State chứa options, selected của select có id = select-management-unit
    const [optionsSelectMU, setOptionsSelectMU] = useState([]);
    const [selectedSelectMU, setSelectedSelectMU] = useState({value: '', label: "Tất cả đơn vị quản lý"});
    const handleChangeSelectedSelectMU = (selectedOption) => {
        setSelectedSelectMU(selectedOption);
    }

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
        getAllDiplomaName(dispatch);
        getAllUserAccount()
    }, [])

    useEffect(()=>{
        let resultOption = [{value:"", label:"Tất cả đơn vị quản lý"}];
        allManagementUnit?.forEach((MU) => {
            const newOption = {value: MU.management_unit_id, label: MU.management_unit_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectMU(resultOption);
    }, [allManagementUnit])
    
    //State options và selected của select có id = select-diploma-name
    const [optionsSelectDiplomaName, setOptionsSelectDiplomaName] = useState([]);
    const [selectedSelectDiplomaName, setSelectedSelectDiplomaName] = useState({value:"", label: "Tất cả loại phôi"});
    const handleChangeSelectDiplomaName = (selectedOption) => {
        setSelectedSelectDiplomaName(selectedOption);
    }

    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);

    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            if(management_unit_id!=""){
                const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);            
                setAllDiplomaNameByMU(res.data);
            }
        }catch(error){
            console.log(error);
        }
    }

    const getAllDiplomaNameInDB = async () => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diploma_name`);            
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        setSelectedSelectDiplomaName({value:"", label: "Tất cả loại phôi"});
        if(selectedSelectMU.value != ""){
            getAllDiplomaNameByMU(selectedSelectMU.value);
        }else{
            getAllDiplomaNameInDB();
        }
    }, [selectedSelectMU])

    useEffect(()=>{
        let resultOption = [{value:"", label:"Tất cả loại phôi"}];
        allDiplomaNameByMU?.forEach((currentValue) => {
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectDiplomaName(resultOption);
    }, [allDiplomaNameByMU])

    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("")
    const [statusYC, setStatusYC] = useState({value: "", label:"Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) =>{
        setStatusYC(selectedOption)
    }


    //State chứa all yc cấp lại phôi sau khi lọc theo status và mã phiếu
    const[allRequestReissue, setAllRequestReissue] = useState([]);

    //Hàm lấy các yc cấp lại phôi khi lọc theo status và mã phiếu
    const getAllRequestReissueByID_Status = async (inputMaPhieuSearch, statusYC) => {
        try{
            let result = [];
            const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/get_all_request_for_reissue?requestForReissue_id=${inputMaPhieuSearch}&status=${statusYC}`);
            result =[...result, ...res.data];
            setAllRequestReissue(result);           
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllRequestReissueByID_Status(inputMaPhieuSearch, statusYC.value);
    }, [inputMaPhieuSearch, statusYC.value])

    //State chứa các yc cấp lại phôi sau khi lọc theo đơn vị quản lý và loại phôi
    const[allRequestReissueFilter, setAllRequestReissueFilter] = useState([]);

    useEffect(()=>{
        let result = [];
        if(selectedSelectMU.value != ""){
            allRequestReissue?.forEach((currentValue) => {
                if(currentValue.management_unit_id == selectedSelectMU.value){
                    result = [...result, currentValue];
                }
            })
        }else{
            result = [...result, ...allRequestReissue];
        }

        let result2 = []
        if(selectedSelectDiplomaName.value != ""){
            result?.forEach((currentValue) => {
                if(currentValue.diploma_name_id == selectedSelectDiplomaName.value){
                    result2 = [...result2, currentValue]
                }
            })
        }else{
            result2 = [...result2, ...result];
        }

        for(let i = 0; i < result2.length; i++){
            for(let j = 0; j < allUserAccount.length; j++){
                if(result2[i].mscb_create == allUserAccount[j].mssv_cb){
                    result2[i]['fullname_create'] = allUserAccount[j].fullname;
                }
            }
        }
        setAllRequestReissueFilter(result2);
    }, [selectedSelectMU, selectedSelectDiplomaName, allRequestReissue])
    
    //State chứa các yc cấp lại phôi sau khi phân trang
    const [allRequestReissue_PT, setAllRequestReissue_PT] = useState([]);
    
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };
    
    useEffect(()=>{
        if(page!=undefined && allRequestReissueFilter!=undefined){
            if(allRequestReissueFilter.length>5){
                const numberOfPage = Math.ceil(allRequestReissueFilter?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allRequestReissueFilter.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allRequestReissueFilter[i]];
                }
                setAllRequestReissue_PT(result);
            }else{
                setAllRequestReissue_PT(allRequestReissueFilter);
            }         
        }
    }, [page, allRequestReissueFilter])

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
        setTimeout(()=>{
            document.body.scrollTop = 1120;
            document.documentElement.scrollTop = 1120;
        },200)
    }

    //Xử lý việc xét duyệt/không duyệt yêu cầu
    //State chứa phần diễn giải (là comment trong DB)
    const [explainRequestReissue, setExplainRequestReissue] = useState("");

    //State chứa object của YC cấp lại phôi dc xét duyệt
    const [_IdRequestReissue, set_IdRequestReissue] = useState({});

    const noti = useRef();
    //Hàm duyệt
    const handleApproveRequestReissue = async () =>{
        const todayApprove = new Date();
        let dayApprove = todayApprove.getDate();
        let monthApprove = todayApprove.getMonth() + 1;
        const yearApprove = todayApprove.getFullYear();

        if(dayApprove<10){
            dayApprove = `0${dayApprove}`;
        }

        if(monthApprove<10){
            monthApprove = `0${monthApprove}`;
        }
        
        try{
            const updateDoc = {
                status: "Đã duyệt yêu cầu",
                comment: explainRequestReissue,
                mscb_approve: user.mssv_cb,
                time_approve: `${yearApprove}-${monthApprove}-${dayApprove}`
            }
            const res = await axios.put(`http://localhost:8000/v1/request_for_reissue/update_request_reissue_by_req_body/${_IdRequestReissue._id}`, updateDoc);
        }catch(error){
            console.log(error);
            return;
        }
        noti.current.showToast();
        setTimeout(()=>{
            getAllRequestReissueByID_Status(inputMaPhieuSearch, statusYC.value);
        },100);
        //--------------------
        let don_vi_yc = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _IdRequestReissue.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaName?.forEach((diplomaName)=>{
            if(_IdRequestReissue.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _IdRequestReissue.mscb_create){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
        })
        
        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu
        try{
            const mailOptions = { 
            to: email_cb_tao_yc,
            subject: "Đã duyệt yêu cầu xin cấp lại phôi",
            html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                    <div style='background-color: white;'>
                        <div>
                            <img
                                style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                            />
                        </div>
                        <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                            Yêu cầu xin cấp lại phôi của bạn đã được duyệt
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
                                Người xét duyệt: ${user.fullname} / ${user.mssv_cb}
                            </div>
                            <div style='margin-top: 15px;'>
                            <a href='http://localhost:3000/create_request_reissue'>
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
        }catch(error){
            console.log(error);
            return;
        }

        //Gửi mail cho all tài khoản thư ký
        let allUserSecretary = [];
        allUserAccount?.forEach((user)=>{
            if(user.role[0] == 'Secretary' && user.management_unit == 13){
                allUserSecretary = [...allUserSecretary, user];
            }
        })
        for(let i = 0; i<allUserSecretary.length; i++){
            try{
                const mailOptions = { 
                    to: allUserSecretary[i].email,
                    subject: "Một yêu cầu xin cấp lại phôi mới vừa được duyệt",
                    html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                            <div style='background-color: white;'>
                                <div>
                                    <img
                                        style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                        src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                    />
                                </div>
                                <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                    Một yêu cầu xin cấp lại phôi mới vừa được duyệt
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
                                        Người xét duyệt: ${user.fullname} / ${user.mssv_cb}
                                    </div>
                                    <div style='margin-top: 15px;'>
                                    <a href='http://localhost:3000/request_reissue_for_secretary'>
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
            }catch(error){
                console.log(error);
                return;
            }
        }
    }

    const noti2 = useRef();
    //Hàm không duyệt
    const handleNotApproveRequestReissue = async () => {
        const todayApprove = new Date();
        let dayApprove = todayApprove.getDate();
        let monthApprove = todayApprove.getMonth() + 1;
        const yearApprove = todayApprove.getFullYear();

        if(dayApprove<10){
            dayApprove = `0${dayApprove}`;
        }

        if(monthApprove<10){
            monthApprove = `0${monthApprove}`;
        }

        try{
            const updateDoc = {
                status: "Không duyệt",
                comment: explainRequestReissue,
                mscb_approve: user.mssv_cb,
                time_approve: `${yearApprove}-${monthApprove}-${dayApprove}`
            }
            const res = await axios.put(`http://localhost:8000/v1/request_for_reissue/update_request_reissue_by_req_body/${_IdRequestReissue._id}`, updateDoc);
        }catch(error){
            console.log(error);
            return;
        }
        noti2.current.showToast();
        setTimeout(() => {
            getAllRequestReissueByID_Status(inputMaPhieuSearch, statusYC.value);
        }, 100);
        //--------------------
        let don_vi_yc = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _IdRequestReissue.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaName?.forEach((diplomaName)=>{
            if(_IdRequestReissue.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _IdRequestReissue.mscb_create){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
        })
        
        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu
        try{
            const mailOptions = { 
                to: email_cb_tao_yc,
                subject: "Yêu cầu xin cấp lại phôi của bạn đã không được duyệt",
                html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                        <div style='background-color: white;'>
                            <div>
                                <img
                                    style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                    src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                />
                            </div>
                            <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                Yêu cầu xin cấp lại phôi của bạn đã không được duyệt
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
                                    Người xét duyệt: ${user.fullname} / ${user.mssv_cb}
                                </div>
                                <div style='margin-top: 15px;'>
                                <a href='http://localhost:3000/create_request_reissue'>
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
        }catch(error){
            console.log(error);
            return;
        }
    }

    return(
        <>  
            <Header/>
            <div id="body-approve-request-reissue" className="container">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-6">
                                <Select
                                    id='select-management-unit'
                                    value={selectedSelectMU}
                                    onChange={handleChangeSelectedSelectMU}
                                    options={optionsSelectMU}
                                />
                            </div>
                            <div className="col-6">
                                <Select
                                    id='select-diploma-name'
                                    options={optionsSelectDiplomaName}
                                    value={selectedSelectDiplomaName}
                                    onChange={handleChangeSelectDiplomaName}
                                />
                            </div>
                        </div>
                        <div className="row p-3">
                            <div className="col-6">
                                <input 
                                    type="text"
                                    value={inputMaPhieuSearch}
                                    onChange={(e)=>{
                                        setInputMaPhieuSearch(e.target.value)
                                    }} 
                                    className='form-control'
                                    placeholder='Tìm theo mã phiếu'
                                />
                            </div>
                            <div className="col-6">
                                <Select
                                    options={[
                                        {value: "", label:"Tất cả trạng thái"},
                                        {value: "Đã gửi yêu cầu", label: "Đã gửi yêu cầu"},
                                        {value:"Không duyệt", label: "Không duyệt"},
                                        {value: "Đã duyệt yêu cầu", label: "Đã duyệt yêu cầu"},
                                        {value: "Đã gửi thủ kho", label: "Đã gửi thủ kho"},
                                        {value: "Đã in phôi", label: "Đã in phôi"},
                                        {value: "Đã dán tem", label: "Đã dán tem"},
                                        {value: "Đã nhận phôi", label: "Đã nhận phôi"},
                                    ]}
                                    value={statusYC}
                                    onChange={handleChangeStatusYC}
                                />
                            </div>
                        </div>
                        <div className='title-list-yc-xin-cap-phoi'>
                            DANH SÁCH CÁC YÊU CẦU XIN CẤP LẠI PHÔI
                        </div>

                        <div className="row p-5">
                            <div id="contain-table-approve-request-reissue">
                                <table id='table-approve-request-reissue' className='table table-striped table-hover table-bordered'>
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên loại phôi</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng tái cấp</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên cán bộ tạo yêu cầu</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Thời gian tạo</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Lý do</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số seri phôi tái cấp</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xét duyệt</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem phiếu xuất kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allRequestReissue_PT?.map((currentValue, index) => {
                                                let ten_loai_phoi = '';
                                                allDiplomaName?.forEach((diplomaName) => {
                                                    if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                        ten_loai_phoi = diplomaName.diploma_name_name;
                                                    }
                                                })
                                                return(
                                                    <tr key={index}>
                                                        <td>#{currentValue.requestForReissue_id}</td>
                                                        <td>{ten_loai_phoi}</td>
                                                        <td>{currentValue.numberOfEmbryos}</td>
                                                        <td style={{fontWeight: 'bold', color: 'red'}}>
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
                                                            handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end)
                                                        }</td>
                                                        <td>
                                                            {
                                                                //Nút xem chi tiết yêu cầu xin cấp phôi
                                                                closeButtonDetailRequestReissue == index ? (
                                                                    <i 
                                                                        style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                        className="fa-regular fa-circle-xmark"
                                                                        onClick={(e)=>{
                                                                            setShowDetailRequestReissue(false);
                                                                            setCloseButtonDetailRequestReissue(null)
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i 
                                                                        style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        className="fa-solid fa-eye"
                                                                        onClick={(e)=>{                                                          
                                                                            setShowDetailRequestReissue(true);
                                                                            setCloseButtonDetailRequestReissue(index)
                                                                            allManagementUnit?.forEach((management_unit)=>{
                                                                                if(management_unit.management_unit_id == currentValue.management_unit_id){
                                                                                    setManagementUnit_CV(management_unit.management_unit_name)
                                                                                }
                                                                            })
                                                                            setRequestForReissue_id_CV(currentValue.requestForReissue_id);
                                                                            allDiplomaName?.forEach((diplomaName) => {
                                                                                if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
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
                                                        <td>
                                                            {
                                                                //Nút xét duyệt yêu cầu
                                                                currentValue.status == "Đã gửi yêu cầu" ? (
                                                                    <i 
                                                                        className="fa-solid fa-pen-to-square"
                                                                        style={{backgroundColor: "#2E8B57", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        data-bs-toggle="modal" data-bs-target="#modalApproveRequestReissue"
                                                                        onClick={(e)=>{
                                                                            set_IdRequestReissue(currentValue)
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i 
                                                                        className="fa-solid fa-check"
                                                                        style={{backgroundColor: "grey", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    ></i>
                                                                )
                                                            }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                {/* Modal xét duyệt yêu cầu */}
                                <div className="modal fade" id="modalApproveRequestReissue" tabIndex="-1" aria-labelledby="modalApproveRequestReissueLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="modalApproveRequestReissueLabel">Xét duyệt yêu cầu xin cấp lại phôi</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-8">
                                                    <div className="form-floating">
                                                        <textarea 
                                                            className="form-control" 
                                                            value={explainRequestReissue}
                                                            onChange={(e)=>{
                                                                setExplainRequestReissue(e.target.value);
                                                            }}
                                                            placeholder="Leave a comment here" 
                                                            id="explain-request-reissue" style={{height: "100px"}}></textarea>
                                                        <label htmlFor="explain-request-reissue">Nhập diễn giải</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button 
                                                type="button" 
                                                className="btn btn-secondary" 
                                                data-bs-dismiss="modal"
                                            >Đóng</button>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger"
                                                onClick={(e)=>{
                                                    handleNotApproveRequestReissue()
                                                }}
                                            >Không duyệt</button>
                                            <button 
                                                type="button" 
                                                className="btn"
                                                style={{backgroundColor: '#1b95a2'}}
                                                onClick={(e)=>{
                                                    handleApproveRequestReissue()
                                                }}
                                            >Duyệt</button>
                                        </div>
                                        </div>
                                    </div>
                                    </div>

                            </div>
                            <div className="d-flex justify-content-center mt-3">
                                <Stack spacing={2}>
                                    <Pagination 
                                        count={Math.ceil(allRequestReissueFilter?.length/5)}
                                        variant="outlined"
                                        page={page}
                                        onChange={handleChange}
                                        color="info"
                                        />
                                </Stack>
                            </div>
                        </div>
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
                </div>
            </div>
            <Footer/>
            <Toast
                message="Duyệt yêu cầu thành công"
                type="success"
                ref={noti}
            />
            <Toast
                message="Cập nhật trạng thái yêu cầu thành 'Không duyệt' thành công"
                type="success"
                ref={noti2}
            />
        </>
    )
}
//Trang xử lý yêu cầu xin cấp lại phôi cho thủ kho

import './RequestReissueForStocker.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName } from '../../redux/apiRequest';
import DetailRequestForReissue from '../DetailRequestForReissue/DetailRequestForReissue';
import { Tooltip } from 'react-tippy';
import Toast from '../Toast/Toast';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
export default function RequestReissueForStocker(){
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
            res.data.forEach((currentValue)=>{
                if(currentValue.status != "Đã gửi yêu cầu" && currentValue.status != "Đã duyệt yêu cầu" && currentValue.status != "Không duyệt"){
                    result = [...result, currentValue];
                }
            })
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

    //Các state cho việc xử lý tạo phiếu xuất kho
    const [requestForReissue_id_DBill, setRequestForReissue_id_DBill] = useState(0);
    const [fullname_of_consignee, setFullname_of_consignee] = useState("");

    const [address_department, setAddress_department] = useState("");   
    const [address_departmentShow, setAddress_departmentShow] = useState("");   

    const [reason, setReason] = useState("");
    const [export_warehouse, setExport_warehouse] = useState("");
    const [address_export_warehouse, setAddress_export_warehouse] = useState("Trung tâm Quản lý văn bằng chứng chỉ - Trường Đại học Cần Thơ");

    const [embryo_type, setEmbryo_type] = useState("");
    const [embryo_typeShow, setEmbryo_typeShow] = useState("");

    const [numberOfEmbryos,setNumberOfEmbryos] = useState(0);

    const [inputSeriNumberStart, setInputSeriNumberStart] = useState(""); 
    const [inputSeriNumberEnd, setInputSeriNumberEnd] = useState("");

    const [seri_number_start, setSeri_number_start] = useState([]);
    const [seri_number_end, setSeri_number_end] = useState([]);

    const [unit_price, setUnit_price] = useState(0);

    //State chứa object của YC cấp lại phôi dc xét duyệt
    const [_IdRequestReissue, set_IdRequestReissue] = useState({});

    //Giá trị seri thấp nhất dc nhập trong các lần nhập, dc gán lại sau mỗi lần nhập
    const [lowestSerialNumber, setLowestSerialNumber] = useState("");

    //Giá trị seri thấp nhất đầu tiên, chỉ dc gán 1 lần
    const [firstLowestSerialNumber, setFirstLowestSerialNumber] = useState("");

    //Lấy phiếu xuất kho cuối cùng của loại phôi đang tạo phiếu xuất kho để biết được số seri bắt đầu
    const getLastedDeliveryBillBaseOnEmbryoType = async (embryo_type) => {
        try{
            //Lấy ra phiếu xuất kho cuối cùng của 1 loại phôi
            const lastedDeliveryBillBasedOnembryo_type = await axios.get(`http://localhost:8000/v1/delivery_bill/get_lasted_delivery_bill_based_on_embryo_type/${parseInt(embryo_type)}`);
            
            //Lấy ra các số seri bị hư của 1 loại phôi
            const listDamagedSerialNumber = await axios.get(`http://localhost:8000/v1/damaged_embryos/get_the_damaged_serial_number/${parseInt(embryo_type)}`);

            if(lastedDeliveryBillBasedOnembryo_type.data == null){
                let index = 1;
                let stop = false;
                while(!stop){
                    if(!listDamagedSerialNumber.data.includes(index)){
                        setLowestSerialNumber(index);
                        setFirstLowestSerialNumber(index);
                        stop = true;
                    }else{
                        index++;
                    }
                }
            }else{
                let index = lastedDeliveryBillBasedOnembryo_type.data.seri_number_end[lastedDeliveryBillBasedOnembryo_type.data.seri_number_end.length-1]+1;
                let stop = false;
                while(!stop){
                    if(!listDamagedSerialNumber.data.includes(index)){
                        setLowestSerialNumber(index);
                        setFirstLowestSerialNumber(index);
                        stop = true;
                    }else{
                        index++;
                    }
                }
            }
        }catch(error){
            console.log(error);
            return;
        }
    }
    
    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();
    const noti4 = useRef();
    const handleAddSeriToArray = async () =>{
        if(inputSeriNumberStart == "" || inputSeriNumberStart == NaN || inputSeriNumberEnd == "" || inputSeriNumberEnd == NaN){
            noti.current.showToast();
            return;
        }

        if(parseInt(inputSeriNumberStart)< parseInt(lowestSerialNumber)){
            noti2.current.showToast();
            return;
        }
        
        if( parseInt(inputSeriNumberEnd)<parseInt(inputSeriNumberStart)){
            noti3.current.showToast();
            return;
        }

        let listDamagedSerialNumber;
        //Kiểm tra xem số seri từ bắt đầu tới kết thúc có nằm trong ds seri hư không
        try{
            const resultListDamagedSerialNumber = await axios.get(`http://localhost:8000/v1/damaged_embryos/get_the_damaged_serial_number/${parseInt(embryo_type)}`);
            listDamagedSerialNumber = resultListDamagedSerialNumber.data;
        }catch(error){
            console.log(error);
            return
        }

        for(let i = parseInt(inputSeriNumberStart); i<=parseInt(inputSeriNumberEnd); i++){
            if(listDamagedSerialNumber.includes(i)){
                noti4.current.showToast();
                return;
            }
        }

        setSeri_number_start((prev) =>{ return [...prev, parseInt(inputSeriNumberStart)]});
        setSeri_number_end((prev) =>{ return [...prev, parseInt(inputSeriNumberEnd)]});

        setInputSeriNumberStart("");
        setInputSeriNumberEnd("");

        let index = parseInt(inputSeriNumberEnd)+1;
        let stop = false;
        while(!stop){
            if(!listDamagedSerialNumber.includes(index)){
                setLowestSerialNumber(index);
                stop = true;
            }else{
                index++;
            }
        }
    }

    const noti5 = useRef();
    const noti6 = useRef();
    const handleCreateDeliveryBill = async () => {
        if(export_warehouse == ""){
            noti5.current.showToast();
            return;
        }

        if(seri_number_start.length == 0 || seri_number_end.length == 0){
            noti.current.showToast();
            return;
        }

        const newDeliveryBill = {
            requestForReissue_id: parseInt(requestForReissue_id_DBill),
            fullname_of_consignee: fullname_of_consignee,
            address_department: parseInt(address_department),
            reason: reason,
            export_warehouse: export_warehouse,
            address_export_warehouse: address_export_warehouse,
            embryo_type: parseInt(embryo_type),
            numberOfEmbryos: parseInt(numberOfEmbryos),
            seri_number_start: seri_number_start,
            seri_number_end: seri_number_end,
            unit_price: parseInt(unit_price),
            mscb: user.mssv_cb
        }

        //Object chứa phiếu xuất kho mới tạo được trả về khi tạo phiếu xuất kho
        let newDeliveryBillCreated; 
        try{
            //call api tạo phiếu xuất kho
            const res = await axios.post("http://localhost:8000/v1/delivery_bill/create_delivery_bill_for_request_reissue", newDeliveryBill);
            newDeliveryBillCreated = res.data;

            //call api cập nhật trạng thái yêu cầu xin cấp phôi
            const updateDoc = {
                status: "Đã in phôi"
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/request_for_reissue/update_request_reissue_by_req_body/${_IdRequestReissue._id}`, updateDoc);
        }catch(error){
            console.log(error);
            return;
        }

        noti6.current.showToast();
        setTimeout(async() => {
            await getAllRequestReissueByID_Status(inputMaPhieuSearch, statusYC.value);
        }, 200);

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
        let nguoi_duyet = '';
        let allUserSecretary = []
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _IdRequestReissue.mscb_create){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
            if(user.role[0] == "Secretary" && user.management_unit == 13){
                allUserSecretary = [...allUserSecretary, user]
            }
            if(user.mssv_cb == _IdRequestReissue.mscb_approve){
                nguoi_duyet = user.fullname;
            }
        })

        //Gửi mail cho cán bộ tạo yêu cầu biết
        try{
            const mailOptions = { 
                to: email_cb_tao_yc,
                subject: "Đã in phôi theo yêu cầu xin cấp lại phôi",
                html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                        <div style='background-color: white;'>
                            <div>
                                <img
                                    style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                    src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                />
                            </div>
                            <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                Đã in phôi theo yêu cầu xin cấp lại phôi
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

        //Gửi mail cho các tài khoản thư ký của tổ quản lý vbcc 
        for(let i = 0; i<allUserSecretary.length; i++){
            try{
                const mailOptions = { 
                    to: allUserSecretary[i].email,
                    subject: "Một yêu cầu xin cấp lại phôi mới đã được xử lý",
                    html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                            <div style='background-color: white;'>
                                <div>
                                    <img
                                        style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                        src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                    />
                                </div>
                                <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                    Một yêu cầu xin cấp lại phôi mới đã được xử lý
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
                                    <a href='http://localhost:3000/request_reissue_processed'>
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

    //Xử lý việc lấy chi tiết phiếu xuất kho
    const [showDeliveryBill, setShowDeliveryBill] = useState(false);
    const [detailDeliveryBill, setDetailDeliveryBill] = useState([]);

    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);

    //Hàm call api lấy chi tiết phiếu xuất kho
    const getDetailDeliveryBill = async (requestForReissue_id) => {
        try{
            const result = await axios.get(`http://localhost:8000/v1/delivery_bill/get_detail_delivery_bill_request_reissue/${requestForReissue_id}`);
            setDetailDeliveryBill(result.data);
        }catch(error){
            console.log(error);
        }
    }

    function scrollToDeliveryBill(){
        if(showDetailRequestReissue == false){
            setTimeout(()=>{
                document.body.scrollTop = 1000;
                document.documentElement.scrollTop = 1000;
            },200)
        }else{
            setTimeout(()=>{
                document.body.scrollTop = 2850;
                document.documentElement.scrollTop = 2850;
            },200)
        }
    }

    return(
        <>
        <Header/>
            <div className="container" id='body-request-reissue-stocker'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className='card pb-3'>
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
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                                <Select
                                    options={[
                                        {value: "", label: "Tất cả trạng thái"},
                                        {value: "Đã gửi thủ kho", label:"Đã gửi thủ kho"},
                                        {value: "Đã in phôi", label: "Đã in phôi"},
                                        {value: "Đã dán tem", label: "Đã dán tem"},
                                        {value: "Đã nhận phôi", label: "Đã nhận phôi"}
                                    ]}
                                    value={statusYC}
                                    onChange={handleChangeStatusYC}
                                />
                            </div>
                        </div>

                        <div className="row mt-3">
                            <p className='title-list-yc-xin-cap-phoi'>DANH SÁCH CÁC YÊU CẦU XIN CẤP LẠI PHÔI CẦN XỬ LÝ</p>
                        </div>
                        
                        <div className='row mt-3 p-3'>
                            <div id="contain-request-reissue-for-stocker">
                                <table className='table table-striped table-hover table-bordered' id='table-request-reissue-for-stocker'>
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên loại phôi</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng tái cấp</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên cán bộ tạo yêu cầu</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Thời gian tạo</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số seri tái cấp</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Lý do</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">
                                                Tạo phiếu xuất kho
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allRequestReissue_PT?.map((currentValue, index) => {
                                                let ten_loai_phoi = '';
                                                let don_gia_moi_phoi;
                                                allDiplomaName?.forEach((diplomaName) => {
                                                    if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                        ten_loai_phoi = diplomaName.diploma_name_name;
                                                        don_gia_moi_phoi = diplomaName.unit_price;
                                                    }
                                                })
                                                let don_vi_quan_ly = '';
                                                allManagementUnit?.forEach((management_unit)=>{
                                                    if(management_unit.management_unit_id == currentValue.management_unit_id){
                                                        don_vi_quan_ly = management_unit.management_unit_name;
                                                    }
                                                })
                                                return(
                                                    <tr key={index}>
                                                        <td>#{currentValue.requestForReissue_id}</td>
                                                        <td>{ten_loai_phoi}</td>
                                                        <td>{currentValue.numberOfEmbryos}</td>
                                                        <td style={{color:"red", fontWeight: 'bold'}}>
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
                                                                    
                                                                    style={{backgroundColor: "#2F4F4F", padding: '7px', borderRadius: '5px', color: 'white', width: '32px'}}  
                                                                ></i>
                                                            </Tooltip>
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
                                                            currentValue.status == "Đã gửi thủ kho" ? (
                                                                //nút tạo phiếu xuất kho
                                                                <i 
                                                                    className="fa-solid fa-pen-to-square"
                                                                    style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    data-bs-toggle="modal" data-bs-target="#createDBillRequestReissue"
                                                                    onClick={(e)=>{
                                                                        set_IdRequestReissue(currentValue);
                                                                        setRequestForReissue_id_DBill(currentValue.requestForReissue_id);
                                                                        setFullname_of_consignee(currentValue.fullname_create);
                                                                        setAddress_department(currentValue.management_unit_id);
                                                                        setAddress_departmentShow(don_vi_quan_ly);
                                                                        setReason(currentValue.reason);
                                                                        setEmbryo_type(currentValue.diploma_name_id);
                                                                        setEmbryo_typeShow(ten_loai_phoi);
                                                                        setNumberOfEmbryos(currentValue.numberOfEmbryos);
                                                                        setUnit_price(don_gia_moi_phoi);
                                                                        getLastedDeliveryBillBaseOnEmbryoType(currentValue.diploma_name_id)
                                                                    }}
                                                                ></i>
                                                            ) : closeButtonDeliveryBill == index ? (
                                                                <i 
                                                                    style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                    className="fa-regular fa-circle-xmark"
                                                                    onClick={(e)=>{
                                                                        setShowDeliveryBill(false);
                                                                        setCloseButtonDeliveryBill(null);
                                                                    }}
                                                                ></i>
                                                            ) : (
                                                                //nút show chi tiết phiếu xuất kho
                                                                <i 
                                                                    className="fa-solid fa-circle-info"
                                                                    style={{backgroundColor: "#0dcaf0", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    onClick={(e)=>{
                                                                        getDetailDeliveryBill(currentValue.requestForReissue_id);
                                                                        setCloseButtonDeliveryBill(index);
                                                                        setShowDeliveryBill(true);
                                                                        scrollToDeliveryBill()
                                                                    }}
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

                                {/* Modal tạo phiếu xuất kho */}
                                <div className="modal fade" id="createDBillRequestReissue" tabIndex="-1" aria-labelledby="createDBillRequestReissueLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                            <h1 className="modal-title fs-5" id="createDBillRequestReissueLabel">Tạo phiếu xuất kho</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Họ và tên người nhận hàng</label>
                                                </div>
                                                <div className="col-9">
                                                    <input 
                                                        type="text" 
                                                        className='form-control'
                                                        readOnly={true}
                                                        value={fullname_of_consignee}
                                                        onChange={(e)=>{
                                                            setFullname_of_consignee(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Địa chỉ (bộ phận) nhận hàng</label>
                                                </div>
                                                <div className="col-9">
                                                    <input 
                                                        type="text" 
                                                        className='form-control'
                                                        value={address_departmentShow}
                                                        onChange={(e)=>{
                                                            setAddress_departmentShow(e.target.value)
                                                        }}
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Lý do xuất kho</label>
                                                </div>
                                                <div className="col-9">
                                                    <input 
                                                        type="text" 
                                                        value={reason}
                                                        onChange={(e)=>{
                                                            setReason(e.target.value)
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Xuất tại kho</label>
                                                </div>
                                                <div className="col-9">
                                                    <input 
                                                        type="text" 
                                                        value={export_warehouse}
                                                        onChange={(e)=>{
                                                            setExport_warehouse(e.target.value)
                                                        }}
                                                        className="form-control"
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Địa điểm</label>
                                                </div>
                                                <div className="col-9">
                                                    <input 
                                                        type="text" 
                                                        value={address_export_warehouse}
                                                        onChange={(e)=>{
                                                            setAddress_export_warehouse(e.target.value)
                                                        }}
                                                        className="form-control"
                                                        readOnly={true}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Loại phôi</label>
                                                </div>
                                                <div className="col-9">
                                                    <input
                                                        type='text'
                                                        value={embryo_typeShow}
                                                        className='form-control'
                                                        readOnly={true}
                                                        onChange={(e)=>{
                                                            setEmbryo_typeShow(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Số lượng phôi xuất</label>
                                                </div>
                                                <div className="col-9">
                                                    <input
                                                        type='number'
                                                        readOnly={true}
                                                        className='form-control'
                                                        value={numberOfEmbryos}
                                                        onChange={(e)=>{
                                                            setNumberOfEmbryos(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Đơn giá mỗi phôi</label>
                                                </div>
                                                <div className="col-9">
                                                    <input
                                                        type='number'
                                                        className='form-control'
                                                        value={unit_price}
                                                        onChange={(e)=>{
                                                            setUnit_price(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">
                                                    <label
                                                        htmlFor="fullname"
                                                        className="col-form-label text-end d-block"
                                                        style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                    >Nhập số seri của phôi được cấp</label>
                                                </div>
                                                <div className="col-3">
                                                    <input 
                                                        type="number"
                                                        className='form-control' 
                                                        placeholder='Số seri bắt đầu'                                                        
                                                        value={inputSeriNumberStart}
                                                        onChange={(e)=>{
                                                            setInputSeriNumberStart(e.target.value)
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-1 text-center">
                                                    <i className="fa-solid fa-arrow-right" style={{marginTop: '10px'}}></i>
                                                </div>
                                                <div className="col-3">
                                                    <input 
                                                        type="number"
                                                        className='form-control'
                                                        placeholder='Số seri kết thúc'
                                                        value={inputSeriNumberEnd}
                                                        onChange={(e)=>[
                                                            setInputSeriNumberEnd(e.target.value)
                                                        ]}
                                                    />
                                                </div>
                                                <div className='col-1'>
                                                    <i 
                                                        className="fa-solid fa-check"
                                                        style={{backgroundColor: "#3184fa", padding: '10px 7px 7px 7px', borderRadius: '5px', color: 'white', width: '37px', height: '37px', textAlign: 'center'}}
                                                        onClick={(e)=>{
                                                            handleAddSeriToArray()
                                                        }}
                                                    ></i>
                                                    
                                                </div>
                                                <div className="col-1">
                                                    <i 
                                                        className="fa-solid fa-arrows-rotate"
                                                        style={{backgroundColor: "#990000", padding: '10px 7px 7px 7px', borderRadius: '5px', color: 'white', width: '37px', height: '37px', textAlign: 'center'}}
                                                        onClick={(e)=>{
                                                            setSeri_number_start([]);
                                                            setSeri_number_end([]);
                                                            setLowestSerialNumber(firstLowestSerialNumber)
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>

                                            {/* Lấy mảng seri start và end hiện ra màn hình */}
                                            {
                                                seri_number_start?.map((seri, index)=>{
                                                    return(
                                                        <div className="row mt-3" key={index}>
                                                            <div className="col-3 offset-3">
                                                                <input 
                                                                    type="number"
                                                                    className='form-control'
                                                                    value={seri}
                                                                    readOnly={true}
                                                                />
                                                            </div>
                                                            <div className="col-1 text-center">
                                                                <i className="fa-solid fa-arrow-right" style={{marginTop: '10px'}}></i>
                                                            </div>
                                                            <div className="col-3">
                                                                <input 
                                                                    type="number"
                                                                    className='form-control'
                                                                    value={seri_number_end[index]}
                                                                    readOnly={true}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="button" 
                                                className="btn btn-primary"
                                                style={{backgroundColor: '#1b95a2'}}
                                                onClick={(e)=>{
                                                    handleCreateDeliveryBill()
                                                }}
                                            >Tạo phiếu</button>
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
                        {
                            showDeliveryBill ? (
                                //Lưu ý mỗi yêu cầu xin cấp phôi chỉ có duy nhất 1 delivery bill trong DB
                                detailDeliveryBill?.map((currentValue, index) => {
                                    return(
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
        <Footer/>
        <Toast
            message="Hãy nhập đầy đủ số seri yêu cầu"
            type="warning"
            ref={noti}
        />
        <Toast
            message={`Hãy nhập số seri bắt đầu lớn hơn hoặc bằng ${lowestSerialNumber}`}
            type="warning"
            ref={noti2}
        />
        <Toast
            message="Số seri kết thúc phải lớn hơn số seri bắt đầu"
            type="warning"
            ref={noti3}
        />
        <Toast
            message="Trong dãy số seri được nhập có số seri của phôi hư, vui lòng nhập số khác"
            type="warning"
            ref={noti4}
        />
        <Toast
            message="Hãy nhập kho xuất"
            type="warning"
            ref={noti5}
        />
        <Toast
            message="Tạo phiếu xuất kho thành công"
            type="success"
            ref={noti6}
        />
        </>
    )
}
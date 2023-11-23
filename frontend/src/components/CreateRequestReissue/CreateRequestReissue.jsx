//Trang quản lý các yêu cầu xin cấp lại phôi
import './CreateRequestReissue.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Select from 'react-select';
import Toast from '../Toast/Toast';
import { getAllDiplomaName } from '../../redux/apiRequest';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DetailRequestForReissue from '../DetailRequestForReissue/DetailRequestForReissue';
import { Tooltip } from 'react-tippy';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
export default function CreateRequestReissue(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);

    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    //State lưu all MU
    const [allManagementUnit, setAllManagementUnit] = useState([]);

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

    //State lưu tên đơn vị quản lý của tài khoản
    const [managementUnitOfUser, setManagementUnitOfUser] = useState("");
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllManagementUnit(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllManagementUnit();
        getAllDiplomaNameByMU(user.management_unit);
        getAllUserAccount();
        getAllDiplomaName(dispatch);
    }, [])

    useEffect(()=>{
        allManagementUnit?.forEach((currentValue)=>{
            if(user.management_unit == currentValue.management_unit_id){
                setManagementUnitOfUser(currentValue.management_unit_name);
            }
        })
    }, [allManagementUnit]);

    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);

    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //options của select có id = select-diplomaName-CRR
    const [optionsDiplomaNameCRR, setOptionsDiplomaNameCRR] = useState([]);
    //State lưu selected của select có id = select-diplomaName-CRR
    const [selectDiplomaNameCRR, setSelectDiplomaNameCRR] = useState("");
    const handleChangeDiplomaNameCRR = (selectedOption) => {
        setSelectDiplomaNameCRR(selectedOption);
    }

    const [numberOfEmbryos, setNumberOfEmbryos] = useState("");

    //Xử lý logic lấy số seri_number_start và seri_number_end
    const [inputSeriStart, setInputSeriStart] = useState("");
    const [inputSeriEnd, setInputSeriEnd] = useState("");
    const [lowestSerialNumber, setLowestSerialNumber] = useState(1);

    const [seri_number_start, setSeri_number_start] = useState([]);
    const [seri_number_end, setSeri_number_end] = useState([])

    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();
    const handleAddSeriToArray = () =>{
        if(inputSeriStart == "" || inputSeriStart == NaN || inputSeriEnd == "" || inputSeriEnd == NaN){
            noti.current.showToast();
            return;
        }

        if(parseInt(inputSeriStart)<parseInt(lowestSerialNumber)){
            noti2.current.showToast();
            return;
        }

        if(parseInt(inputSeriEnd) < parseInt(inputSeriStart)){
            noti3.current.showToast();
            return;
        }
        
        setSeri_number_start((prev) =>{ return [...prev, parseInt(inputSeriStart)]});
        setSeri_number_end((prev) =>{ return [...prev, parseInt(inputSeriEnd)]});

        setInputSeriStart("");
        setInputSeriEnd("");
        setLowestSerialNumber(parseInt(inputSeriEnd)+1)
    } 

    const [reason, setReason] = useState("");

    const [showFormCreateRequest, setShowFormCreateRequest] = useState(false);

    //Hàm tạo yêu cầu xin cấp lại phôi
    const noti4 = useRef();
    const noti5 = useRef();
    const noti6 = useRef();
    const noti7 = useRef();

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

    const handleCreateRequestForReissue = async () => {
        if(selectDiplomaNameCRR == "" || selectDiplomaNameCRR == undefined){
            noti4.current.showToast();
            return;
        }
        
        if(numberOfEmbryos == ""){
            noti5.current.showToast();
            return;
        }

        if(seri_number_start.length == 0 || seri_number_end.length == 0){
            noti.current.showToast();
            return;
        }

        if(reason == ""){
            noti6.current.showToast();
            return;
        }
    
        const newRequestForReissue = {
            management_unit_id: user.management_unit,
            diploma_name_id: selectDiplomaNameCRR.value,
            numberOfEmbryos: parseInt(numberOfEmbryos),
            mscb_create: user.mssv_cb,
            reason: reason,
            seri_number_start: seri_number_start,
            seri_number_end: seri_number_end
        }

        //Tạo yêu cầu xin cấp lại phôi mới
        let resultNewRequestForReissue;
        try{
            const result = await axios.post("http://localhost:8000/v1/request_for_reissue/create_request_for_reissue", newRequestForReissue);
            resultNewRequestForReissue = result.data;
        }catch(error){
            console.log(error);
            return;
        }

        //Cập nhật danh sách hư
        const newDamagedEmbryos = {
            diploma_name_id: selectDiplomaNameCRR.value,
            numberOfEmbryos: parseInt(numberOfEmbryos),
            seri_number_start: seri_number_start,
            seri_number_end: seri_number_end,
            reason: reason,
            mscb_create: user.mssv_cb
        }
        
        try{
            const res = await axios.post("http://localhost:8000/v1/damaged_embryos/create_new_damaged_embryos", newDamagedEmbryos);
        }catch(error){
            console.log(error);
            return;
        }

        noti7.current.showToast();
        setTimeout(() => {
            getAllRequestForReissueByListMU_ID_Status(allDiplomaNameByMU, inputMaPhieuSearch, statusYC.value) 
        }, 100);
        
        //Gửi mail cho all tài khoản có chức vụ tổ trưởng
        let allUserLeader = [];
        allUserAccount?.forEach((user)=>{
            if(user.role[0] == "Leader"){
                allUserLeader = [...allUserLeader, user];
            }
        })

        let loai_phoi = "";
        allDiplomaName?.forEach((diplomaName)=>{
            if(diplomaName.diploma_name_id == resultNewRequestForReissue.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        for(let i=0; i<allUserLeader.length;i++){
            try{
                const mailOptions = {
                    to: allUserLeader[i].email,
                    subject: "Yêu cầu xin cấp lại phôi mới",
                    html:   `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                                <div style='background-color: white;'>
                                    <div>
                                        <img
                                            style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                            src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                        />
                                    </div>
                                    <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                        Yêu cầu xin cấp lại phôi mới vừa được tạo cần được xét duyệt
                                    </h1>
                                    <hr />
                                    <h3 style='text-align: center;'>Chi tiết yêu cầu</h3>
                                    <div style='padding: 0px 25px 10px 25px;'>
                                        <div>Mã phiếu: #${resultNewRequestForReissue.requestForReissue_id}</div>
                                        <div style='margin-top: 10px;'>
                                            Đơn vị yêu cầu: ${managementUnitOfUser}
                                        </div>
                                        <div style='margin-top: 10px;'>
                                            Loại phôi cần cấp: ${loai_phoi}
                                        </div>
                                        <div style='margin-top: 10px;'>Số lượng tái cấp: ${resultNewRequestForReissue.numberOfEmbryos}</div>
                                        <div style='margin-top: 10px;'>Số seri tái cấp: ${handleResultSeri(seri_number_start, seri_number_end)}</div>
                                        <div style='margin-top: 10px;'>Lý do: ${reason}</div>
                                        <div style='margin-top: 10px;'>
                                            Người tạo yêu cầu: ${user.fullname} / ${user.mssv_cb}
                                        </div>
                                        <div style='margin-top: 10px;'>Thời gian tạo: ${handleDateToDMY(resultNewRequestForReissue.time_create)}</div>
                                        <div style='margin-top: 15px;'>
                                        <a href='http://localhost:3000/approve_request_for_reissue'>
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







    //Xử lý logic phần hiển thị danh sách các yêu cầu xin cấp lại phôi
    //State chứa selected của select có id = select-embryos-type
    const [selectedEmbryosType, setSelectedEmbryosType] = useState({value:"", label: "Tất cả loại phôi"});
    const handleChangeEmbryosType = (selectedOption) => {
        setSelectedEmbryosType(selectedOption);
    }
    //State chứa value tìm kiếm theo mã phiếu
    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");
    //State chứa trạng thái tìm kiếm
    const [statusYC, setStatusYC] = useState({value:"", label: "Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) => {
        setStatusYC(selectedOption);
    }
    //State tìm kiếm theo người tạo phiếu
    const [inputCreatorSearch, setInputCreatorSearch] = useState("");
 
    //State để chứa all yc xin cấp lại phôi sau khi lọc theo all đơn vị quản lý của MU, mã phiếu, trạng thái
    const [allRequestForReissue, setAllRequestForReissue] = useState([]);

    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU?.forEach((currentValue) =>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsDiplomaNameCRR(resultOption);
        getAllRequestForReissueByListMU_ID_Status(allDiplomaNameByMU, inputMaPhieuSearch, statusYC.value)
    }, [allDiplomaNameByMU, inputMaPhieuSearch, statusYC.value])

    //Hàm lấy ra các yc xin cấp lại phôi dựa theo danh sách các diploma_name của đơn vị quản lý, mã phiếu và trạng thái. Loại phôi và người tạo sẽ xử lý tại frontend
    const getAllRequestForReissueByListMU_ID_Status = async (allDiplomaNameByMU, inputMaPhieuSearch, statusYC) => {
        try{
            let result = [];
            for(let i = 0; i<allDiplomaNameByMU.length; i++){
                const res = await axios.get(`http://localhost:8000/v1/request_for_reissue/get_all_request_for_reissue_by_list_diploma_name_id/${allDiplomaNameByMU[i].diploma_name_id}?status=${statusYC}&requestForReissue_id=${inputMaPhieuSearch}`);
                result = [...result, ...res.data];
            }
            for(let i = 0; i < result.length; i++){
                for(let j = 0; j < allUserAccount.length; j++){
                    if(result[i].mscb_create == allUserAccount[j].mssv_cb){
                        result[i]['fullname_create'] = allUserAccount[j].fullname;
                    }
                }
            }
            setAllRequestForReissue(result);
        }catch(error){
            console.log(error)
        }
    }

    //State lấy ra all yc xin cấp lại phôi sau khi lọc theo loại phôi dc chọn
    const [allRequestForReissueFilterByDiplomaName, setAllRequestForReissueFilterByDiplomaName] = useState([]);

    useEffect(()=>{
        if(selectedEmbryosType.value != ""){
            let result = [];
            allRequestForReissue?.forEach((currentValue)=>{
                if(currentValue.diploma_name_id == selectedEmbryosType.value){
                    result = [...result, currentValue];
                }
            })
            setAllRequestForReissueFilterByDiplomaName(result);
        }else{
            setAllRequestForReissueFilterByDiplomaName(allRequestForReissue);
        }
    }, [allRequestForReissue, selectedEmbryosType])

    //State lấy ra all yccp sau khi lọc theo tên người tạo
    const [allRequestForReissueFilterFullname, setAllRequestForReissueFilterFullname] = useState([]);

    useEffect(()=>{
        if(inputCreatorSearch != ""){
            let result = [];
            allRequestForReissueFilterByDiplomaName?.forEach((currentValue)=>{
                if(currentValue.fullname_create.toLowerCase().includes(inputCreatorSearch.toLowerCase())){
                    result = [...result, currentValue]
                }
            })
            setAllRequestForReissueFilterFullname(result);
        }else{
            setAllRequestForReissueFilterFullname(allRequestForReissueFilterByDiplomaName)
        }
    }, [allRequestForReissueFilterByDiplomaName, inputCreatorSearch])

    const [page, setPage] = useState(1);
    const [allRequestForReissue_PT, setAllRequestForReissue_PT] = useState([]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && allRequestForReissueFilterFullname!=undefined){
            if(allRequestForReissueFilterFullname.length>5){
                const numberOfPage = Math.ceil(allRequestForReissueFilterFullname?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allRequestForReissueFilterFullname.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allRequestForReissueFilterFullname[i]];
                }
                setAllRequestForReissue_PT(result);
            }else{
                setAllRequestForReissue_PT(allRequestForReissueFilterFullname);
            }         
        }
    }, [page, allRequestForReissueFilterFullname])


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

    //Xử lý phần xem chi tiết phiếu xuất kho
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

    //Xử lý phần xóa yêu cầu xin cấp lại phôi

    //State chứa object của yc xin cấp lại phôi sẽ được xóa
    const [objectDelete, setObjectDelete] = useState({});
    
    //Hàm xóa
    const noti8 = useRef();
    const handleDeleteRequestReissue = async () => {
        try{
            const deleteRequestReissue = await axios.delete(`http://localhost:8000/v1/request_for_reissue/delete_request_reissue/${objectDelete._id}/${objectDelete.requestForReissue_id}`);
            noti8.current.showToast();
            setTimeout(() => {
                getAllRequestForReissueByListMU_ID_Status(allDiplomaNameByMU, inputMaPhieuSearch, statusYC.value);
            }, 200);
        }catch(error){
            console.log(error);
            return;
        }
    }
    
    
    return(
        <>
            <Header/>
            <div className="container" id='body-create-request-reissue'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className='card pb-3'>
                        <div className="row p-3">
                            <button
                                className='btn'
                                style={{width: '170px', backgroundColor: '#00abeb', marginLeft: '30px'}}
                                onClick={(e)=>{
                                    setShowFormCreateRequest(!showFormCreateRequest);
                                }}
                            >Tạo mới yêu cầu</button>
                        </div>

                        {/* Form tạo yêu cầu cấp lại phôi */}
                        {
                            showFormCreateRequest ? (
                                <>
                                    <div className="row mt-2 p-3">
                                        <div className="col-8">
                                            <div className='card p-3'>
                                                <div className="row">
                                                    <div className="col-3">Tên đơn vị quản lý</div>
                                                    <div className="col-9">{managementUnitOfUser}</div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-3">Chọn loại phôi</div>
                                                    <div className="col-9">
                                                        <Select
                                                            id='select-diplomaName-CRR'
                                                            placeholder="Chọn loại phôi"
                                                            options={optionsDiplomaNameCRR}
                                                            value={selectDiplomaNameCRR}
                                                            onChange={handleChangeDiplomaNameCRR}
                                                        />
                                                    </div> 
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-3">Nhập số lượng</div>
                                                    <div className="col-9">
                                                        <input 
                                                            type="number" 
                                                            value={numberOfEmbryos}
                                                            onChange={(e)=>{
                                                                setNumberOfEmbryos(e.target.value)
                                                            }}
                                                            className='form-control'
                                                        />
                                                    </div> 
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-3">Nhập số seri của phôi không còn sử dụng</div>
                                                    <div className="col-3">
                                                        <input 
                                                            type="number" 
                                                            className='form-control'
                                                            placeholder='Nhập số seri bắt đầu'
                                                            value={inputSeriStart}
                                                            onChange={(e)=>{
                                                                setInputSeriStart(e.target.value)
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
                                                            placeholder='Nhập số seri kết thúc'
                                                            value={inputSeriEnd}
                                                            onChange={(e)=>{
                                                                setInputSeriEnd(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-1">
                                                        <i 
                                                            className="fa-solid fa-check"
                                                            style={{backgroundColor: "#3184fa", padding: '10px 7px 7px 7px', borderRadius: '5px', color: 'white', width: '37px', height: '37px', textAlign: 'center'}}
                                                            onClick={(e)=>{
                                                                handleAddSeriToArray();
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
                                                                setLowestSerialNumber(1);
                                                            }}
                                                        ></i>
                                                    </div>
                                                </div>
                                                
                                                    {
                                                        seri_number_start?.map((seri, index) => {
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
                                                <div className="row mt-3">
                                                    <div className="col-3">Lý do</div>
                                                    <div className="col-9">
                                                        <div className="form-floating">
                                                            <textarea 
                                                                className="form-control" 
                                                                value={reason}
                                                                onChange={(e)=>{
                                                                    setReason(e.target.value)
                                                                }}
                                                                placeholder="Leave a comment here" 
                                                                id="textareaReasonReissue" style={{height: "100px"}}></textarea>
                                                            <label htmlFor="textareaReasonReissue">Nhập lý do</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <button 
                                                        style={{marginLeft: '648px',width: '150px', backgroundColor: '#1b95a2'}}
                                                        className='btn'
                                                        onClick={(e)=>{
                                                            handleCreateRequestForReissue()
                                                        }}
                                                    >Tạo yêu cầu</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : ("")
                        }
                        <hr />
                        <div className="row p-3 mt-1">
                            <div className="col-md-3">
                                <Select
                                    id='select-embryos-type'
                                    options={[{value:"", label: "Tất cả loại phôi"}, ...optionsDiplomaNameCRR]}
                                    value={selectedEmbryosType}
                                    onChange={handleChangeEmbryosType}
                                />
                            </div>
                            <div className="col-md-3">
                                <input 
                                    type="text" 
                                    value={inputMaPhieuSearch}
                                    onChange={(e)=>{
                                        setInputMaPhieuSearch(e.target.value)
                                    }}
                                    className='form-control'
                                    placeholder='Tìm kiếm theo mã phiếu'
                                  
                                />
                            </div>
                            <div className="col-md-3">
                                <Select
                                    options={[
                                        {value:"", label: "Tất cả trạng thái"},
                                        {value:"Đã gửi yêu cầu", label: "Đã gửi yêu cầu"},
                                        {value:"Không duyệt", label: "Không duyệt"},
                                        {value:"Đã duyệt yêu cầu", label: "Đã duyệt yêu cầu"},
                                        {value:"Đã gửi thủ kho", label: "Đã gửi thủ kho"},
                                        {value:"Đã in phôi", label: "Đã in phôi"},
                                        {value:"Đã dán tem", label: "Đã dán tem"},
                                        {value:"Đã nhận phôi", label: "Đã nhận phôi"}
                                    ]}
                                    value={statusYC}
                                    onChange={handleChangeStatusYC}
                                />
                            </div>
                            <div className="col-md-3">
                                <input 
                                    type="text" 
                                    placeholder='Tìm kiếm theo người tạo phiếu'
                                    className='form-control'
                                    value={inputCreatorSearch}
                                    onChange={(e)=>{
                                        setInputCreatorSearch(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className='title-list-yc-xin-cap-phoi'>
                            DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI
                        </div>
                        <div className="row p-5">
                            <div id="contain-table-show-all-request-reissue">
                                <table id='table-show-all-request-reissue' className='table table-striped table-hover table-bordered'>
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
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem phiếu xuất kho</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allRequestForReissue_PT?.map((currentValue, index)=>{
                                                let ten_loai_phoi;
                                                allDiplomaName?.forEach((diplomaName)=>{
                                                    if(currentValue.diploma_name_id == diplomaName.diploma_name_id){
                                                        ten_loai_phoi = diplomaName.diploma_name_name
                                                    }
                                                })
                                                return(
                                                    <tr style={{textAlign: 'center'}} key={index}>
                                                        <td>#{currentValue.requestForReissue_id}</td>
                                                        <td>{ten_loai_phoi}</td>
                                                        <td>{currentValue.numberOfEmbryos}</td>
                                                        <td style={{color: 'red', fontWeight: 'bold'}}>
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
                                                                //Nút xem phiếu xuất kho
                                                                closeButtonDeliveryBill == index  ? (
                                                                    <i 
                                                                        style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                        className="fa-regular fa-circle-xmark"
                                                                        onClick={(e)=>{
                                                                            setCloseButtonDeliveryBill(null);
                                                                            setShowDeliveryBill(false);
                                                                        }}
                                                                    ></i>
                                                                ) : currentValue.status == "Đã in phôi" || currentValue.status == "Đã dán tem" || currentValue.status == "Đã nhận phôi" ? (
                                                                    <i
                                                                        className="fa-solid fa-info"
                                                                        style={{ backgroundColor: "#FF6A6A", width: '32px', padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        onClick={(e)=>{
                                                                            getDetailDeliveryBill(currentValue.requestForReissue_id);
                                                                            setCloseButtonDeliveryBill(index);
                                                                            setShowDeliveryBill(true)
                                                                            scrollToDeliveryBill();
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i
                                                                        className="fa-solid fa-info"
                                                                        style={{ backgroundColor: "grey", width: '32px', padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    ></i>
                                                                )
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                //nút xóa yêu cầu
                                                                currentValue.status == "Đã gửi yêu cầu" ? (
                                                                    <i 
                                                                        className="fa-solid fa-eraser"
                                                                        style={{ backgroundColor: "red", width: '32px', padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        data-bs-toggle="modal" data-bs-target="#deleteRequestReissue"
                                                                        onClick={(e)=>{
                                                                            setObjectDelete(currentValue);
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i 
                                                                        className="fa-solid fa-eraser"
                                                                        style={{ backgroundColor: "grey", width: '32px', padding: '7px', borderRadius: '5px', color: 'white'}}
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
                            </div>

                            {/* Modal xóa yc xin cấp lại phôi */}
                            <div className="modal fade" id="deleteRequestReissue" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="deleteRequestReissueLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                    <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                        <h1 className="modal-title fs-5" id="deleteRequestReissueLabel">Xóa yêu cầu xin cấp lại phôi</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <h5>Bạn có chắc muốn xóa yêu cầu xin cấp lại phôi này không?</h5>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button 
                                            type="button" 
                                            className="btn"
                                            style={{backgroundColor: '#1b95a2'}}
                                            onClick={(e)=>{
                                                handleDeleteRequestReissue()
                                            }}
                                        >Xóa</button>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <Stack spacing={2}>
                                    <Pagination 
                                        count={Math.ceil(allRequestForReissueFilterFullname?.length/5)}
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
                                detailDeliveryBill?.map((currentValue, index)=>{
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
                message="Vui lòng nhập đầy đủ số seri"
                type="warning"
                ref={noti}
            />
            <Toast
                message={`Vui lòng nhập số seri bắt đầu lớn hơn hoặc bằng ${lowestSerialNumber}`}
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Vui lòng nhập số seri kết thúc lớn hơn hoặc bằng số seri bắt đầu"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Vui lòng chọn loại phôi"
                type="warning"
                ref={noti4}
            />
            <Toast
                message="Vui lòng nhập số lượng phôi tái cấp"
                type="warning"
                ref={noti5}
            />
            <Toast
                message="Vui lòng nhập lý do"
                type="warning"
                ref={noti6}
            />
            <Toast
                message="Tạo yêu cầu xin cấp lại phôi thành công"
                type="success"
                ref={noti7}
            />
            <Toast
                message="Xóa yêu cầu thành công"
                type="success"
                ref={noti8}
            />
        </>
    )
    
}
//Trang Các yêu cầu xin cấp phôi đã được thủ kho xử lý của thư ký
import './RequestForIssuanceOfEmbryosProcessed.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import {Link} from 'react-router-dom'
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName, getAllDiplomaType } from '../../redux/apiRequest';
import DetailRequest from '../DetailRequest/DetailRequest';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Toast from '../Toast/Toast';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
import { Tooltip } from 'react-tippy';
export default function RequestForIssuanceOfEmbryosProcessed(){
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType); //state lấy ra all diploma type

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //State để lấy all major trong DB ra
    const [allMajorInDB, setAllMajorInDB] = useState([]);

    //Hàm lấy ra all majors
    const getAllMajorsShowModal = async () =>{
        try{
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorInDB(result.data); 
        }catch(error){
            console.log(error);
        }
    }

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
        getAllRequestForIssuanceOfEmbryos();
        getAllDiplomaName(dispatch);
        getAllUserAccount();
        getAllDiplomaType(dispatch);
        getAllMajorsShowModal();
    }, [])
    
    //State chứa dữ liệu cho options và selected của select có id = select-MU-RFIOEP
    const [optionsOfSelectMU, setOptionsOfSelectMU] = useState([]) 
    const [selectedOfSelectMU, setSelectedOfSelectMU] = useState({value: "", label: "Tất cả đơn vị quản lý"});
    const handleChangeMU = (selectedOption) =>{
        setSelectedOfSelectMU(selectedOption)
    }

    useEffect(()=>{
        let resultOption = [{value: "", label: "Tất cả đơn vị quản lý"}];
        allManagementUnit?.forEach((currentValue)=>{
            const newOption = {value: currentValue.management_unit_id, label: currentValue.management_unit_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfSelectMU(resultOption);
    }, [allManagementUnit])
    
    //State chứa dữ liệu cho options và selected của select có id = select-diploma-name-RFIOEP
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    const [optionsOfSelectDiplomaName, setOptionsOfSelectDiplomaName] = useState([])
    const [selectedOfSelectDiplomaName, setSelectedOfSelectDiplomaName] = useState({value:'', label: "Tất cả tên văn bằng"});
    const handleChangeselectedOfSelectDiplomaName = (selectedOption) => {
        setSelectedOfSelectDiplomaName(selectedOption);
    } 

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý được chọn tại select có id = select-MU-MRFEIFS
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

    useEffect(()=>{
        getAllDiplomaNameByMU(selectedOfSelectMU.value);
    }, [selectedOfSelectMU])

    useEffect(()=>{
        let resultOption = [{value: "", label: "Tất cả tên văn bằng"}];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name}
            resultOption = [...resultOption, newOption]
        })
        setOptionsOfSelectDiplomaName(resultOption);
    }, [allDiplomaNameByMU])

    //State chứa value để tìm kiếm theo mã số phiếu
    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");

    //State chứa selected trạng thái của yêu cầu cần tìm
    const [statusYC, setStatusYC] = useState({value:"", label: "Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) => {
        setStatusYC(selectedOption);
    }

    //State chứa all yêu cầu cấp phôi với trạng thái là đã gửi thủ kho và đã in phôi
    const [allYCCP, setAllYCCP] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc MU và diploma_name
    const [allYCCP_After_filter, setAllYCCP_After_filter] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc trạng thái
    const [allYCCP_After_filter2, setAllYCCP_After_filter2] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc theo mã phiếu
    const [allYCCP_After_filter3, setAllYCCP_After_filter3] = useState([]);
    //State chứa all yc cấp phôi phân trang
    const [allYCCP_Panigate, setAllYCCP_Panigate] = useState([]);

    //Hàm call api lấy ra all yêu cầu cấp phôi
    const getAllRequestForIssuanceOfEmbryos = async () => {
        try{
            let finalResult = [];
            const result = await axios.get("http://localhost:8000/v1/embryo_issuance_request/get_all_yccp");
            result.data.forEach((currentValue)=>{
                if(currentValue.status == "Đã in phôi" || currentValue.status == "Đã nhận phôi" || currentValue.status == "Đã dán tem"){
                    finalResult = [...finalResult, currentValue];
                }
            })
            setAllYCCP(finalResult);
            setAllYCCP_After_filter(finalResult);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        let result = [];
        if(selectedOfSelectMU.value!=""){
            allYCCP?.forEach((currentValue)=>{
                if(currentValue.management_unit_id == selectedOfSelectMU.value){
                    result = [...result, currentValue];
                }
            })

            if(selectedOfSelectDiplomaName.value!=""){
                let result2 = [];
                result?.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == selectedOfSelectDiplomaName.value){
                        result2 = [...result2, currentValue];                        
                    }
                })
                setAllYCCP_After_filter(result2);                
            }else{
                setAllYCCP_After_filter(result);   
            }
        }else{  
            setAllYCCP_After_filter(allYCCP);
        }
    }, [selectedOfSelectMU, selectedOfSelectDiplomaName, allYCCP])

    useEffect(()=>{
        if(statusYC.value!=""){
            let result = [];
            allYCCP_After_filter?.forEach((currentValue)=>{
                if(currentValue.status == statusYC.value){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter2(result);
        }else{
            setAllYCCP_After_filter2(allYCCP_After_filter);
        }

    }, [allYCCP_After_filter, statusYC])

    useEffect(()=>{
        if(inputMaPhieuSearch!=""){
            let result = [];
            allYCCP_After_filter2?.forEach((currentValue)=>{
                if(currentValue.embryoIssuanceRequest_id == inputMaPhieuSearch){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter3(result);
        }else{
            setAllYCCP_After_filter3(allYCCP_After_filter2);
        }
    }, [allYCCP_After_filter2, inputMaPhieuSearch])

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && allYCCP_After_filter3!=undefined){
            if(allYCCP_After_filter3.length>5){
                const numberOfPage = Math.ceil(allYCCP_After_filter3?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allYCCP_After_filter3.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allYCCP_After_filter3[i]];
                }
                setAllYCCP_Panigate(result);
            }else{
                setAllYCCP_Panigate(allYCCP_After_filter3);
            }         
        }
    }, [page, allYCCP_After_filter3])

    function handleDateToDMY(date){
        const splitDate = date.split("-");
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

    const [closeButton, setCloseButton] = useState(null);
    const [showDetailRequest, setShowDetailRequest] = useState(false);

    //State để lấy dữ liệu chi tiết yêu cầu và điền vào mẫu xin cấp phôi
    const [embryoIssuanceRequest_id, setEmbryoIssuanceRequest_id] = useState("");
    const [managementUnitPhieuYC, setManagementUnitPhieuYC] = useState("");
    const [diplomaNameInPhieuYC, setDiplomaNameInPhieuYC] = useState("");
    const [examinationsInPhieuYC, setExaminationsInPhieuYC] = useState("");
    const [numberOfEmbryosInPhieuYC, setNumberOfEmbryosInPhieuYC] = useState();
    const [seriStartInPhieuYC, setSeriStartInPhieuYC] = useState("");
    const [seriEndInPhieuYC, setSeriEndInPhieuYC] = useState("");
    const [diplomaType, setDiplomaType] = useState("");

    //state để lấy ra trường options của diplomaName được chọn trong chi tiết yêu cầu cấp phôi
    const [optionsOfDiplomaName, setOptionsOfDiplomaName] = useState([]);
    
    //state chứa danh sách học viên kèm theo dựa trên yêu cầu cấp phôi
    const [allDSHVByEIR, setAllDSHVByEIR] = useState([]);

    //Lấy danh sách tất cả học viên kèm theo dựa trên yêu cầu cấp phôi
    //Hàm call api lấy danh sách học viên kèm theo
    const getAllDSHVByEIR = async (embryoIssuanceRequest_id, optionsOfDiplomaName) => {
        const ascending = optionsOfDiplomaName?.slice().sort((a, b) => a - b);
        let dshv = [];
        try{
            const res = await axios.get(`http://localhost:8000/v1/DSHV/get_DSHV/${embryoIssuanceRequest_id}`);
            dshv = [...dshv, ...res.data];
        }catch(error){
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
        for(let i = 0; i<dshv.length; i++){
            const newData = {
                STT: i+1,
                fullname: dshv[i].fullname,
                sex: dshv[i].sex,
                dateOfBirth:handleDateToMDY(dshv[i].dateOfBirth),
                address:dshv[i].address,
                CCCD:dshv[i].CCCD,
            }
            
            if(ascending.includes(1)){
                newData[options2[0]] = dshv[i].diem_tn;
            }
            if(ascending.includes(2)){
                newData[options2[1]] = dshv[i].diem_th;
            }
            if(ascending.includes(3)){
                newData[options2[2]] = dshv[i].nghe;
            }
            if(ascending.includes(4)){
                newData[options2[3]] = dshv[i].noi;
            }
            if(ascending.includes(5)){
                newData[options2[4]] = dshv[i].doc;
            }
            if(ascending.includes(6)){
                newData[options2[5]] = dshv[i].viet;
            }
            if(ascending.includes(7)){
                newData[options2[6]] = handleDateToMDY(dshv[i].test_day);
            }
            if(ascending.includes(8)){
                newData[options2[7]] = dshv[i].graduationYear;
            }
            if(ascending.includes(9)){
                newData[options2[8]] = dshv[i].classification;
            }
            if(ascending.includes(10)){
                allMajorInDB?.forEach((major)=>{
                    if(major.majors_id == dshv[i].nganh_dao_tao){
                        newData[options2[9]] = major.majors_name;
                    }
                })
                
            }
            if(ascending.includes(11)){
                newData[options2[10]] = dshv[i].council;
            }
            data = [...data, newData];
        }
        setAllDSHVByEIR(data);
    }

    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
        return result;
    }

    function scrollToDetailRequest(){
        setTimeout(()=>{
            document.body.scrollTop = 1100;
            document.documentElement.scrollTop = 1100;
        },200)
    }

    //State và logic xử lý việc hiển thị chi tiết phiếu xuất kho
    const [showDeliveryBill, setShowDeliveryBill] = useState(false);
    const [detailDeliveryBill, setDetailDeliveryBill] = useState([]);

    //Hàm call api lấy chi tiết phiếu xuất kho
    const getDetailDeliveryBill = async (embryoIssuanceRequest_id) => {
        try{
            const result = await axios.get(`http://localhost:8000/v1/delivery_bill/get_detail_delivery_bill/${embryoIssuanceRequest_id}`);
            setDetailDeliveryBill(result.data);
        }catch(error){
            console.log(error);
        }
    }

    function scrollToDeliveryBill(){
        if(showDetailRequest == false){
            setTimeout(()=>{
                document.body.scrollTop = 1100;
                document.documentElement.scrollTop = 1100;
            },200)
        }else{
            setTimeout(()=>{
                document.body.scrollTop = 2850;
                document.documentElement.scrollTop = 2850;
            },200)
        }
    }

    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);

    //Xử lý logic cập nhật trạng thái của các yêu cầu xin cấp phôi có trạng thái là "Đã in phôi" thành "Đã dán tem"
    const [_idYCCP_need_update, set_idYCCP_need_update] = useState("");
    const noti = useRef();
    
    const handleUpdateStatusRequest = async () => {
        //Cập nhật trạng thái thành "Đã dán tem"
        try{
            const updateDoc = {
                status: "Đã dán tem"
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_need_update._id}`,updateDoc);
        }catch(error){
            console.log(error);
            return;
        }
        
        noti.current.showToast();
        setTimeout(async()=>{
            await getAllRequestForIssuanceOfEmbryos();
        }, 100)

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        let ten_cb_tao_phieu_xk = '';
        allUserAccount?.forEach((user) => {
            if(user.mssv_cb == _idYCCP_need_update.mscb){
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
            if(management_unit.management_unit_id == _idYCCP_need_update.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
            if(management_unit.management_unit_id == detailDeliveryBill[0].address_department){
                receiving_address = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaName?.forEach((diplomaName)=>{
            if(_idYCCP_need_update.diploma_name_id == diplomaName.diploma_name_id){
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

        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu.
        try{
            const mailOptions = {
                to: email_cb_tao_yc,
                subject: "Đã dán tem cho phôi, phôi đang được gửi về",
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
                            Đã dán tem cho phôi, phôi đang được gửi về
                        </h1>
                        <hr />
                        <h3 style="text-align: center;">Chi tiết yêu cầu</h3>
                        <div style="padding: 0px 25px 10px 25px;">
                            <div>Mã phiếu: #${_idYCCP_need_update.embryoIssuanceRequest_id}</div>
                            <div style="margin-top: 10px;">
                            Đơn vị yêu cầu: ${don_vi_yc}
                            </div>
                            <div style="margin-top: 10px;">
                            Loại phôi cần cấp: ${loai_phoi}
                            </div>
                            <div style="margin-top: 10px;">
                            Đợt thi/đợt cấp bằng: ${handleDateToDMY(_idYCCP_need_update.examination)}
                            </div>
                            <div style="margin-top: 10px;">
                            Số lượng phôi cần cấp: ${_idYCCP_need_update.numberOfEmbryos}
                            </div>
                            <div style="margin-top: 10px;">
                            Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_idYCCP_need_update.mscb}
                            </div>
                            <div style="margin-top: 10px;">
                            Thời gian tạo: ${handleDateToDMY(_idYCCP_need_update.time)}
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
                            Thành tiền: ${detailDeliveryBill[0].unit_price*detailDeliveryBill[0].numberOfEmbryos}
                            </div>
                            <div style="margin-top: 10px;">
                            Người tạo phiếu xuất kho: ${ten_cb_tao_phieu_xk} / ${detailDeliveryBill[0].mscb}
                            </div>
                            <div style="margin-top: 15px;">
                            <a
                                href="http://localhost:3000/manage_requests_for_diploma_drafts"
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
        }catch(error){
            console.log(error);
            return;
        }
    }
    return(
        <>  
            <Header/>
            <div className="container" id='body-RFIOEP'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/manage_requests_for_embryo_issuance_for_secretary'>
                                        <li className="list-group-item">Các yêu cầu xin cấp phôi đã được duyệt</li>
                                    </Link>
                                    <li style={{backgroundColor: '#1b95a2', color: 'white'}} className="list-group-item">Các yêu cầu xin cấp phôi đã được thủ kho xử lý</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div className="row">
                                    <div className="col-6">
                                        <Select
                                            id='select-MU-RFIOEP'
                                            value={selectedOfSelectMU}
                                            onChange={handleChangeMU}
                                            options={optionsOfSelectMU}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <Select
                                            id='select-diploma-name-RFIOEP'
                                            value={selectedOfSelectDiplomaName}
                                            onChange={handleChangeselectedOfSelectDiplomaName}
                                            options={optionsOfSelectDiplomaName}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-6">
                                        <input 
                                            type="text" 
                                            className='form-control'
                                            placeholder='Tìm kiếm theo mã số phiếu'
                                            value={inputMaPhieuSearch}
                                            onChange={(e)=>{
                                                setInputMaPhieuSearch(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <Select
                                            options={[
                                                {value:"Đã in phôi", label: "Đã in phôi"},
                                                {value:"Đã dán tem", label: "Đã dán tem"},
                                                {value:"Đã nhận phôi", label: "Đã nhận phôi"}
                                            ]}
                                            value={statusYC}
                                            onChange={handleChangeStatusYC}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <p className='title-list-yc-xin-cap-phoi'>DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI ĐÃ ĐƯỢC IN PHÔI</p>
                                </div>
                                <div className="row mt-3 p-3">
                                    <div id="contain-yccp-da-in">
                                        <table className='table table-striped table-hover table-bordered' style={{width: '1800px', textAlign: 'center', border: '2px solid #fed25c'}}>
                                            <thead>
                                                <tr>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Tên văn bằng</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Số lượng phôi</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Cán bộ tạo yêu cầu</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">Xem phiếu xuất kho</th>
                                                    <th style={{backgroundColor: '#fed25c'}} scope="col">
                                                        Cập nhật trạng thái
                                                        <br />
                                                        (Đã dán tem cho phôi)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allYCCP_Panigate?.map((currentValue, index)=>{
                                                        //Lấy ra tên văn bằng, loại văn bằng, options
                                                        let ten_van_bang;
                                                        let loai_van_bang;
                                                        let options;
                                                        allDiplomaName?.forEach((diplomaName)=>{
                                                            if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                                ten_van_bang = diplomaName.diploma_name_name;
                                                                allDiplomaType?.forEach((diplomaType)=>{
                                                                    if(diplomaType.diploma_type_id == diplomaName.diploma_type_id){
                                                                        loai_van_bang = diplomaType.diploma_type_name;
                                                                    }
                                                                })
                                                                options = diplomaName.options;
                                                            }
                                                        })

                                                        //Lấy tên cán bộ
                                                        let ten_can_bo_tao_yc;
                                                        allUserAccount?.forEach((user)=>{
                                                            if(user.mssv_cb == currentValue.mscb){
                                                                ten_can_bo_tao_yc = user.fullname;
                                                            }
                                                        })
                                                        //Lấy ra tên đơn vị quản lý
                                                        let don_vi_quan_ly;
                                                        allManagementUnit?.forEach((management_unit)=>{
                                                            if(currentValue.management_unit_id == management_unit.management_unit_id){
                                                                don_vi_quan_ly = management_unit.management_unit_name;
                                                            }
                                                        })
                                                        return(
                                                            <tr key={index}>
                                                                <td>{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                                <td>{ten_van_bang}</td>
                                                                <td>{handleDateToDMY(currentValue.examination)}</td>
                                                                <td>{currentValue.numberOfEmbryos}</td>
                                                                <td>{ten_can_bo_tao_yc}</td>
                                                                <td>{currentValue.mscb}</td>
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
                                                                <td>
                                                                {
                                                                    closeButton == index ? (
                                                                        <i 
                                                                            style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                            className="fa-regular fa-circle-xmark"
                                                                            onClick={(e)=>{
                                                                                setCloseButton(null)
                                                                                setShowDetailRequest(false)
                                                                            }}
                                                                        ></i>
                                                                    ) : (
                                                                        //nút xem chi tiết yêu cầu xin cấp phôi
                                                                        <i 
                                                                            className="fa-solid fa-eye"
                                                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}                                                             
                                                                            onClick={(e)=>{
                                                                                setCloseButton(index);
                                                                                setShowDetailRequest(true)
                                                                                
                                                                                setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                                setManagementUnitPhieuYC(don_vi_quan_ly);
                                                                                setDiplomaNameInPhieuYC(ten_van_bang);
                                                                                setExaminationsInPhieuYC(currentValue.examination)
                                                                                setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos)
                                                                                setSeriStartInPhieuYC(currentValue.seri_number_start);
                                                                                setSeriEndInPhieuYC(currentValue.seri_number_end);
                                                                                setDiplomaType(loai_van_bang);
                                                                                setOptionsOfDiplomaName(options);
                                                                                getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options)     
                                                                                scrollToDetailRequest();                                               
                                                                            }}
                                                                        ></i>
                                                                    )
                                                                }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        closeButtonDeliveryBill == index ? (
                                                                            <i 
                                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                                className="fa-regular fa-circle-xmark"
                                                                                onClick={(e)=>{
                                                                                    setShowDeliveryBill(false);
                                                                                    setCloseButtonDeliveryBill(null);
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            // nút xem chi tiết phiếu xuất kho 
                                                                            <i 
                                                                                className="fa-solid fa-circle-info"
                                                                                style={{backgroundColor: "#0dcaf0", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                                onClick={(e)=>{
                                                                                    getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
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
                                                                        currentValue.status == "Đã in phôi" ? (
                                                                            //nút cập nhật trạng thái thành "Đã dán tem"
                                                                            <i 
                                                                                className="fa-solid fa-pen-to-square"
                                                                                style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                                data-bs-toggle="modal" data-bs-target="#updateStatusstampedModal"   
                                                                                onClick={(e)=>{
                                                                                    set_idYCCP_need_update(currentValue);
                                                                                    getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
                                                                                }}                                                                                                                             
                                                                            ></i>
                                                                        ) : (
                                                                            <i 
                                                                                className="fa-solid fa-pen-to-square"
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
                                    </div>
                                    {/* Modal cập nhật trạng thái của yêu cầu thành Đã dán tem */}
                                    <div className="modal fade" id="updateStatusstampedModal" tabIndex="-1" aria-labelledby="updateStatusstampedModalLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                            <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                                <h1 className="modal-title fs-5" id="updateStatusstampedModalLabel"></h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <h5>Bạn có chắc muốn cập nhật trạng thái của yêu cầu cấp phôi này thành <span style={{fontWeight: 'bold'}}>"Đã dán tem"</span></h5>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-primary"
                                                    style={{backgroundColor: '#1b95a2'}}
                                                    onClick={(e)=>{
                                                        handleUpdateStatusRequest()
                                                    }}
                                                >Cập nhật</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center mt-3">
                                        <Stack spacing={2}>
                                            <Pagination 
                                                count={Math.ceil(allYCCP_After_filter3?.length/5)}
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
                    <div className="mt-4">
                        {
                            showDetailRequest ? (
                                <DetailRequest 
                                    embryoIssuanceRequest_id={embryoIssuanceRequest_id}
                                    managementUnitPhieuYC={managementUnitPhieuYC}
                                    diplomaNameInPhieuYC={diplomaNameInPhieuYC}
                                    examinationsInPhieuYC={examinationsInPhieuYC}
                                    numberOfEmbryosInPhieuYC={numberOfEmbryosInPhieuYC}
                                    seriStartInPhieuYC={seriStartInPhieuYC}
                                    seriEndInPhieuYC={seriEndInPhieuYC}
                                    diplomaType={diplomaType}
                                    optionsOfDiplomaName={optionsOfDiplomaName}
                                    allDSHVByEIR={allDSHVByEIR}
                                ></DetailRequest>
                            ) : ("")
                        }
                        {
                            showDeliveryBill ? (
                                //Lưu ý mỗi yêu cầu xin cấp phôi chỉ có duy nhất 1 delivery bill trong DB
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
            <Toast
                message="Cập nhật trạng thái yêu cầu xin cấp phôi thành công"
                type="success"
                ref={noti}
            />
            <Footer/>
        </>
    )
}
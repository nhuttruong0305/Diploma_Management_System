//Quản lý yêu cầu cấp phôi cho thư ký
import Toast from '../Toast/Toast';
import './ManageRequestsForEmbryoIssuanceForSecretary.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect,useState, useRef } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getAllDiplomaName, getAllDiplomaType} from '../../redux/apiRequest';
import DetailRequest from '../DetailRequest/DetailRequest';
import { Tooltip } from 'react-tippy';
export default function ManageRequestsForEmbryoIssuanceForSecretary(){
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    
    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //State để lấy all major trong DB ra
    const [allMajorInDB, setAllMajorInDB] = useState([]);

    //State để lưu options của select có id = select-MU-MRFEIFS
    const [optionsOfSelectMU_MRFEIFS, setOptionsOfSelectMU_MRFEIFS] = useState([]);
    const [selectedSelectMU_MRFEIFS, setSelectedSelectMU_MRFEIFS] = useState({value: "", label: "Tất cả đơn vị quản lý"})
    const handleChangeselectedSelectMU_MRFEIFS = (selectedOption) => {
        setSelectedSelectMU_MRFEIFS(selectedOption)
    }

    //Hàm lấy ra all majors
    const getAllMajorsShowModal = async () =>{
        try{
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorInDB(result.data); 
        }catch(error){
            console.log(error);
        }
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

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
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

    useEffect(()=>{
        let resultOption = [{value: "", label: "Tất cả đơn vị quản lý"}];
        allManagementUnit?.forEach((currentValue)=>{
            const newOption = {value: currentValue.management_unit_id, label: currentValue.management_unit_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfSelectMU_MRFEIFS(resultOption);
    }, [allManagementUnit])
    
    //State lưu các tên văn bằng theo đơn vị quản lý được chọn tại select có id = select-MU-MRFEIFS
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    const [optionsOfselectDiplomaNameMRFEIFS, setOptionsOfselectDiplomaNameMRFEIFS] = useState([]);
    const [selectedSelectDiplomaNameMRFEIFS, setSelectedSelectDiplomaNameMRFEIFS] = useState({value:'', label: "Tất cả tên văn bằng"});
    const handleChangeSelectDiplomaNameMRFEIFS = (selectedOption) => {
        setSelectedSelectDiplomaNameMRFEIFS(selectedOption)
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
        getAllDiplomaNameByMU(selectedSelectMU_MRFEIFS.value);
    }, [selectedSelectMU_MRFEIFS])    
    
    useEffect(()=>{
        let resultOption = [{value: "", label: "Tất cả tên văn bằng"}];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name}
            resultOption = [...resultOption, newOption]
        })
        setOptionsOfselectDiplomaNameMRFEIFS(resultOption)
    }, [allDiplomaNameByMU])
    
    //state để chứa value của input tìm yêu cầu cấp phôi theo mã phiếu
    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");
    
    //State để chứa value của trạng thái yêu cầu muốn lọc ra
    const [statusYC, setStatusYC] = useState({value:"", label: "Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) => {
        setStatusYC(selectedOption);
    }

    //State chứa all yc cấp phôi trong db
    const [allYCCP, setAllYCCP] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc MU và diploma_name
    const [allYCCP_After_filter, setAllYCCP_After_filter] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc status
    const [allYCCP_After_filter3, setAllYCCP_After_filter3] = useState([]);
    //State chứa các yc cấp phôi sau khi lọc mã phiếu
    const [allYCCP_After_filter2, setAllYCCP_After_filter2] = useState([]);
    //State chứa all yc cấp phôi phân trang
    const [allYCCP_Panigate, setAllYCCP_Panigate] = useState([]);
    
    //Hàm call api lấy ra all yêu cầu cấp phôi
    const getAllRequestForIssuanceOfEmbryos = async () => {
        try{
            let finalResult = [];
            const result = await axios.get("http://localhost:8000/v1/embryo_issuance_request/get_all_yccp");
            result.data.forEach((currentValue)=>{
                if(currentValue.status == "Đã duyệt yêu cầu" || currentValue.status == "Đã gửi thủ kho"){
                    finalResult = [...finalResult, currentValue];
                }
            })
            setAllYCCP(finalResult);
            setAllYCCP_After_filter(finalResult);
        }catch(error){
            console.log(error);
        }
    }
    
    //Xử lý việc lọc ra các yêu cầu cấp phôi theo các điều kiện là đơn vị quản lý và tên văn bằng
    useEffect(()=>{
        let result = [];
        if(selectedSelectMU_MRFEIFS.value!=""){
            allYCCP?.forEach((currentValue)=>{
                if(currentValue.management_unit_id == selectedSelectMU_MRFEIFS.value){
                    result = [...result, currentValue];
                }
            })

            if(selectedSelectDiplomaNameMRFEIFS.value!=""){
                let result2 = [];
                result?.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == selectedSelectDiplomaNameMRFEIFS.value){
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
    }, [selectedSelectMU_MRFEIFS, selectedSelectDiplomaNameMRFEIFS, inputMaPhieuSearch])
    
    //Lọc các yc cấp phôi theo trạng thái yêu cầu
    useEffect(()=>{
        if(statusYC.value!=""){
            let result = [];
            allYCCP_After_filter?.forEach((currentValue)=>{
                if(currentValue.status == statusYC.value){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter3(result);
        }else{
            setAllYCCP_After_filter3(allYCCP_After_filter);
        }
    }, [allYCCP_After_filter, statusYC])

    //Lọc ra các yc cấp phôi qua mã phiếu
    useEffect(()=>{
        if(inputMaPhieuSearch!=""){
            let result = [];
            allYCCP_After_filter3?.forEach((currentValue)=>{
                if(currentValue.embryoIssuanceRequest_id == inputMaPhieuSearch){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter2(result);
        }else{
            setAllYCCP_After_filter2(allYCCP_After_filter3);
        }
    }, [allYCCP_After_filter3, inputMaPhieuSearch])
    
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && allYCCP_After_filter2!=undefined){
            if(allYCCP_After_filter2.length>5){
                const numberOfPage = Math.ceil(allYCCP_After_filter2?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allYCCP_After_filter2.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allYCCP_After_filter2[i]];
                }
                setAllYCCP_Panigate(result);
            }else{
                setAllYCCP_Panigate(allYCCP_After_filter2);
            }         
        }
    }, [page, allYCCP_After_filter2])
    
    function handleDateToDMY(date){
        const splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }
    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
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

    //State để tạo nút đóng
    const [closeButton, setCloseButton] = useState(null);

    //State để show chi tiết yêu cầu
    const [showDetailRequest, setShowDetailRequest] = useState(false);

    //Các state cho chi tiết yêu cầu cấp phôi
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

    //Xử lý logic cho việc thay đổi trạng thái của yêu cầu thành "Đã gửi thủ kho"   
    //State chứa object của yêu cầu cấp phôi sẽ được cập nhật trạng thái
    const [_idYCCP_approved, set_idYCCP_approved] = useState("");

    const noti = useRef();
    
    const handleUpdateStatusRequest = async () => {
        try{
            //Cập nhật trạng thái của yêu cầu thành "Đã gửi thủ kho"
            const updateDoc = {
                status: "Đã gửi thủ kho"
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_approved._id}`,updateDoc);    
        }catch(error){
            console.log(error);
            return;
        }

        noti.current.showToast();
        setTimeout(async()=>{
            await getAllRequestForIssuanceOfEmbryos();
        }, 100)
        
        //Lấy ra tên đơn vị quản lý để điền vào "Đơn vị yêu cầu"
        let don_vi_yc = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _idYCCP_approved.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaName?.forEach((diplomaName)=>{
            if(_idYCCP_approved.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })
        
        //Lấy ra tên cán bộ và email tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        //Lấy các user account có chức vụ thủ kho
        let allUserAccountStocker = [];
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _idYCCP_approved.mscb){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
            if(user.role[0] == "Stocker"){
                allUserAccountStocker = [...allUserAccountStocker, user];
            }
        })
        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu
        try{
            const mailOptions = {
                to: email_cb_tao_yc,
                subject: "Yêu cầu xin cấp phôi của bạn đã được gửi cho thủ kho",
                html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                        <div style='background-color: white;'>
                            <div>
                                <img
                                    style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                    src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                />
                            </div>
                            <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                Yêu cầu xin cấp phôi của bạn đã được gửi cho thủ kho    
                            </h1>
                            <hr />
                            <h3 style='text-align: center;'>Chi tiết yêu cầu</h3>
                            <div style='padding: 0px 25px 10px 25px;'>
                                <div>Mã phiếu: #${_idYCCP_approved.embryoIssuanceRequest_id}</div>
                                <div style='margin-top: 10px;'>
                                    Đơn vị yêu cầu: ${don_vi_yc}
                                </div>
                                <div style='margin-top: 10px;'>
                                    Loại phôi cần cấp: ${loai_phoi}
                                </div>
                                <div style='margin-top: 10px;'>
                                    Đợt thi/đợt cấp bằng: ${handleDateToDMY(_idYCCP_approved.examination)}
                                </div>
                                <div style='margin-top: 10px;'>Số lượng phôi cần cấp: ${_idYCCP_approved.numberOfEmbryos}</div>
                                <div style='margin-top: 10px;'>
                                    Người tạo yêu cầu: ${ten_cb_tao_yc}/${_idYCCP_approved.mscb}
                                </div>
                                <div style='margin-top: 10px;'>Thời gian tạo: ${handleDateToDMY(_idYCCP_approved.time)}</div>
                                <div style='margin-top: 15px;'>
                                <a href='http://localhost:3000/manage_requests_for_diploma_drafts'>
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

        //Gửi mail cho tất cả các tài khoản có chức vụ Thủ kho
        for(let i = 0; i<allUserAccountStocker.length; i++){
            try{
                const mailOptions = {
                    to: allUserAccountStocker[i].email,
                    subject: "Yêu cầu xin cấp phôi mới cần được xử lý",
                    html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                            <div style='background-color: white;'>
                                <div>
                                    <img
                                        style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                        src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                    />
                                </div>
                                <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                    Yêu cầu xin cấp phôi mới cần được xử lý
                                </h1>
                                <hr />
                                <h3 style='text-align: center;'>Chi tiết yêu cầu</h3>
                                <div style='padding: 0px 25px 10px 25px;'>
                                    <div>Mã phiếu: #${_idYCCP_approved.embryoIssuanceRequest_id}</div>
                                    <div style='margin-top: 10px;'>
                                        Đơn vị yêu cầu: ${don_vi_yc}
                                    </div>
                                    <div style='margin-top: 10px;'>
                                        Loại phôi cần cấp: ${loai_phoi}
                                    </div>
                                    <div style='margin-top: 10px;'>
                                        Đợt thi/đợt cấp bằng: ${handleDateToDMY(_idYCCP_approved.examination)}
                                    </div>
                                    <div style='margin-top: 10px;'>Số lượng phôi cần cấp: ${_idYCCP_approved.numberOfEmbryos}</div>
                                    <div style='margin-top: 10px;'>
                                        Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_idYCCP_approved.mscb}
                                    </div>
                                    <div style='margin-top: 10px;'>Thời gian tạo: ${handleDateToDMY(_idYCCP_approved.time)}</div>
                                    <div style='margin-top: 15px;'>
                                    <a href='http://localhost:3000/manage_requests_for_embryo_issuance_for_stocker'>
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

    const scrollToDetailRequest = () => {
        setTimeout(()=>{
            document.body.scrollTop = 900;
            document.documentElement.scrollTop = 900;
        },200)
    }

    return(
        <>  
            <Header/>
            <div className="container" id='body-MRFEIFS'> 
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li style={{backgroundColor: '#1b95a2', color:"white"}} className="list-group-item">Các yêu cầu xin cấp phôi đã được duyệt</li>
                                    <Link style={{textDecoration: 'none'}} to='/request_for_issuance_of_embryos_processed'>
                                        <li className="list-group-item">Các yêu cầu xin cấp phôi đã được thủ kho xử lý</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className='card p-3'>
                                <div className='row'>
                                    <div className="col-6">
                                        <Select
                                            id='select-MU-MRFEIFS'
                                            options={optionsOfSelectMU_MRFEIFS}
                                            placeholder="Chọn đơn vị quản lý"
                                            value={selectedSelectMU_MRFEIFS}
                                            onChange={handleChangeselectedSelectMU_MRFEIFS}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <Select
                                            id='select-diplomaName-MRFEIFS'
                                            placeholder="Chọn tên văn bằng"
                                            options={optionsOfselectDiplomaNameMRFEIFS}
                                            value={selectedSelectDiplomaNameMRFEIFS}
                                            onChange={handleChangeSelectDiplomaNameMRFEIFS}
                                        />
                                    </div>
                                </div>
                                <div className='mt-3 row'>
                                    <div className="col-6">
                                        <input 
                                            type="text" 
                                            className='form-control'
                                            placeholder='Tìm kiếm theo mã phiếu'   
                                            value={inputMaPhieuSearch}
                                            onChange={(e)=>{
                                                setInputMaPhieuSearch(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <Select
                                            options={[
                                                {value:"", label: "Tất cả trạng thái"},
                                                {value:"Đã duyệt yêu cầu", label: "Đã duyệt yêu cầu"},
                                                {value:"Đã gửi thủ kho", label: "Đã gửi thủ kho"}
                                            ]}
                                            placeholder="Chọn trạng thái yêu cầu"
                                            value={statusYC}
                                            onChange={handleChangeStatusYC}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <p className='title-list-yc-xin-cap-phoi'>DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI ĐÃ ĐƯỢC DUYỆT</p>
                                </div>
                                <div className="row mt-3 p-3">
                                    <div id='contain-yc-cap-phoi-secretary'>
                                        <table className='table table-striped table-hover table-bordered' style={{width: '1700px', border: '2px solid #fed25c'}}>
                                            <thead>
                                                <tr>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên văn bằng</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng phôi</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Cán bộ tạo yêu cầu</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                                    <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">
                                                        Cập nhật trạng thái
                                                        <br />
                                                        (Đã gửi thủ kho)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    allYCCP_Panigate?.map((currentValue, index)=>{
                                                        //Lấy ra tên văn bằng, loại văn bằng và options
                                                        let ten_van_bang;
                                                        let loai_van_bang;
                                                        let options;
                                                        allDiplomaName?.forEach((diplomaName)=>{
                                                            if(currentValue.diploma_name_id == diplomaName.diploma_name_id){
                                                                ten_van_bang = diplomaName.diploma_name_name;

                                                                allDiplomaType?.forEach((diplomaType)=>{
                                                                    if(diplomaType.diploma_type_id == diplomaName.diploma_type_id){
                                                                        loai_van_bang = diplomaType.diploma_type_name;
                                                                    }
                                                                })
                                                                options = diplomaName.options;
                                                            }
                                                        })
                                                        //Lấy ra tên cán bộ
                                                        let ten_can_bo_tao_yc;
                                                        allUserAccount?.forEach((user)=>{
                                                            if(currentValue.mscb == user.mssv_cb){
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
                                                            <tr key={index} style={{textAlign: 'center'}}>
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
                                                                            <i 
                                                                                className="fa-solid fa-eye"
                                                                                style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}                                                             
                                                                                onClick={(e)=>{
                                                                                    setCloseButton(index);
                                                                                    setShowDetailRequest(true)
                                                                                    setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                                    setManagementUnitPhieuYC(don_vi_quan_ly);
                                                                                    setDiplomaNameInPhieuYC(ten_van_bang);
                                                                                    setExaminationsInPhieuYC(currentValue.examination);
                                                                                    setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos);
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
                                                                        currentValue.status == "Đã duyệt yêu cầu" ? (
                                                                            <i 
                                                                                className="fa-solid fa-pen-to-square"
                                                                                style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}  
                                                                                data-bs-toggle="modal" data-bs-target="#updateStatusYCCPtoSentStocker" 
                                                                                onClick={(e)=>{
                                                                                    set_idYCCP_approved(currentValue);
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

                                    {/* Modal cập nhật trạng thái của yêu cầu thành Đã gửi thủ kho */}
                                    <div className="modal fade" id="updateStatusYCCPtoSentStocker" tabIndex="-1" aria-labelledby="updateStatusYCCPtoSentStockerLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="updateStatusYCCPtoSentStockerLabel"></h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <h5>Bạn có chắc muốn cập nhật trạng thái của yêu cầu cấp phôi này thành <span style={{fontWeight: 'bold'}}>"Đã gửi thủ kho"</span></h5>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                <button 
                                                    type="button" 
                                                    className="btn" 
                                                    style={{backgroundColor: '#1b95a2'}}
                                                    onClick={(e)=>{
                                                        handleUpdateStatusRequest();
                                                    }}
                                                >Cập nhật</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                                                                    

                                    <div className="d-flex justify-content-center mt-3">
                                    <Stack spacing={2}>
                                        <Pagination 
                                            count={Math.ceil(allYCCP_After_filter2?.length/5)}
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
                    <div className="row pb-3">
                        <div className="mt-4">
                            {
                                showDetailRequest ? (
                                    <DetailRequest
                                        embryoIssuanceRequest_id={embryoIssuanceRequest_id}
                                        managementUnitPhieuYC={managementUnitPhieuYC}
                                        diplomaNameInPhieuYC={diplomaNameInPhieuYC}
                                        examinationsInPhieuYC={examinationsInPhieuYC}
                                        numberOfEmbryosInPhieuYC={numberOfEmbryosInPhieuYC}
                                        diplomaType={diplomaType}
                                        optionsOfDiplomaName={optionsOfDiplomaName}
                                        allDSHVByEIR={allDSHVByEIR}
                                    />
                                ) : (
                                    ""
                                )
                            }
                        </div>
                    </div>
                </div>    
            </div>
            <Footer/>
            <Toast
                message="Cập nhật trạng thái yêu cầu xin cấp phôi thành công"
                type="success"
                ref={noti}
            />
        </>
    )
}
//Phê duyệt yêu cầu cấp phôi
import './ApproveRequestForIssuanceOfEmbryos.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName, getAllDiplomaType } from '../../redux/apiRequest';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Toast from '../Toast/Toast';
import DetailRequest from '../DetailRequest/DetailRequest';
export default function ApproveRequestForIssuanceOfEmbryos(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);

    //State lấy ra all diplomaName trong DB để lấy ra tên văn bằng
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //State để lấy all major trong DB ra
    const [allMajorInDB, setAllMajorInDB] = useState([]);

    //State để lưu options cho select có id = select-management-unit-ARFIOE
    const [optionsOfSelectMUARFIOE, setOptionsOfSelectMUARFIOE] = useState([]);
    //State lưu giá trị của select có id = select-management-unit-ARFIOE
    const [selectedMUARFIOE, setSelectedMUARFIOE] = useState({value:"", label:"Tất cả đơn vị quản lý"});
    const handleChangeSelectedMUARFIOE = (selectedOption) =>{
        setSelectedMUARFIOE(selectedOption);
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

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
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

    useEffect(()=>{
        getAllManagementUnit();
        getAllRequestForIssuanceOfEmbryos();
        getAllDiplomaName(dispatch);
        getAllUserAccount();
        getAllDiplomaType(dispatch);
        getAllMajorsShowModal();
    }, [])
    
    useEffect(()=>{
        let resultOption = [{value:"", label:"Tất cả đơn vị quản lý"}];
        allManagementUnit?.forEach((currentValue)=>{
            const newOption = {value: currentValue.management_unit_id, label: currentValue.management_unit_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfSelectMUARFIOE(resultOption);
    }, [allManagementUnit])
    
    //State lưu các tên văn bằng theo đơn vị quản lý được chọn tại select có id = select-management-unit-ARFIOE
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    //State lưu options của select có id = select-diploma-name-ARFIOE
    const [optionsSelectDiplomaNameARFIOE, setOptionsSelectDiplomaNameARFIOE] = useState([]);
    //State lưu giá trị của select có id = select-diploma-name-ARFIOE
    const [selectedSelectDiplomaNameARFIOE, setSelectedSelectDiplomaNameARFIOE] = useState({value:"", label:"Tất cả tên văn bằng"});
    const handleChangeSelectDiplomaNameARFIOE = (selectedOption) => {
        setSelectedSelectDiplomaNameARFIOE(selectedOption);
    }

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý được chọn tại select có id = select-management-unit-ARFIOE
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
        setSelectedSelectDiplomaNameARFIOE({value:"", label:"Tất cả tên văn bằng"});
        if(selectedMUARFIOE != ""){
            getAllDiplomaNameByMU(selectedMUARFIOE.value);
        }
    }, [selectedMUARFIOE])

    useEffect(()=>{
        let resultOption = [{value:"", label:"Tất cả tên văn bằng"}];
        allDiplomaNameByMU?.forEach((currentValue) => {
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectDiplomaNameARFIOE(resultOption);
    }, [allDiplomaNameByMU]) 
    
    //State chứa all yêu cầu xin cấp phôi trong db
    const [allRequestForIssuanceOfEmbryos, setAllRequestForIssuanceOfEmbryos] = useState([]);
    //Hàm call api lấy all yêu cầu cấp phôi trong db
    const getAllRequestForIssuanceOfEmbryos = async () => {
        try{
            const result = await axios.get("http://localhost:8000/v1/embryo_issuance_request/get_all_yccp");
            setAllRequestForIssuanceOfEmbryos(result.data);
            setAllRequestForIssuanceOfEmbryosShow(result.data);
        }catch(error){
            console.log(error);
        }
    }
    
    //State chưa các yêu cầu cấp phôi sẽ được show ra màn hình dựa theo đơn vị quản lý và tên văn bằng được chọn
    const [allRequestForIssuanceOfEmbryosShow, setAllRequestForIssuanceOfEmbryosShow] = useState([]);
    
    useEffect(()=>{
        let result = [];
        if(selectedMUARFIOE.value!=""){
            allRequestForIssuanceOfEmbryos?.forEach((currentValue)=>{
                if(currentValue.management_unit_id == selectedMUARFIOE.value){
                    result = [...result, currentValue];
                }
            })

            if(selectedSelectDiplomaNameARFIOE.value!=""){
                let result2 = [];
                result?.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == selectedSelectDiplomaNameARFIOE.value){
                        result2 = [...result2, currentValue]
                    }
                })
                setAllRequestForIssuanceOfEmbryosShow(result2);
            }else{
                setAllRequestForIssuanceOfEmbryosShow(result);
            }
        }else{
            setAllRequestForIssuanceOfEmbryosShow(allRequestForIssuanceOfEmbryos);
        }
    }, [selectedMUARFIOE, selectedSelectDiplomaNameARFIOE, allRequestForIssuanceOfEmbryos])
    
    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("");
    const [statusYC, setStatusYC] = useState({value: "", label:"Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) => {
        setStatusYC(selectedOption);
    }

    //State sau khi lọc theo trạng thái
    const [all_YCCP_After_filter1, setAll_YCCP_After_filter1] = useState([]);
    //State sau khi lọc theo mã phiếu
    const [all_YCCP_After_filter2, setAll_YCCP_After_filter2] = useState([]);

    useEffect(()=>{
        if(statusYC.value!=""){
            let result = [];
            allRequestForIssuanceOfEmbryosShow?.forEach((currentValue)=>{
                if(currentValue.status == statusYC.value){
                    result = [...result, currentValue];
                }
            })
            setAll_YCCP_After_filter1(result);
        }else{
            setAll_YCCP_After_filter1(allRequestForIssuanceOfEmbryosShow);
        }

    }, [allRequestForIssuanceOfEmbryosShow, statusYC])

    useEffect(()=>{
        if(inputMaPhieuSearch!=""){
            let result = [];
            all_YCCP_After_filter1?.forEach((currentValue)=>{
                if(currentValue.embryoIssuanceRequest_id == inputMaPhieuSearch){
                    result = [...result, currentValue];
                }
            })
            setAll_YCCP_After_filter2(result);
        }else{
            setAll_YCCP_After_filter2(all_YCCP_After_filter1);
        }
    }, [all_YCCP_After_filter1, inputMaPhieuSearch])

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
    //State và logic xử lý phân trang
    const [page, setPage] = useState(1);
    const [allYCCP_PT, setAllYCCP_PT] = useState([]);

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && all_YCCP_After_filter2!=undefined){
            if(all_YCCP_After_filter2.length>5){
                const numberOfPage = Math.ceil(all_YCCP_After_filter2?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = all_YCCP_After_filter2.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, all_YCCP_After_filter2[i]];
                }
                setAllYCCP_PT(result);
            }else{
                setAllYCCP_PT(all_YCCP_After_filter2);
            }         
        }
    }, [page, all_YCCP_After_filter2])
    
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

    //Xử lý logic việc duyệt yêu cầu cấp phôi
    //Lấy ra all user account có chức vụ thư ký
    const [allUserSecretary, setAllUserSecretary] = useState([]);

    //Lấy ra các user account có chức vụ thư ký từ state allUserAccount
    useEffect(()=>{
        let result = [];
        allUserAccount?.forEach((user)=>{
            if(user.role[0] == "Secretary"){
                result = [...result, user];
            }
        })
        setAllUserSecretary(result);
    }, [allUserAccount])

    //State chứa object của yêu cầu cấp phôi sẽ được duyệt
    const [_idYCCP_approved, set_idYCCP_approved] = useState("");

    //State chứa phần diễn giải khi duyệt/không duyệt yêu cầu xin cấp phôi
    const [explainYCCP, setExplainYCCP] = useState("");

    const noti = useRef();

    //Hàm duyệt yêu cầu cấp phôi
    const handleApproveRequest = async () => {
        //Duyệt yêu cầu và cập nhật diễn giải
        try{
            const updateDoc = {
                status: "Đã duyệt yêu cầu",
                comment: explainYCCP
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_approved._id}`,updateDoc);
        }catch(error){
            console.log(error);
        }

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

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _idYCCP_approved.mscb){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
        })

        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu
        try{
            const mailOptions = {
                to: email_cb_tao_yc,
                subject: "Đã duyệt yêu cầu xin cấp phôi",
                html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                    <div style='background-color: white;'>
                        <div>
                            <img
                                style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                            />
                        </div>
                        <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                            Yêu cầu xin cấp phôi của bạn đã được duyệt
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
                            <div style='margin-top: 10px;'>
                                Người duyệt: ${user.fullname} / ${user.mssv_cb}
                            </div>
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

        //Gửi mail cho tất cả các tài khoản có chức vụ Thư ký
        for(let i = 0; i<allUserSecretary.length; i++){
            try{
                const mailOptions = {
                    to: allUserSecretary[i].email,
                    subject: "Duyệt yêu cầu xin cấp phôi",
                    html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                            <div style='background-color: white;'>
                                <div>
                                    <img
                                        style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                        src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                    />
                                </div>
                                <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                    Yêu cầu xin cấp phôi mới vừa được duyệt
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
                                    <div style='margin-top: 10px;'>
                                        Người duyệt: ${user.fullname} / ${user.mssv_cb}
                                    </div>
                                    <div style='margin-top: 15px;'>
                                    <a href='http://localhost:3000/manage_requests_for_embryo_issuance_for_secretary'>
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
        noti.current.showToast();
        setTimeout(async()=>{
            await getAllRequestForIssuanceOfEmbryos();
        }, 2000)
    }

    //Hàm xử lý không duyệt yêu cầu
    const noti2 = useRef();

    const handleNotApproveRequest = async()=>{
        //Không duyệt yêu cầu và cập nhật diễn giải
        try{
            const updateDoc = {
                status: "Không duyệt",
                comment: explainYCCP
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_approved._id}`,updateDoc);
        }catch(error){
            console.log(error);
        }

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

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == _idYCCP_approved.mscb){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
        })

        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu
        try{
            const mailOptions = {
                to: email_cb_tao_yc,
                subject: "Không duyệt yêu cầu xin cấp phôi",
                html: `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                    <div style='background-color: white;'>
                        <div>
                            <img
                                style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                            />
                        </div>
                        <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                            Yêu cầu xin cấp phôi của bạn đã không được duyệt
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
                            <div style='margin-top: 10px;'>
                                Người xét duyệt: ${user.fullname} / ${user.mssv_cb}
                            </div>
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
        noti2.current.showToast();
        setTimeout(async()=>{
            await getAllRequestForIssuanceOfEmbryos();
        }, 2000)
    }

    return(
        <>
            <Header/>
                <div className="container" id='body-ARFIOE'>
                    <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                        <div className="card pb-3">
                            <div className="row p-3">
                                <div className="col-md-6">
                                    <Select
                                        id='select-management-unit-ARFIOE'
                                        placeholder="Chọn đơn vị quản lý"
                                        options={optionsOfSelectMUARFIOE}
                                        value={selectedMUARFIOE}
                                        onChange={handleChangeSelectedMUARFIOE}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <Select
                                        id='select-diploma-name-ARFIOE'
                                        placeholder="Chọn tên văn bằng"
                                        value={selectedSelectDiplomaNameARFIOE}
                                        onChange={handleChangeSelectDiplomaNameARFIOE}
                                        options={optionsSelectDiplomaNameARFIOE}
                                    />
                                </div>
                            </div>
                            <div className="row p-3">
                                <div className="col-md-6">
                                    <input 
                                        type="text" 
                                        placeholder='Tìm kiếm theo mã phiếu'
                                        value={inputMaPhieuSearch}
                                        className='form-control'
                                        onChange={(e)=>{
                                            setInputMaPhieuSearch(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="col-md-6">
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
                                DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI
                            </div>
                            <div className="row p-5">
                                <div id='contain-yc-xin-cap-phoi-ARFIOE'>
                                    <table className='table table-striped table-hover table-bordered' style={{width: '1700px', border: '2px solid #fed25c'}}>
                                        <thead>
                                            <tr>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Tên văn bằng</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Đợt thi/Đợt cấp văn bằng (D/M/Y)</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng phôi</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Cán bộ tạo yêu cầu</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">MSCB</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem phiếu xuất kho</th>
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xét duyệt yêu cầu</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allYCCP_PT?.map((currentValue, index)=>{
                                                    //Lấy ra tên văn bằng, loại văn bằng và options
                                                    let ten_van_bang;
                                                    let loai_van_bang;
                                                    let options;
                                                    allDiplomaName?.forEach((diplomaName) => {
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

                                                    //Lấy ra tên cán bộ tạo yêu cầu
                                                    let ten_can_bo_tao_yc = '';
                                                    allUserAccount?.forEach((user) => {
                                                        if(user.mssv_cb == currentValue.mscb){
                                                            ten_can_bo_tao_yc = user.fullname;
                                                        }
                                                    })

                                                    return(
                                                        <tr style={{textAlign: 'center'}} key={index}>
                                                            <td>{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                            <td>{ten_van_bang}</td>
                                                            <td>{handleDateToDMY(currentValue.examination)}</td>
                                                            <td>{currentValue.numberOfEmbryos}</td>
                                                            <td>{ten_can_bo_tao_yc}</td>
                                                            <td>{currentValue.mscb}</td>

                                                            <td style={{color:"red", fontWeight: 'bold'}}>{currentValue.status}</td>
                                                            <td>
                                                                {
                                                                    closeButton == index ? (
                                                                        <i 
                                                                            style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                            className="fa-regular fa-circle-xmark"
                                                                            onClick={(e)=>{
                                                                                setShowDetailRequest(false)
                                                                                setCloseButton(null)
                                                                            }}
                                                                        ></i>
                                                                    ) : (
                                                                        <i 
                                                                            className="fa-solid fa-eye"
                                                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}  
                                                                            onClick={(e)=>{
                                                                                setCloseButton(index)
                                                                                setShowDetailRequest(true)
                                                                                setDiplomaType(loai_van_bang);
                                                                                allManagementUnit?.forEach((management_unit)=>{
                                                                                    if(management_unit.management_unit_id == currentValue.management_unit_id){
                                                                                        setManagementUnitPhieuYC(management_unit.management_unit_name);
                                                                                    }
                                                                                })
                                                                                setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                                setDiplomaNameInPhieuYC(ten_van_bang);
                                                                                setExaminationsInPhieuYC(currentValue.examination);
                                                                                setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos);
                                                                                setOptionsOfDiplomaName(options);
                                                                                getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options)
                                                                            }}                                                              
                                                                        ></i>
                                                                    )
                                                                }
                                                            </td>
                                                            <td></td>
                                                            <td>  
                                                                {
                                                                    currentValue.status == "Đã gửi yêu cầu" ? (
                                                                        <i 
                                                                            className="fa-solid fa-pen-to-square"
                                                                            style={{backgroundColor: "#2E8B57", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                            data-bs-toggle="modal" 
                                                                            data-bs-target="#approveRequestModal"
                                                                            onClick={(e)=>{
                                                                                set_idYCCP_approved(currentValue)
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
                                </div>

                                {/* Modal duyệt yêu cầu */}
                                <div className="modal fade" id="approveRequestModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="approveRequestModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="approveRequestModalLabel">Xét duyệt yêu cầu xin cấp phôi</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-8">
                                                    <div className="form-floating">
                                                        <textarea 
                                                            className="form-control" 
                                                            value={explainYCCP}
                                                            onChange={(e)=>{
                                                                setExplainYCCP(e.target.value);
                                                            }}
                                                            placeholder="Leave a comment here" 
                                                            id="dien-giai-xet-duyet-yccp" style={{height: "100px"}}></textarea>
                                                        <label htmlFor="dien-giai-xet-duyet-yccp">Nhập diễn giải</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="button" 
                                                className="btn" 
                                                style={{backgroundColor: '#1b95a2'}}
                                                onClick={(e)=>{
                                                    handleApproveRequest()
                                                }}
                                            >Duyệt</button>
                                            <button 
                                                className='btn btn-danger'
                                                onClick={(e)=>{
                                                    handleNotApproveRequest()
                                                }}
                                            >Không duyệt</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex justify-content-center mt-3">
                                    <Stack spacing={2}>
                                        <Pagination 
                                            count={Math.ceil(all_YCCP_After_filter2?.length/5)}
                                            variant="outlined"
                                            page={page}
                                            onChange={handleChange}
                                            color="info"
                                            />
                                    </Stack>
                                </div>
                            </div>
                            
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
                        </div>
                    </div>
                </div>
                <Toast
                    message="Duyệt yêu cầu xin cấp phôi thành công"
                    type="success"
                    ref={noti}
                />
                <Toast
                    message="Cập nhật trạng thái yêu cầu thành 'Không duyệt' thành công"
                    type="success"
                    ref={noti2}
                />
            <Footer/>
        </>
    )
} 
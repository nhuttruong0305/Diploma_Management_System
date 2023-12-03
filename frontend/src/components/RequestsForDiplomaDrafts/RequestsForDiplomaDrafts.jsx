import './RequestsForDiplomaDrafts.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Toast from '../Toast/Toast';
import {getAllDiplomaType} from '../../redux/apiRequest';
import DetailRequest from '../DetailRequest/DetailRequest';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
import { Tooltip } from 'react-tippy';
export default function RequestsForDiplomaDrafts(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    //State để ẩn hiện form điền dữ liệu tạo yêu cầu
    const [showFormAddEIR, setShowFormAddEIR] = useState(false);

    //State chứa all đơn vị quản lý và lưu tên đơn vị quản lý của người dùng
    const [allMU, setAllMU] = useState([]);
    const [managementUnitOfUser, setManagementUnitOfUser] = useState("");
    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllMU(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllManagementUnit();
        getAllDiplomaNameByMU(user?.management_unit);
        getAllMajorsShowModal();
        getAllDiplomaType(dispatch);
        getAllUserLeader();
        getAllUserAccount();
    }, [])

    useEffect(()=>{
        allMU?.forEach((element)=>{
            if(element.management_unit_id == user?.management_unit){
                setManagementUnitOfUser(element.management_unit_name);
            }
        })
    }, [allMU])

    //State lấy ra all diploma name theo đơn vị quản lý
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }
    //State chứa option và selected của Select có id = select-diplomaName-RFDD
    const [optionSelectDiplomaNameRFDD, setOptionSelectDiplomaNameRFDD] = useState([]);
    const [selectedSelectDiplomaNameRFDD, setSelectedSelectDiplomaNameRFDD] = useState("");
    const handleChangeselectedSelectDiplomaNameRFDD = (selectedOption) =>{
        setSelectedSelectDiplomaNameRFDD(selectedOption);
    }

    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name}
            resultOption = [...resultOption, newOption];
        })
        setOptionSelectDiplomaNameRFDD(resultOption);
    }, [allDiplomaNameByMU])
    //State lưu đợt thi
    const [examination, setExaminations] = useState("");
    //State lưu số lượng phôi
    const [numberOfEmbryos, setNumberOfEmbryos] = useState("");

    //Hàm tạo file excel mẫu để download
    function createAndDownloadExcel() {
        // Tạo dữ liệu bạn muốn đưa vào tệp Excel
        const data = [
            {
                stt: "",
                fullname:"",
                sex:"",
                dateofbirth:"",
                address:"",
                CCCD:"",
                
                diem_tn:"",
                diem_th:"",
                nghe:"",
                noi:"",
                doc:"",
                viet:"",
                test_day:"",
                graduationYear:"",
                classification:"",
                nganh_dao_tao:"",
                council:""
            }
        ];
        // Tạo một Workbook và một Worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        worksheet['A1'] = { v: 'STT', t: 's' };
        worksheet['B1'] = { v: 'Họ tên người được cấp', t: 's' };
        worksheet['C1'] = { v: 'Giới tính', t: 's' };
        worksheet['D1'] = { v: 'Ngày sinh', t: 's' };
        worksheet['E1'] = { v: 'Nơi sinh', t: 's' };
        worksheet['F1'] = { v: 'CCCD', t: 's' };
        
        worksheet['G1'] = { v: 'Điểm trắc nghiệm', t: 's' };
        worksheet['H1'] = { v: 'Điểm thực hành', t: 's' };
        worksheet['I1'] = { v: 'Điểm kỹ năng nghe', t: 's' };
        worksheet['J1'] = { v: 'Điểm kỹ năng nói', t: 's' };
        worksheet['K1'] = { v: 'Điểm kỹ năng đọc', t: 's' };
        worksheet['L1'] = { v: 'Điểm kỹ năng viết', t: 's' };
        worksheet['M1'] = { v: 'Ngày thi', t: 's' };
        worksheet['N1'] = { v: 'Năm tốt nghiệp', t: 's' };
        worksheet['O1'] = { v: 'Xếp loại', t: 's' };
        worksheet['P1'] = { v: 'Ngành đào tạo', t: 's' };
        worksheet['Q1'] = { v: 'Hội đồng thi', t: 's' };
        // Thêm Worksheet vào Workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Chuyển đổi Workbook thành dạng binary
        var wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        // Chuyển đổi dạng binary thành ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        }
        // Tạo một Blob từ ArrayBuffer
        var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Tạo một URL cho Blob
        var url = URL.createObjectURL(blob);

        // Tạo một đường link tải xuống
        var link = document.createElement('a');
        link.href = url;
        link.download = 'dshv.xlsx';

        // Thêm đường link vào DOM và tự động kích hoạt sự kiện click để tải xuống
        // export_excel_btn.append(link);
        link.click();
        // document.body.removeChild(link);
    }

    //State lưu file và dữ liệu đọc được từ file
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileData = event.target.result;
                const workbook = XLSX.read(fileData, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });                
                setData(parsedData);
            };
            reader.readAsBinaryString(selectedFile);
        }
    };
    
    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();
    const noti4 = useRef();
    const noti5 = useRef();
    const noti6 = useRef();

    //State chứa all ngành đào tạo
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

    //Hàm call api lấy danh sách các yêu cầu xin cấp phôi văn bằng của tất cả các loại văn bằng được quản lý bởi đơn vị quản lý của tài khoản
    const [allEIR, setAllEIR] = useState([]);
    const getAllEIR = async (allDiplomaNameByMU) => {
        try{
            let result = [];
            for(let i = 0; i<allDiplomaNameByMU.length; i++){
                const res = await axios.get(`http://localhost:8000/v1/embryo_issuance_request/get_yccp_by_list_diploma_name_id/${allDiplomaNameByMU[i].diploma_name_id}`);
                result = [...result, ...res.data];
            }
            setAllEIR(result);
            setAllEIRShow(result);
        }catch(error){
            console.log(error)
        }
    }

    //Lấy tất cả các tài khoản có chức vụ tổ trưởng
    const [allUserLeader, setAllUserLeader] = useState([]);

    const getAllUserLeader = async () => {
        try{
            const result = await axios.get("http://localhost:8000/v1/user_account/get_all_user_leader");
            setAllUserLeader(result.data)
        }catch(error){
            console.log(error)
        }
    }

    //Lấy all user account 
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
    
    const handleSubmitCreateRequest = async () => {
        if(selectedSelectDiplomaNameRFDD =="" || selectedSelectDiplomaNameRFDD ==undefined){
            noti.current.showToast();
            return;
        }
        if(examination ==""){
            noti2.current.showToast();
            return;
        }
        if(numberOfEmbryos == ""){
            noti3.current.showToast();
            return;
        }

        if(file==null){
            noti4.current.showToast();
            return;
        }

        let allDataInExcel = [];   
        for(let i = 1; i<data.length; i++){
            //Xử lý ngày sinh
            const dateOfBirthExcel = new Date((data[i][3] - 25569) * 86400 * 1000);
            let monthdateOfBirthExcel;
            if(dateOfBirthExcel.getMonth() + 1 < 10){
                monthdateOfBirthExcel=`0${dateOfBirthExcel.getMonth() + 1}`
            }else{
                monthdateOfBirthExcel=dateOfBirthExcel.getMonth() + 1;
            }
            let daydateOfBirthExcel;
            if(dateOfBirthExcel.getDate()<10){
                daydateOfBirthExcel=`0${dateOfBirthExcel.getDate()}`;
            }else{
                daydateOfBirthExcel=dateOfBirthExcel.getDate();
            }
            //Xử lý ngày thi
            let resultTestday;
            if(data[i][12]!=undefined){
                const dateTestDay = new Date((data[i][12] - 25569) * 86400 * 1000);

                let monthDateTestDay;
                if(dateTestDay.getMonth()+1<10){
                    monthDateTestDay = `0${dateTestDay.getMonth()+1}`;
                }else{
                    monthDateTestDay = dateTestDay.getMonth()+1;
                }
                let dayDateTestDay;

                if(dateTestDay.getDate()<10){
                    dayDateTestDay=`0${dateTestDay.getDate()}`;
                }else{
                    dayDateTestDay = dateTestDay.getDate();
                }

                resultTestday=`${dateTestDay.getFullYear()}-${monthDateTestDay}-${dayDateTestDay}`
            }else{
                resultTestday="";
            }
            
            let nganh_dao_tao;
            allMajorInDB?.forEach((element)=>{
                if(data[i][15] == element.majors_name){
                    nganh_dao_tao = element.majors_id;
                }
            })

            const newHVObject = {
                fullname: data[i][1],
                sex: data[i][2],
                dateOfBirth: `${dateOfBirthExcel.getFullYear()}-${monthdateOfBirthExcel}-${daydateOfBirthExcel}`,
                address: data[i][4],
                CCCD: data[i][5],
                diem_tn: data[i][6],
                diem_th: data[i][7],
                nghe: data[i][8],
                noi: data[i][9],
                doc: data[i][10],
                viet: data[i][11],
                test_day: resultTestday,
                graduationYear: data[i][13],
                classification: data[i][14],
                nganh_dao_tao: nganh_dao_tao,
                council: data[i][16]
            }
            allDataInExcel = [...allDataInExcel, newHVObject];
        }

        const newYCCapPhoi = {
            management_unit_id: user?.management_unit,
            diploma_name_id: selectedSelectDiplomaNameRFDD?.value,
            examination: examination,
            numberOfEmbryos: parseInt(numberOfEmbryos),
            mscb: user.mssv_cb
        }

        let new_embryo_issuance_request;//Object yêu cầu xin cấp phôi được trả về khi tạo yêu cầu
        let loai_phoi = '';
        let ten_cb_tao_yc = '';
        try{
            const result1 = await axios.post("http://localhost:8000/v1/embryo_issuance_request/add_new_embryoIssuanceRequest", newYCCapPhoi, {
                headers: {token: `Bearer ${user.accessToken}`}
            })
            new_embryo_issuance_request = result1.data;
        }catch(error){
            console.log(error);
            return;
        }

        //Lấy ra các thông tin để điền vào email
        //Lấy ra tên loại phôi
        allDiplomaNameByMU?.forEach((diplomaName) => {
            if(diplomaName.diploma_name_id == new_embryo_issuance_request.diploma_name_id){
                loai_phoi=diplomaName.diploma_name_name;
            }
        })

        //Lấy ra tên người tạo yêu cầu
        allUserAccount?.forEach((user)=>{
            if(user.mssv_cb == new_embryo_issuance_request.mscb){
                ten_cb_tao_yc = user.fullname;
            }
        })

        for(let j = 0; j<allDataInExcel.length; j++){
            try{
                const result2 = await axios.post(`http://localhost:8000/v1/DSHV/add_student`, allDataInExcel[j],{
                    headers: {token: `Bearer ${user.accessToken}`}
                })
            }catch(error){
                console.log(error);
                return;
            }
        }
        noti6.current.showToast(); 
        setTimeout(async()=>{
            await getAllEIR(allDiplomaNameByMU);
        }, 100)
        //Gửi email cho các tài khoản có chức vụ Tổ trưởng  
        for(let k = 0; k<allUserLeader.length; k++){
            try{
                const mailOptions = {
                    to: allUserLeader[k].email,
                    subject: "Yêu cầu xin cấp phôi mới",
                    html:   `<div style='background-color: #f3f2f0; padding: 50px 150px 50px 150px; color: black;'>
                                <div style='background-color: white;'>
                                    <div>
                                        <img
                                            style='width: 50px; margin-top: 25px; margin-left: 25px;'
                                            src='https://upload.wikimedia.org/wikipedia/vi/thumb/6/6c/Logo_Dai_hoc_Can_Tho.svg/1200px-Logo_Dai_hoc_Can_Tho.svg.png'
                                        />
                                    </div>
                                    <h1 style='text-align: center; font-size: 24px; padding: 15px;'>
                                        Yêu cầu xin cấp phôi mới vừa được tạo cần được xét duyệt
                                    </h1>
                                    <hr />
                                    <h3 style='text-align: center;'>Chi tiết yêu cầu</h3>
                                    <div style='padding: 0px 25px 10px 25px;'>
                                        <div>Mã phiếu: #${new_embryo_issuance_request.embryoIssuanceRequest_id}</div>
                                        <div style='margin-top: 10px;'>
                                            Đơn vị yêu cầu: ${managementUnitOfUser}
                                        </div>
                                        <div style='margin-top: 10px;'>
                                            Loại phôi cần cấp: ${loai_phoi}
                                        </div>
                                        <div style='margin-top: 10px;'>
                                            Đợt thi/đợt cấp bằng: ${handleDateToDMY(new_embryo_issuance_request.examination)}
                                        </div>
                                        <div style='margin-top: 10px;'>Số lượng phôi cần cấp: ${new_embryo_issuance_request.numberOfEmbryos}</div>
                                        <div style='margin-top: 10px;'>
                                            Người tạo yêu cầu: ${ten_cb_tao_yc}/${new_embryo_issuance_request.mscb}
                                        </div>
                                        <div style='margin-top: 10px;'>Thời gian tạo: ${handleDateToDMY(new_embryo_issuance_request.time)}</div>
                                        <div style='margin-top: 15px;'>
                                        <a href='http://localhost:3000/approve_request_for_issuance_of_embryos'>
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

    //Phần dưới chứa state và logic xử lý phần hiển thị các yêu cầu cấp phôi văn bằng
    const [selectedSelectDiplomaNameSearchRFDD, setSelectedSelectDiplomaNameSearchRFDD] = useState("");
    const handleChangeSelectedSelectDiplomaNameSearchRFDD = (selectedOption) => {
        setSelectedSelectDiplomaNameSearchRFDD(selectedOption);
    }

    //State để ẩn hiện chi tiết yêu cầu
    const [showRequestDetail, setShowRequestDetail] = useState(false);
    //State để tạo nút đóng cho nút hiển thị chi tiết yêu cầu xin cấp phôi
    const [closeButton, setCloseButton] = useState(null);

    //State để tạo nút đóng cho nút hiển thị chi tiết phiếu xuất kho
    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);
    //State ẩn hiện chi tiết phiếu xuất kho
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
    
    useEffect(()=>{
        getAllEIR(allDiplomaNameByMU);
    }, [allDiplomaNameByMU])

    //State để lọc ra các yêu cầu nếu chọn tên văn bằng tại select có id = select-diploma-name-search-RFDD
    const [allEIRShow, setAllEIRShow] = useState([]);
    
    useEffect(()=>{
        if(selectedSelectDiplomaNameSearchRFDD.value!=""){
            let result = [];
            allEIR?.forEach((element)=>{
                if(element.diploma_name_id == selectedSelectDiplomaNameSearchRFDD.value){
                    result = [...result, element];
                }
            })
            setAllEIRShow(result);
        }else{
            setAllEIRShow(allEIR);
        }
    }, [selectedSelectDiplomaNameSearchRFDD])

    const [inputMaPhieuSearch, setInputMaPhieuSearch] = useState("")
    const [statusYC, setStatusYC] = useState({value:"", label: "Tất cả trạng thái"});
    const handleChangeStatusYC = (selectedOption) => {
        setStatusYC(selectedOption);
    }

    //State chứa các yêu cầu xin cấp phôi sau khi lọc theo trạng thái
    const [all_YCCP_After_filter1, setAll_YCCP_After_filter1] = useState([]);
    //State chứa các yêu cầu xin cấp phôi sau khi lọc theo mã phiếu
    const [all_YCCP_After_filter2, setAll_YCCP_After_filter2] = useState([]);
    
    useEffect(()=>{
        if(statusYC.value!=""){
            let result = [];
            allEIRShow?.forEach((currentValue)=>{
                if(currentValue.status == statusYC.value){
                    result = [...result, currentValue];
                }
            })
            setAll_YCCP_After_filter1(result);
        }else{
            setAll_YCCP_After_filter1(allEIRShow);
        }
    }, [allEIRShow, statusYC])

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

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    //State chứa all YCCP sẽ được hiển thị lên màn hình sau khi phân trang
    const [all_YCCP_PT, setAll_YCCP_PT] = useState([]);

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
                setAll_YCCP_PT(result);
            }else{
                setAll_YCCP_PT(all_YCCP_After_filter2);
            }         
        }
    }, [page, all_YCCP_After_filter2])

    const handleDateToDMY = (date) => {
        if(date == undefined){
            return "";
        }else{
            let splitDate = date.split("-");
            const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
            return result;
        }
    }

    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
        return result;
    }

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
                // dateOfBirth:dshv[i].dateOfBirth,
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

    const scrollToDetailRequest = () => {
        setTimeout(()=>{
            document.body.scrollTop = 1120;
            document.documentElement.scrollTop = 1120;
        },200)
    }

    function scrollToDeliveryBill(){
        if(showRequestDetail == false){
            setTimeout(()=>{
                document.body.scrollTop = 1120;
                document.documentElement.scrollTop = 1120;
            },200)
        }else{
            setTimeout(()=>{
                document.body.scrollTop = 3000;
                document.documentElement.scrollTop = 3000;
            },200)
        }
    }

    //Logic xử lý việc xóa YCCP khi chưa dc duyệt
    //State chứa _id của YCCP cần xóa
    const [_idYCCP_delete, set_idYCCP_delete] = useState("");
    //State chứa embryoIssuanceRequest_id để xóa dshv
    const [embryoIssuanceRequest_id_delete, setEmbryoIssuanceRequest_id_delete] = useState("");
    
    const handleDeleteYCCP = async () => {
        try{
            const deleteYCCP = await axios.delete(`http://localhost:8000/v1/embryo_issuance_request/delete_yccp/${_idYCCP_delete}/${embryoIssuanceRequest_id_delete}`);
            noti5.current.showToast();
            setTimeout(async()=>{
                await getAllEIR(allDiplomaNameByMU);
            }, 200)
        }catch(error){
            console.log(error);
        }
    }
    
    //Nhật ký nhận phôi
    const [embryoReceiptDiary, setEmbryoReceiptDiary] = useState({});

    return(
        <>
            <Header/>
            <div className="container" id='body-RFDD'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="d-flex justify-content-start">
                                <div className="ms-3">
                                    <button
                                    style={{width: '170px', backgroundColor: '#00abeb'}} 
                                    className='btn'
                                    type='button'
                                    onClick={(e)=>{
                                        setShowFormAddEIR(!showFormAddEIR)
                                    }}
                                    >Tạo mới yêu cầu</button>
                                </div>
                                <div className="ms-3">
                                    <button
                                    style={{width: '290px', backgroundColor: '#1b95a2'}} 
                                    className='btn'
                                    type='button'
                                    onClick={(e)=>{
                                        createAndDownloadExcel()
                                    }}
                                    >Mẫu file DSHV được cấp bằng</button>
                                </div>
                            </div>
                            
                        </div>

                        {
                            showFormAddEIR ? (
                                <>
                                    <div className="row mt-2 p-3">
                                        <div className="col-6">
                                            <div className="card p-3">
                                                <div className="row">
                                                    <div className="col-4">Tên đơn vị quản lý</div>
                                                    <div className="col-8">{managementUnitOfUser}</div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-4">Loại phôi văn bằng</div>
                                                    <div className="col-8">
                                                        <Select
                                                            id='select-diplomaName-RFDD'
                                                            placeholder="Chọn loại phôi văn bằng"
                                                            value={selectedSelectDiplomaNameRFDD}
                                                            onChange={handleChangeselectedSelectDiplomaNameRFDD}
                                                            options={optionSelectDiplomaNameRFDD}
                                                        />
                                                    </div> 
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-4">Đợt thi/Đợt cấp văn bằng</div>
                                                    <div className="col-8">
                                                        <input 
                                                            type="date" 
                                                            className='form-control'    
                                                            value={examination}
                                                            onChange={(e)=>{
                                                                setExaminations(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-4">Số lượng phôi</div>
                                                    <div className="col-8">
                                                        <input 
                                                            type="number" 
                                                            className='form-control'  
                                                            value={numberOfEmbryos}
                                                            onChange={(e)=>{
                                                                setNumberOfEmbryos(e.target.value)
                                                            }}  
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-4">Danh sách học viên kèm theo</div>
                                                    <div className="col-8">
                                                        <input 
                                                            type="file" className="form-control" 
                                                            id="inputGroupFileDSSV" 
                                                            aria-describedby="inputGroupFileDSSVAddon04" 
                                                            aria-label="Upload"
                                                            accept=".xlsx" 
                                                            onChange={handleFileChange}
                                                        />                                            
                                                    </div>
                                                </div>
                                                <div className="row mt-2">
                                                    <button 
                                                        style={{marginLeft: '400px',width: '150px', backgroundColor: '#1b95a2'}}
                                                        className='btn'
                                                        onClick={(e)=>{
                                                            handleSubmitCreateRequest();
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
                            <div className='col-md-4'>
                                <Select
                                    id='select-diploma-name-search-RFDD'
                                    options={[{value:"", label: "Tất cả loại phôi văn bằng"}, ...optionSelectDiplomaNameRFDD]}
                                    onChange={handleChangeSelectedSelectDiplomaNameSearchRFDD}
                                    value={selectedSelectDiplomaNameSearchRFDD}
                                    placeholder="Chọn loại phôi văn bằng"
                                />
                            </div>
                            <div className="col-md-4">
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
                            <div className="col-md-4">
                                <Select
                                    options={
                                        [
                                            {value:"", label: "Tất cả trạng thái"},
                                            {value:"Đã gửi yêu cầu", label: "Đã gửi yêu cầu"},
                                            {value:"Không duyệt", label: "Không duyệt"},
                                            {value:"Đã duyệt yêu cầu", label: "Đã duyệt yêu cầu"},
                                            {value:"Đã gửi thủ kho", label: "Đã gửi thủ kho"},
                                            {value:"Đã in phôi", label: "Đã in phôi"},
                                            {value:"Đã dán tem", label: "Đã dán tem"},
                                            {value:"Đã nhận phôi", label: "Đã nhận phôi"}
                                        ]
                                    }
                                    value={statusYC}
                                    onChange={handleChangeStatusYC}
                                />
                            </div>
                        </div>
                        <div className='title-list-yc-xin-cap-phoi'>
                            DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI
                        </div>
                        <div className='row p-5'>
                            <div id='contain-table-show-yc-xin-cap-phoi'>
                                <table 
                                    id='table-show-yc-xin-cap-phoi-RFDD' 
                                    className="table table-striped table-hover table-bordered"
                                >
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Mã phiếu</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c', width: '300px'}} scope="col">Loại phôi văn bằng</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c', width: '200px'}} scope="col">
                                                Đợt thi/Đợt cấp văn bằng
                                                (D/M/Y)
                                            </th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Số lượng phôi</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Trạng thái</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Người tạo</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Ngày tạo</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Người duyệt</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Ngày duyệt</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xem chi tiết</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c', width: '100px'}} scope="col">Xem phiếu xuất kho</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Nhật ký nhận phôi</th>
                                            <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            all_YCCP_PT?.map((currentValue, index)=>{
                                                let diplomaName = '';
                                                let nameOfDiplomaType = '';
                                                let optionsOfDiplomaName = [];
                                                allDiplomaNameByMU?.forEach((element)=>{
                                                    if(element.diploma_name_id == currentValue.diploma_name_id){
                                                        diplomaName = element.diploma_name_name;
                                                        allDiplomaType?.forEach((diplomaType)=>{
                                                            if(diplomaType.diploma_type_id == element.diploma_type_id){
                                                                nameOfDiplomaType = diplomaType.diploma_type_name;
                                                            }
                                                        })
                                                        optionsOfDiplomaName = element.options;
                                                    }
                                                })

                                                let nguoi_tao = '';
                                                let nguoi_duyet = '';
                                                let nguoi_nhan = '';
                                                allUserAccount?.forEach((user)=>{
                                                    if(user.mssv_cb == currentValue.mscb){
                                                        nguoi_tao = user.fullname;
                                                    }
                                                    if(user.mssv_cb == currentValue.mscb_approve){
                                                        nguoi_duyet = user.fullname;
                                                    }
                                                    if(user.mssv_cb == currentValue.mscb_diary_creator){
                                                        nguoi_nhan = user.fullname
                                                    }
                                                })
                                                return(
                                                    <tr style={{textAlign: 'center'}} key={index}>
                                                        <td scope="row">{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                        <td>{diplomaName}</td>
                                                        <td>{handleDateToDMY(currentValue.examination)}</td>
                                                        <td>{currentValue.numberOfEmbryos}</td>
                                                        <td>
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
                                                                <div style={{ backgroundColor: 'red', padding: '1px', borderRadius: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                                                    {currentValue.status}
                                                                </div>
                                                            </Tooltip>
                                                        </td>
                                                        <td>
                                                            {nguoi_tao} / {currentValue.mscb}
                                                        </td>
                                                        <td>
                                                            {handleDateToDMY(currentValue.time)}
                                                        </td>
                                                        <td>
                                                            {currentValue.mscb_approve == "" ? ("") : (`${nguoi_duyet} / ${currentValue.mscb_approve}`)}
                                                        </td>
                                                        <td>
                                                            {currentValue.time_approve == "" ? ("") : (handleDateToDMY(currentValue.time_approve))}
                                                        </td>
                                                        <td>
                                                            {
                                                                //Nút xem chi tiết yêu cầu xin cấp phôi
                                                                closeButton == index ? (
                                                                    <i 
                                                                        style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                        className="fa-regular fa-circle-xmark"
                                                                        onClick={(e)=>{
                                                                            setShowRequestDetail(false);
                                                                            setCloseButton(null)
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i 
                                                                        style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        className="fa-solid fa-eye"
                                                                        onClick={(e)=>{
                                                                            let MUName = "";
                                                                            allMU.forEach((management_unit)=>{
                                                                                if(management_unit.management_unit_id == currentValue.management_unit_id){
                                                                                    MUName = management_unit.management_unit_name;
                                                                                }
                                                                            })                                                                    
                                                                            setShowRequestDetail(true);
                                                                            setCloseButton(index)
                                                                            setEmbryoIssuanceRequest_id(currentValue.embryoIssuanceRequest_id);
                                                                            setDiplomaType(nameOfDiplomaType);
                                                                            setManagementUnitPhieuYC(MUName);
                                                                            setDiplomaNameInPhieuYC(diplomaName);
                                                                            setExaminationsInPhieuYC(currentValue.examination);
                                                                            setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos)
                                                                            setOptionsOfDiplomaName(optionsOfDiplomaName);
                                                                            getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, optionsOfDiplomaName)
                                                                            scrollToDetailRequest();
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
                                                                            setCloseButtonDeliveryBill(index);
                                                                            setShowDeliveryBill(true)
                                                                            getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
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
                                                                //nút xem nhật ký nhận phôi
                                                                currentValue.status == "Đã nhận phôi" ? (
                                                                    <i 
                                                                        className="fa-solid fa-book"
                                                                        style={{ backgroundColor: "#1fb5ed", width: '32px', padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        data-bs-toggle="modal" data-bs-target="#diaryReceiveIssuance"
                                                                        onClick={(e)=>{
                                                                            setEmbryoReceiptDiary({
                                                                                nguoi_nhan: nguoi_nhan,
                                                                                diary: currentValue.embryo_receipt_diary,
                                                                                mscb_diary_creator: currentValue.mscb_diary_creator,
                                                                                time_diary_creator: currentValue.time_diary_creator
                                                                            })
                                                                        }}
                                                                    ></i>
                                                                ) : (
                                                                    <i 
                                                                        className="fa-solid fa-book"
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
                                                                        data-bs-toggle="modal" data-bs-target="#deleteYCCPmodal"
                                                                        onClick={(e)=>{
                                                                            set_idYCCP_delete(currentValue._id);
                                                                            setEmbryoIssuanceRequest_id_delete(currentValue.embryoIssuanceRequest_id);
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
                        </div>
                        
                        {/* Modal hiển thị nhật ký nhận phôi */}
                        <div className="modal fade" id="diaryReceiveIssuance" tabindex="-1" aria-labelledby="diaryReceiveIssuanceLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                    <h1 className="modal-title fs-5" id="diaryReceiveIssuanceLabel">Nhật ký nhận phôi</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-9">
                                            <div className="form-floating">
                                                <textarea 
                                                    className="form-control" 
                                                    value={embryoReceiptDiary.diary}
                                                    onChange={(e)=>{
                                                        setEmbryoReceiptDiary(e.target.value);
                                                    }}
                                                    disabled
                                                    placeholder="Leave a comment here" 
                                                    id="diaryReceiveIssuanceTextarea" style={{height: "100px"}}></textarea>
                                                <label htmlFor="diaryReceiveIssuanceTextarea"></label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span style={{fontStyle: 'italic', marginRight: '13px'}}>Người nhận</span><span style={{fontWeight: 'bold', border: '2px solid grey', padding: '5px', borderRadius: '5px'}}>{embryoReceiptDiary.nguoi_nhan} / {embryoReceiptDiary.mscb_diary_creator}</span>
                                    </div>
                                    <div className="mt-3">
                                        <span style={{fontStyle: 'italic', marginRight: '20px'}}>Ngày nhận</span><span style={{fontWeight: 'bold', border: '2px solid grey', padding: '5px 14px 5px 5px', borderRadius: '5px'}}>{handleDateToDMY(embryoReceiptDiary.time_diary_creator)}</span>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                </div>
                                </div>
                            </div>
                        </div>


                        {/* Modal hỏi người dùng có chắc sẽ xóa YCCP không */}
                        <div className="modal fade" id="deleteYCCPmodal" tabIndex="-1" aria-labelledby="deleteYCCPmodalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                    <h1 className="modal-title fs-5" id="deleteYCCPmodalLabel">Xóa yêu cầu xin cấp phôi</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <h5>Bạn có chắc chắn muốn xóa yêu cầu xin cấp phôi này</h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                    <button 
                                        type="button" 
                                        className="btn"
                                        onClick={(e)=>{
                                            handleDeleteYCCP();
                                        }}
                                        style={{backgroundColor: '#1b95a2'}}
                                    >Xóa</button>
                                </div>
                                </div>
                            </div>
                        </div>




                        <div className="d-flex justify-content-center mt-3 mb-3">
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
                message="Vui lòng chọn loại phôi văn bằng"
                type="warning"
                ref={noti}
            />
            <Toast
                message="Vui lòng nhập đợt thi"
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Vui lòng nhập số lượng phôi"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Vui lòng thêm danh sách học viên kèm theo"
                type="warning"
                ref={noti4}
            />
            <Toast
                message="Tạo yêu cầu thành công"
                type="success"
                ref={noti6}
            />
            <Toast
                message="Xóa yêu cầu thành công"
                type="success"
                ref={noti5}
            />
        </>
    )
}
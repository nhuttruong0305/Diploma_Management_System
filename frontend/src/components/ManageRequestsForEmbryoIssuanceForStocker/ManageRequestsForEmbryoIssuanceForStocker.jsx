import './ManageRequestsForEmbryoIssuanceForStocker.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName, getAllDiplomaType } from '../../redux/apiRequest';
import DetailRequest from '../DetailRequest/DetailRequest';
import Toast from '../Toast/Toast';
import DetailDeliveryBill from '../DetailDeliveryBill/DetailDeliveryBill';
import { Tooltip } from 'react-tippy';
export default function ManageRequestsForEmbryoIssuanceForStocker(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //State để lấy all major trong DB ra
    const [allMajorInDB, setAllMajorInDB] = useState([]);

    //State chứa all management unit trong DB trừ tổ QLVBCC
    const [allManagementUnit, setAllManagementUnit] = useState([]);
    //State chứa data làm options cho select có id = select-management-unit-handle-request-stocker
    const [optionsOfSelectMU, setOptionsOfSelectMU] = useState([]);
    //Selected MU
    const [selectedMU, setSelectedMU] = useState({value: '', label: 'Tất cả đơn vị quản lý'});
    const handleChangeSelectedMU = (selectedOption) => {
        setSelectedMU(selectedOption);
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

    //Hàm call api lấy ra all MU
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
        getAllRequestForIssuanceOfEmbryos();
        getAllUserAccount();
        getAllDiplomaType(dispatch);
        getAllMajorsShowModal();
    }, [])
    
    useEffect(()=>{
        let resultOption = [{value: '', label: 'Tất cả đơn vị quản lý'}];
        allManagementUnit?.forEach((currentValue)=>{
            const newOption = {value: currentValue.management_unit_id, label: currentValue.management_unit_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfSelectMU(resultOption);
    }, [allManagementUnit])

    //State chứa các diploma name theo MU được chọn
    const [allDiplomaNameByMU , setAllDiplomaNameByMU] = useState([]);
    //Optiosn của select có id = select-diploma-name-handle-request-stocker
    const [optionsOfSelectedDiplomaName, setOptionsOfSelectedDiplomaName] = useState([]);
    //Selected diploma name
    const [selectedDiplomaName, setSelectedDiplomaName] = useState({value: '', label: 'Tất cả tên văn bằng'});
    const handleChangeSelectedDiplomaName = (selectedOption) => {
        setSelectedDiplomaName(selectedOption);
    }


    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý được chọn tại select có id = select-management-unit-handle-request-stocker
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
        getAllDiplomaNameByMU(selectedMU.value)
    }, [selectedMU])
    
    useEffect(()=>{
        let resultOption = [{value: '', label: 'Tất cả tên văn bằng'}];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsOfSelectedDiplomaName(resultOption);
    }, [allDiplomaNameByMU])

    //State value của input search tìm theo mã phiếu
    const [inputSearchMaPhieu, setInputSearchMaPhieu] = useState("");
    //State chứa value trạng thái của yêu cầu
    const [selectedStatus, setSelectedStatus] = useState({value: "", label: "Tất cả trạng thái"});
    const handleChangeSelectedStatus = (selectedOption) => {
        setSelectedStatus(selectedOption);
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
                if(currentValue.status != "Đã gửi yêu cầu" && currentValue.status != "Đã duyệt yêu cầu" && currentValue.status != "Không duyệt"){
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
        if(selectedMU.value!=""){
            allYCCP?.forEach((currentValue)=>{
                if(currentValue.management_unit_id == selectedMU.value){
                    result = [...result, currentValue];
                }
            })

            if(selectedDiplomaName.value!=""){
                let result2 = [];
                result?.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == selectedDiplomaName.value){
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
    }, [selectedMU, selectedDiplomaName, allYCCP])

    useEffect(()=>{

        if(selectedStatus.value!=""){
            let result = [];
            allYCCP_After_filter?.forEach((currentValue)=>{
                if(currentValue.status == selectedStatus.value){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter2(result);
        }else{
            setAllYCCP_After_filter2(allYCCP_After_filter);
        }

    }, [allYCCP_After_filter, selectedStatus])

    useEffect(()=>{
        if(inputSearchMaPhieu!=""){
            let result = [];
            allYCCP_After_filter2?.forEach((currentValue)=>{
                if(currentValue.embryoIssuanceRequest_id == inputSearchMaPhieu){
                    result = [...result, currentValue];
                }
            })
            setAllYCCP_After_filter3(result);
        }else{
            setAllYCCP_After_filter3(allYCCP_After_filter2);
        }
    }, [allYCCP_After_filter2, inputSearchMaPhieu])

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

    const handleDateToMDY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
        return result;
    }

    //Các state xử lý logic việc tạo phiếu xuất kho
    const [embryoIssuanceRequest_id_delivery_bill, setEmbryoIssuanceRequest_id_delivery_bill] = useState(0);
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

    const noti2 = useRef();
    const noti4 = useRef();
    const noti5 = useRef();
    const noti6 = useRef();
    const handleAddSeriToArray = async () =>{
        if(inputSeriNumberStart == "" || inputSeriNumberStart == NaN || inputSeriNumberEnd == "" || inputSeriNumberEnd == NaN){
            noti2.current.showToast();
            return;
        }

        if(parseInt(inputSeriNumberStart)< parseInt(lowestSerialNumber)){
            noti4.current.showToast();
            return;
        }
        
        if( parseInt(inputSeriNumberEnd)<=parseInt(inputSeriNumberStart)){
            noti5.current.showToast();
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
                noti6.current.showToast();
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

    const [unit_price, setUnit_price] = useState(0);

    //Object của yêu cầu xin cấp phôi để cập nhật trạng thái
    const [_idYCCP_approved, set_idYCCP_approved] = useState("");

    const noti = useRef();
    const noti3 = useRef();

    //Giá trị seri thấp nhất dc nhập trong các lần nhập, dc gán lại sau mỗi lần nhập
    const [lowestSerialNumber, setLowestSerialNumber] = useState("");

    //Giá trị seri thấp nhất đầu tiên, chỉ dc gán 1 lần
    const [firstLowestSerialNumber, setFirstLowestSerialNumber] = useState("");
    //Lấy phiếu xuất kho cuối cùng của loại phôi đang tạo phiếu xuất kho để biết được số seri bắt đầu
    const getLastedDeliveryBillBaseOnEmbryoType = async (embryo_type) => {
        // try{
        //     const lastedDeliveryBillBasedOnembryo_type = await axios.get(`http://localhost:8000/v1/delivery_bill/get_lasted_delivery_bill_based_on_embryo_type/${parseInt(embryo_type)}`);
        //     if(lastedDeliveryBillBasedOnembryo_type.data == null){
        //         setLowestSerialNumber(1);
        //         setFirstLowestSerialNumber(1);
        //     }else{
        //         setLowestSerialNumber(lastedDeliveryBillBasedOnembryo_type.data.seri_number_end[seri_number_end.length]+1);
        //         setFirstLowestSerialNumber(lastedDeliveryBillBasedOnembryo_type.data.seri_number_end[seri_number_end.length]+1);
        //     }
        // }catch(error){
        //     console.log(error);
        //     return;
        // }
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

    const handleCreateDeliveryBill = async () => {
        if(export_warehouse == ""){
            noti3.current.showToast();
            return;
        }

        if(seri_number_start.length == 0 || seri_number_end.length == 0){
            noti2.current.showToast();
            return;
        }

        const newDeliveryBill = {
            embryoIssuanceRequest_id: parseInt(embryoIssuanceRequest_id_delivery_bill),
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
            const res = await axios.post("http://localhost:8000/v1/delivery_bill/create_delivery_bill", newDeliveryBill);
            
            newDeliveryBillCreated = res.data;
            //call api cập nhật trạng thái yêu cầu xin cấp phôi
            const updateDoc = {
                status: "Đã in phôi"
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

        //Gửi mail cho tất cả tài khoản có chức vụ Thư ký
        //Step 1: lấy ra all user account có chức vụ Thư ký

        //Lấy ra tên cán bộ tạo yêu cầu
        let ten_cb_tao_yc = '';
        let email_cb_tao_yc = '';

        let allUserSecretary = [];
        allUserAccount?.forEach((user) => {
            if(user.role[0] == "Secretary" && user.management_unit == 13){
                allUserSecretary = [...allUserSecretary, user];
            }
            if(user.mssv_cb == _idYCCP_approved.mscb){
                ten_cb_tao_yc = user.fullname;
                email_cb_tao_yc = user.email;
            }
        })

        //Lấy ra tên đơn vị quản lý để điền vào "Đơn vị yêu cầu" và địa chỉ (bộ phận) nhận hàng
        let don_vi_yc = '';
        let receiving_address = '';
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == _idYCCP_approved.management_unit_id){
                don_vi_yc = management_unit.management_unit_name;
            }
            if(management_unit.management_unit_id == newDeliveryBillCreated.address_department){
                receiving_address = management_unit.management_unit_name;
            }
        })

        //Lấy ra loại phôi
        let loai_phoi = '';
        allDiplomaName?.forEach((diplomaName)=>{
            if(_idYCCP_approved.diploma_name_id == diplomaName.diploma_name_id){
                loai_phoi = diplomaName.diploma_name_name;
            }
        })

        //Lấy ra số seri để điền vào phiếu xuất kho
        let resultSeri = '';
        for(let i = 0; i<newDeliveryBillCreated.seri_number_start.length-1; i++){
            resultSeri+=`${handleSeri(seri_number_start[i])} - ${handleSeri(seri_number_end[i])}, `;
        }
        resultSeri+=`${handleSeri(seri_number_start[seri_number_start.length-1])} - ${handleSeri(seri_number_end[seri_number_end.length-1])}`;

        //Step 2: gửi mail
        for(let i = 0; i<allUserSecretary.length; i++){
            try{
                const mailOptions = {
                    to: allUserSecretary[i].email,
                    subject: "Đã in phôi theo yêu cầu xin cấp phôi",
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
                        Phôi đã được in theo yêu cầu xin cấp phôi
                      </h1>
                      <hr />
                      <h3 style="text-align: center;">Chi tiết yêu cầu</h3>
                      <div style="padding: 0px 25px 10px 25px;">
                        <div>Mã phiếu: #${_idYCCP_approved.embryoIssuanceRequest_id}</div>
                        <div style="margin-top: 10px;">
                          Đơn vị yêu cầu: ${don_vi_yc}
                        </div>
                        <div style="margin-top: 10px;">
                          Loại phôi cần cấp: ${loai_phoi}
                        </div>
                        <div style="margin-top: 10px;">
                          Đợt thi/đợt cấp bằng: ${handleDateToDMY(_idYCCP_approved.examination)}
                        </div>
                        <div style="margin-top: 10px;">
                          Số lượng phôi cần cấp: ${_idYCCP_approved.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_idYCCP_approved.mscb}
                        </div>
                        <div style="margin-top: 10px;">
                          Thời gian tạo: ${handleDateToDMY(_idYCCP_approved.time)}
                        </div>
                      </div>
                      <hr />
                      <h3 style="margin-top: 15px; text-align: center;">
                        Chi tiết phiếu xuất kho
                      </h3>
                      <div style="padding: 0px 25px 10px 25px;">
                        <div>Số phiếu xuất kho: ${newDeliveryBillCreated.delivery_bill}</div>
                        <div style="margin-top: 10px;">Ngày tạo phiếu: ${handleDateToDMY(newDeliveryBillCreated.delivery_bill_creation_time)}</div>
                        <div style="margin-top: 10px;">Người nhận hàng: ${newDeliveryBillCreated.fullname_of_consignee}</div>
                        <div style="margin-top: 10px;">
                          Địa chỉ (bộ phận) nhận hàng: ${receiving_address}
                        </div>
                        <div style="margin-top: 10px;">
                          Lý do xuất: ${newDeliveryBillCreated.reason}
                        </div>
                        <div style="margin-top: 10px;">
                          Kho xuất: ${newDeliveryBillCreated.export_warehouse}
                        </div>
                        <div style="margin-top: 10px;">
                          Địa điểm xuất: ${newDeliveryBillCreated.address_export_warehouse}
                        </div>
                        <div style="margin-top: 10px;">
                          Loại phôi: ${loai_phoi}
                        </div>
                        <div style="margin-top: 10px;">
                          Số lượng phôi xuất: ${newDeliveryBillCreated.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Số seri: ${resultSeri}
                        </div>
                        <div style="margin-top: 10px;">
                          Đơn giá mỗi phôi: ${newDeliveryBillCreated.unit_price}
                        </div>
                        <div style="margin-top: 10px;">
                          Thành tiền: ${newDeliveryBillCreated.unit_price*newDeliveryBillCreated.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Người tạo phiếu xuất kho: ${user.fullname} / ${user.mssv_cb}
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
            }catch(error){
                console.log(error);
                return;
            }
        }

        //Gửi mail cho tài khoản của Giám đốc Trung tâm/Trưởng phòng tạo yêu cầu. 
        try{
            const mailOptions = {
                to: email_cb_tao_yc,
                    subject: "Đã in phôi theo yêu cầu xin cấp phôi",
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
                        Phôi đã được in theo yêu cầu xin cấp phôi
                      </h1>
                      <hr />
                      <h3 style="text-align: center;">Chi tiết yêu cầu</h3>
                      <div style="padding: 0px 25px 10px 25px;">
                        <div>Mã phiếu: #${_idYCCP_approved.embryoIssuanceRequest_id}</div>
                        <div style="margin-top: 10px;">
                          Đơn vị yêu cầu: ${don_vi_yc}
                        </div>
                        <div style="margin-top: 10px;">
                          Loại phôi cần cấp: ${loai_phoi}
                        </div>
                        <div style="margin-top: 10px;">
                          Đợt thi/đợt cấp bằng: ${handleDateToDMY(_idYCCP_approved.examination)}
                        </div>
                        <div style="margin-top: 10px;">
                          Số lượng phôi cần cấp: ${_idYCCP_approved.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Người tạo yêu cầu: ${ten_cb_tao_yc} / ${_idYCCP_approved.mscb}
                        </div>
                        <div style="margin-top: 10px;">
                          Thời gian tạo: ${handleDateToDMY(_idYCCP_approved.time)}
                        </div>
                      </div>
                      <hr />
                      <h3 style="margin-top: 15px; text-align: center;">
                        Chi tiết phiếu xuất kho
                      </h3>
                      <div style="padding: 0px 25px 10px 25px;">
                        <div>Số phiếu xuất kho: ${newDeliveryBillCreated.delivery_bill}</div>
                        <div style="margin-top: 10px;">Ngày tạo phiếu: ${handleDateToDMY(newDeliveryBillCreated.delivery_bill_creation_time)}</div>
                        <div style="margin-top: 10px;">Người nhận hàng: ${newDeliveryBillCreated.fullname_of_consignee}</div>
                        <div style="margin-top: 10px;">
                          Địa chỉ (bộ phận) nhận hàng: ${receiving_address}
                        </div>
                        <div style="margin-top: 10px;">
                          Lý do xuất: ${newDeliveryBillCreated.reason}
                        </div>
                        <div style="margin-top: 10px;">
                          Kho xuất: ${newDeliveryBillCreated.export_warehouse}
                        </div>
                        <div style="margin-top: 10px;">
                          Địa điểm xuất: ${newDeliveryBillCreated.address_export_warehouse}
                        </div>
                        <div style="margin-top: 10px;">
                          Loại phôi: ${loai_phoi}
                        </div>
                        <div style="margin-top: 10px;">
                          Số lượng phôi xuất: ${newDeliveryBillCreated.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Số seri: ${resultSeri}
                        </div>
                        <div style="margin-top: 10px;">
                          Đơn giá mỗi phôi: ${newDeliveryBillCreated.unit_price}
                        </div>
                        <div style="margin-top: 10px;">
                          Thành tiền: ${newDeliveryBillCreated.unit_price*newDeliveryBillCreated.numberOfEmbryos}
                        </div>
                        <div style="margin-top: 10px;">
                          Người tạo phiếu xuất kho: ${user.fullname} / ${user.mssv_cb}
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
    
    function scrollToDetailRequest(){
        setTimeout(()=>{
            document.body.scrollTop = 960;
            document.documentElement.scrollTop = 960;
        },200)
    }

    //Xử lý việc lấy chi tiết phiếu xuất kho
    const [showDeliveryBill, setShowDeliveryBill] = useState(false);
    const [detailDeliveryBill, setDetailDeliveryBill] = useState([]);

    const [closeButtonDeliveryBill, setCloseButtonDeliveryBill] = useState(null);

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
                <div id='body-stocker' className="container">
                    <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                        <div className="card pb-3">
                            <div className="row p-3">
                                <div className="col-6">
                                    <Select
                                        id='select-management-unit-handle-request-stocker'
                                        options={optionsOfSelectMU}
                                        value={selectedMU}
                                        onChange={handleChangeSelectedMU}
                                    />
                                </div>
                                <div className="col-6">
                                    <Select
                                        id='select-diploma-name-handle-request-stocker'
                                        options={optionsOfSelectedDiplomaName}
                                        value={selectedDiplomaName}
                                        onChange={handleChangeSelectedDiplomaName}
                                    />
                                </div>
                            </div>
                            <div className="row p-3">
                                <div className="col-6">
                                    <input 
                                        type="text" 
                                        placeholder='Tìm kiếm theo mã phiếu'
                                        className='form-control'
                                        value={inputSearchMaPhieu}
                                        onChange={(e)=>{
                                            setInputSearchMaPhieu(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="col-6">
                                    <Select
                                        id='select-status-handle-request-stocker'
                                        options={
                                            [
                                                {value: "", label: "Tất cả trạng thái"},
                                                {value: "Đã gửi thủ kho", label:"Đã gửi thủ kho"},
                                                {value: "Đã in phôi", label: "Đã in phôi"},
                                                {value: "Đã dán tem", label: "Đã dán tem"},
                                                {value: "Đã nhận phôi", label: "Đã nhận phôi"}
                                            ]
                                        }
                                        value={selectedStatus}
                                        onChange={handleChangeSelectedStatus}
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <p className='title-list-yc-xin-cap-phoi'>DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI CẦN XỬ LÝ</p>
                            </div>
                            <div className="row mt-3 p-3">
                                <div id='contain-yccp-need-processed'>
                                    <table className='table table-striped table-hover table-bordered' style={{width: '1900px', border: '2px solid #fed25c'}}>
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
                                                <th style={{textAlign: 'center', backgroundColor: '#fed25c'}} scope="col">
                                                    Tạo phiếu xuất kho
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allYCCP_Panigate?.map((currentValue, index) => {
                                                    //Lấy ra tên văn bằng
                                                    let ten_van_bang;
                                                    let loai_van_bang;
                                                    let options;
                                                    let don_gia_moi_phoi = 0;
                                                    allDiplomaName?.forEach((diplomaName)=>{
                                                        if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                            ten_van_bang = diplomaName.diploma_name_name;
                                                            allDiplomaType?.forEach((diplomaType)=>{
                                                                if(diplomaType.diploma_type_id == diplomaName.diploma_type_id){
                                                                    loai_van_bang = diplomaType.diploma_type_name;
                                                                }
                                                            })
                                                            options = diplomaName.options;
                                                            don_gia_moi_phoi = diplomaName.unit_price;
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
                                                        <tr style={{textAlign: 'center'}} key={index}>
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
                                                                    currentValue.status == "Đã gửi thủ kho" ? (
                                                                        //nút tạo phiếu xuất kho
                                                                        <i 
                                                                            className="fa-solid fa-pen-to-square"
                                                                            style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                            data-bs-toggle="modal" data-bs-target="#createDeliveryBillModal"
                                                                            onClick={(e)=>{
                                                                                setEmbryoIssuanceRequest_id_delivery_bill(currentValue.embryoIssuanceRequest_id);
                                                                                setEmbryo_type(currentValue.diploma_name_id);
                                                                                setEmbryo_typeShow(ten_van_bang);
                                                                                set_idYCCP_approved(currentValue);
                                                                                setAddress_department(currentValue.management_unit_id)
                                                                                setAddress_departmentShow(don_vi_quan_ly);
                                                                                setNumberOfEmbryos(currentValue.numberOfEmbryos);
                                                                                setFullname_of_consignee(ten_can_bo_tao_yc);
                                                                                //Lấy lý do xuất kho
                                                                                setReason(`Cấp ${currentValue.numberOfEmbryos} phôi ${ten_van_bang}`);
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
                                                                                getDetailDeliveryBill(currentValue.embryoIssuanceRequest_id);
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
                                </div>

                                {/* Modal tạo phiếu xuất kho */}
                                <div className="modal fade" id="createDeliveryBillModal" tabIndex="-1" aria-labelledby="createDeliveryBillModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="createDeliveryBillModalLabel">Tạo mới phiếu xuất kho</h1>
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
                                                            setFullname_of_consignee(e.target.value);
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
                                                            setAddress_departmentShow(e.target.value);
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
                                                        value={numberOfEmbryos}                                                            
                                                        className='form-control'
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
                                                        value={unit_price}                                                            
                                                        className='form-control'
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
                                                            setInputSeriNumberStart(parseInt(e.target.value))
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
                                                        onChange={(e)=>{
                                                            setInputSeriNumberEnd(parseInt(e.target.value))
                                                        }}
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
                                                className="btn" 
                                                style={{backgroundColor:'#1b95a2'}}
                                                onClick={(e)=>{
                                                    handleCreateDeliveryBill();
                                                }}
                                            >Tạo mới</button>
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
                                    ></DetailRequest>
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
                <Toast
                    message="Tạo phiếu xuất kho thành công"
                    type="success"
                    ref={noti}
                />
                <Toast
                    message="Hãy nhập đầy đủ số seri yêu cầu"
                    type="warning"
                    ref={noti2}
                />
                <Toast
                    message="Hãy nhập kho xuất"
                    type="warning"
                    ref={noti3}
                />
                <Toast
                    message={`Hãy nhập số seri bắt đầu lớn hơn hoặc bằng ${lowestSerialNumber}`}
                    type="warning"
                    ref={noti4}
                />
                <Toast
                    message="Số seri kết thúc phải lớn hơn số seri bắt đầu"
                    type="warning"
                    ref={noti5}
                />
                <Toast
                    message="Trong dãy số seri được nhập có số seri của phôi hư, vui lòng nhập số khác"
                    type="warning"
                    ref={noti6}
                />
            <Footer/>
        </>        
    )
}
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
                if(currentValue.status != "Đã gửi yêu cầu" && currentValue.status != "Đã duyệt yêu cầu"){
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
    const [seriStartInPhieuYC, setSeriStartInPhieuYC] = useState("");
    const [seriEndInPhieuYC, setSeriEndInPhieuYC] = useState("");
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
    const [address_export_warehouse, setAddress_export_warehouse] = useState("");
    
    const [embryo_type, setEmbryo_type] = useState("");
    const [embryo_typeShow, setEmbryo_typeShow] = useState("");
    
    const [numberOfEmbryos,setNumberOfEmbryos] = useState(0);
    const [unit_price, setUnit_price] = useState(0);

    //_id của yêu cầu xin cấp phôi để cập nhật trạng thái
    const [_idYCCP_approved, set_idYCCP_approved] = useState("");

    const noti = useRef();
    const handleCreateDeliveryBill = async () => {
        const newDeliveryBill = {
            embryoIssuanceRequest_id: parseInt(embryoIssuanceRequest_id_delivery_bill),
            fullname_of_consignee: fullname_of_consignee,
            address_department: parseInt(address_department),
            reason: reason,
            export_warehouse: export_warehouse,
            address_export_warehouse: address_export_warehouse,
            embryo_type: parseInt(embryo_type),
            numberOfEmbryos: parseInt(numberOfEmbryos),
            unit_price: parseInt(unit_price),
            mscb: user.mssv_cb
        }

        try{
            //call api tạo phiếu xuất kho
            const res = await axios.post("http://localhost:8000/v1/delivery_bill/create_delivery_bill", newDeliveryBill);
            
            //call api cập nhật trạng thái yêu cầu xin cấp phôi
            const updateDoc = {
                status: "Đã in phôi"
            }
            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_approved}`,updateDoc);

            noti.current.showToast();
            setTimeout(async()=>{
                await getAllRequestForIssuanceOfEmbryos();
            }, 2000)
        }catch(error){
            console.log(error);
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
                                                {value: "Đã in phôi", label: "Đã in phôi"}
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
                                    <table className='table table-bordered' style={{width: '1900px'}}>
                                        <thead>
                                            <tr>
                                                <th style={{textAlign: 'center'}} scope="col">Mã phiếu</th>
                                                <th style={{textAlign: 'center'}} scope="col">Tên văn bằng</th>
                                                <th style={{textAlign: 'center'}} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                                <th style={{textAlign: 'center'}} scope="col">Số lượng phôi</th>
                                                <th style={{textAlign: 'center'}} scope="col">Số seri</th>
                                                <th style={{textAlign: 'center'}} scope="col">Cán bộ tạo yêu cầu</th>
                                                <th style={{textAlign: 'center'}} scope="col">MSCB</th>
                                                <th style={{textAlign: 'center'}} scope="col">Trạng thái</th>
                                                <th style={{textAlign: 'center'}} scope="col">Xem chi tiết</th>
                                                <th style={{textAlign: 'center'}} scope="col">
                                                    Tạo phiếu xuất kho
                                                </th>
                                                <th style={{textAlign: 'center'}} scope="col">Xem phiếu xuất kho</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allYCCP_Panigate?.map((currentValue, index) => {
                                                    //Lấy ra tên văn bằng
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
                                                            <td style={{textAlign: 'center'}}>{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                            <td>{ten_van_bang}</td>
                                                            <td>{handleDateToDMY(currentValue.examination)}</td>
                                                            <td>{currentValue.numberOfEmbryos}</td>
                                                            <td>{`${handleSeri(currentValue.seri_number_start)} - ${handleSeri(currentValue.seri_number_end)}`}</td>
                                                            <td>{ten_can_bo_tao_yc}</td>
                                                            <td>{currentValue.mscb}</td>
                                                            <td style={{color:"red", fontWeight: 'bold'}}>{currentValue.status}</td>
                                                            <td style={{textAlign: 'center'}}>
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
                                                                                setExaminationsInPhieuYC(currentValue.examination)
                                                                                setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos)
                                                                                setSeriStartInPhieuYC(currentValue.seri_number_start);
                                                                                setSeriEndInPhieuYC(currentValue.seri_number_end);
                                                                                setDiplomaType(loai_van_bang);
                                                                                setOptionsOfDiplomaName(options);
                                                                                getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options)                                                    
                                                                            }}
                                                                        ></i>
                                                                    )
                                                                }
                                                            </td>
                                                            <td style={{textAlign:'center'}}>
                                                                <i 
                                                                    className="fa-solid fa-pen-to-square"
                                                                    style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    data-bs-toggle="modal" data-bs-target="#createDeliveryBillModal"
                                                                    onClick={(e)=>{
                                                                        setEmbryoIssuanceRequest_id_delivery_bill(currentValue.embryoIssuanceRequest_id);
                                                                        setEmbryo_type(currentValue.diploma_name_id);
                                                                        setEmbryo_typeShow(ten_van_bang);
                                                                        set_idYCCP_approved(currentValue._id);
                                                                        setAddress_department(currentValue.management_unit_id)
                                                                        setAddress_departmentShow(don_vi_quan_ly);
                                                                        setNumberOfEmbryos(currentValue.numberOfEmbryos);
                                                                        setFullname_of_consignee(ten_can_bo_tao_yc);
                                                                    }}
                                                                ></i>
                                                            </td>
                                                            <td>Phiếu xuất kho</td>
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
                                            count={Math.ceil(allYCCP?.length/5)}
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
                                        seriStartInPhieuYC={seriStartInPhieuYC}
                                        seriEndInPhieuYC={seriEndInPhieuYC}
                                        diplomaType={diplomaType}
                                        optionsOfDiplomaName={optionsOfDiplomaName}
                                        allDSHVByEIR={allDSHVByEIR}
                                    ></DetailRequest>
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
            <Footer/>
        </>        
    )
}
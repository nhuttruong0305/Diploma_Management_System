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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import Toast from '../Toast/Toast';
export default function ApproveRequestForIssuanceOfEmbryos(){
    const dispatch = useDispatch();
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
    }, [selectedMUARFIOE, selectedSelectDiplomaNameARFIOE])
    
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
        if(page!=undefined && allRequestForIssuanceOfEmbryosShow!=undefined){
            if(allRequestForIssuanceOfEmbryosShow.length>5){
                const numberOfPage = Math.ceil(allRequestForIssuanceOfEmbryosShow?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allRequestForIssuanceOfEmbryosShow.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allRequestForIssuanceOfEmbryosShow[i]];
                }
                setAllYCCP_PT(result);
            }else{
                setAllYCCP_PT(allRequestForIssuanceOfEmbryosShow);
            }         
        }
    }, [page, allRequestForIssuanceOfEmbryosShow])
    
    //State và xử lý logic hiện chi tiết yêu cầu cấp phôi và danh sách học viên kèm theo
    //State để ẩn hiện chi tiết yêu cầu
    const [showDetailRequest, setShowDetailRequest] = useState(false); 

    //State để lấy dữ liệu chi tiết yêu cầu và điền vào mẫu xin cấp phôi
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
    //state chứa danh sách học viên được hiển thị ra màn hình khi phân trang
    const [allDSHVByEIRShow, setAllDSHVByEIRShow] = useState([]);

    const [pageDSHV, setPageDSHV] = useState(1);
    const handleChangePageDSHV = (event, value) => {
        setPageDSHV(value);
    };

    useEffect(()=>{
        if(pageDSHV!=undefined && allDSHVByEIR!=undefined){
            if(allDSHVByEIR.length>5){
                const numberOfPage = Math.ceil(allDSHVByEIR?.length/5);
                const startElement = (pageDSHV - 1) * 5;
                let endElement = 0;
                if(pageDSHV == numberOfPage){
                    endElement = allDSHVByEIR.length-1;
                }else{
                    endElement = pageDSHV * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allDSHVByEIR[i]];
                }
                setAllDSHVByEIRShow(result);
            }else{
                setAllDSHVByEIRShow(allDSHVByEIR);
            }         
        }
    }, [pageDSHV, allDSHVByEIR])

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
    
    //Hàm xuất yêu cầu cấp phôi
    const convertToImage = async () => {
        const element = document.getElementById("file-name-ARFIOE"); // Thay "your-element-id" bằng ID của phần muốn chuyển đổi
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        // Bây giờ bạn có một hình ảnh dưới dạng dữ liệu chuỗi, có thể lưu nó hoặc sử dụng nó dựa trên nhu cầu.
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 277); // Chèn hình ảnh vào PDF
    
        pdf.save("yc_cap_phoi.pdf");
    };

    //Hàm xuất file excel danh sách học viên kèm theo
    const downloadDSHV = () => {
        // Tạo dữ liệu bạn muốn đưa vào tệp Excel
        const alphabet = ["G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1"];
        const ascending = optionsOfDiplomaName.slice().sort((a, b) => a - b);
       
        const options1 = [
            'Điểm trắc nghiệm',
            'Điểm thực hành', 
            'Điểm kỹ năng nghe',
            'Điểm kỹ năng nói',
            'Điểm kỹ năng đọc', 
            'Điểm kỹ năng viết',
            'Ngày thi',
            'Năm tốt nghiệp',
            'Xếp loại',
            'Ngành đào tạo',
            'Hội đồng thi',
        ]
        
        // Tạo một Workbook và một Worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allDSHVByEIR);

        worksheet['A1'] = { v: 'STT', t: 's' };
        worksheet['B1'] = { v: 'Họ tên người được cấp', t: 's' };
        worksheet['C1'] = { v: 'Giới tính', t: 's' };
        worksheet['D1'] = { v: 'Ngày sinh', t: 's' };
        worksheet['E1'] = { v: 'Nơi sinh', t: 's' };
        worksheet['F1'] = { v: 'CCCD', t: 's' };

        for(let i = 0; i<ascending?.length; i++){
            worksheet[alphabet[i]] = { v: options1[ascending[i]-1], t: 's' }; 
        }
        
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

    //Xử lý logic việc duyệt yêu cầu cấp phôi
    //State chứa _id của yêu cầu cấp phôi sẽ được duyệt
    const [_idYCCP_approved, set_idYCCP_approved] = useState("");

    const noti = useRef();
    //Hàm duyệt yêu cầu cấp phôi
    const handleApproveRequest = async () => {
        try{
            const updateDoc = {
                status: "Đã duyệt yêu cầu"
            }

            const updateStatus = await axios.put(`http://localhost:8000/v1/embryo_issuance_request/update_status_yccp/${_idYCCP_approved}`,updateDoc);
            noti.current.showToast();
            await getAllRequestForIssuanceOfEmbryos();
        }catch(error){
            console.log(error);
        }
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
                            <div className='title-list-yc-xin-cap-phoi'>
                                DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI
                            </div>
                            <div className="row p-5">
                                <div id='contain-yc-xin-cap-phoi-ARFIOE'>
                                    <table className='table table-bordered' style={{width: '1700px'}}>
                                        <thead>
                                            <tr>
                                                <th style={{textAlign: 'center'}} scope="col">STT</th>
                                                <th style={{textAlign: 'center'}} scope="col">Tên văn bằng</th>
                                                <th style={{textAlign: 'center'}} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                                <th style={{textAlign: 'center'}} scope="col">Số lượng phôi</th>
                                                <th style={{textAlign: 'center'}} scope="col">Số seri</th>

                                                <th style={{textAlign: 'center'}} scope="col">Cán bộ tạo yêu cầu</th>
                                                <th style={{textAlign: 'center'}} scope="col">MSCB</th>

                                                <th style={{textAlign: 'center'}} scope="col">Trạng thái</th>
                                                <th style={{textAlign: 'center'}} scope="col">Xem chi tiết</th>
                                                <th style={{textAlign: 'center'}} scope="col">Duyệt yêu cầu</th>
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

                                                    const startSeri = handleSeri(currentValue.seri_number_start);
                                                    const endSeri = handleSeri(currentValue.seri_number_end);
                                                    return(
                                                        <tr key={index}>
                                                            <th style={{textAlign: 'center'}}>{index + 1}</th>
                                                            <td>{ten_van_bang}</td>
                                                            <td>{handleDateToDMY(currentValue.examination)}</td>
                                                            <td>{currentValue.numberOfEmbryos}</td>
                                                            <td>{`${startSeri} - ${endSeri}`}</td>
                                                            
                                                            <td>{ten_can_bo_tao_yc}</td>
                                                            <td>{currentValue.mscb}</td>

                                                            <td>{currentValue.status}</td>
                                                            <td style={{textAlign: 'center'}}>{
                                                                <i 
                                                                    className="fa-solid fa-eye"
                                                                    style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}  
                                                                    onClick={(e)=>{
                                                                        setShowDetailRequest(true)
                                                                        allManagementUnit?.forEach((management_unit)=>{
                                                                            if(management_unit.management_unit_id == currentValue.management_unit_id){
                                                                                setManagementUnitPhieuYC(management_unit.management_unit_name);
                                                                            }
                                                                        })
                                                                        setDiplomaNameInPhieuYC(ten_van_bang);
                                                                        setExaminationsInPhieuYC(handleDateToDMY(currentValue.examination));
                                                                        setNumberOfEmbryosInPhieuYC(currentValue.numberOfEmbryos);
                                                                        setSeriStartInPhieuYC(startSeri);
                                                                        setSeriEndInPhieuYC(endSeri);
                                                                        setDiplomaType(loai_van_bang);

                                                                        setOptionsOfDiplomaName(options);
                                                                        getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options)
                                                                    }}                                                              
                                                                ></i>
                                                            }</td>
                                                            <td style={{textAlign: 'center'}}>    
                                                                <i 
                                                                    className="fa-solid fa-check"
                                                                    style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target="#approveRequestModal"
                                                                    onClick={(e)=>{
                                                                        set_idYCCP_approved(currentValue._id)
                                                                    }}
                                                                ></i>
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
                                            <h1 className="modal-title fs-5" id="approveRequestModalLabel"></h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <h5>Bạn có chắc muốn duyệt yêu cầu xin cấp phôi này</h5>
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
                                        </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="d-flex justify-content-center mt-3">
                                    <Stack spacing={2}>
                                        <Pagination 
                                            count={Math.ceil(allRequestForIssuanceOfEmbryosShow?.length/5)}
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
                                        <div className='row'>
                                            <p style={{textAlign:'center', fontSize: '27px', color:"#1b95a2", fontWeight: 'bold'}}>CHI TIẾT YÊU CẦU</p>
                                            <div className="d-flex justify-content-center">                
                                                <div id="show-file-name-ARFIOE">
                                                    <div id="file-name-ARFIOE">
                                                        <div className="d-flex justify-content-between">
                                                            <p style={{fontSize:'21px'}}>TRƯỜNG ĐẠI HỌC CẦN THƠ</p><p style={{fontSize:'21px', fontWeight: 'bold'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                                                        </div>
                                                        <div className="d-flex" style={{marginTop:'-10px'}}>  
                                                            <p style={{fontSize:'21px', fontWeight: 'bold'}}>{managementUnitPhieuYC.toUpperCase()}</p>
                                                            <p style={{textDecoration: 'underline',marginLeft: '270px', fontWeight: 'bold', fontSize:'21px'}}>Độc lập - Tự do- Hạnh phúc</p>
                                                        </div>
                                                        <div style={{fontSize: '21px', marginTop:'-10px', marginLeft: '20px'}}>
                                                            Số:        /TTĐT&TH-BPĐT
                                                        </div>
                                                        <div className="d-flex justify-content-between" style={{marginTop: '45px'}}>
                                                            <div className="col-5" style={{fontSize: '21px', fontStyle:'italic'}}>
                                                                V/v xin mua phôi <span style={{fontWeight:'bold'}}>{diplomaNameInPhieuYC}</span> đợt thi/đợt cấp bằng {examinationsInPhieuYC}
                                                            </div>
                                                            <div className="col-1"></div>
                                                            <div className="col-5" style={{fontSize: '21px', fontStyle:'italic'}}>
                                                                Cần Thơ, ngày … tháng … năm 2023
                                                            </div>
                                                        </div>
                                                        <div style={{textAlign:'center', fontSize: '21px', marginTop:'65px'}}>
                                                            <span style={{fontStyle:'italic'}}>Kính gửi: 	</span><span style={{fontWeight:'bold'}}>TỔ QUẢN LÝ CẤP PHÁT PHÔI VBCC</span>
                                                        </div>
                                                        <div style={{textAlign:'center', fontSize:'21px', fontWeight:'bold'}}>
                                                            TRƯỜNG ĐẠI HỌC CẦN THƠ
                                                        </div>
                                                        <div style={{fontSize: '21px', textIndent:'40px', marginTop: '50px', textAlign:'justify'}}>
                                                            {managementUnitPhieuYC} xin báo cáo tình hình sử dụng phôi và xin cấp phôi {diplomaNameInPhieuYC} đợt thi/đợt cấp bằng {examinationsInPhieuYC}
                                                        </div>
                                                        <div style={{fontSize:'21px', textIndent: '40px', marginTop: '40px', textAlign:'justify'}}>
                                                            Đề nghị Tổ Quản lý VBCC - Trường Đại học Cần Thơ cấp <span style={{fontStyle:'italic'}}>{numberOfEmbryosInPhieuYC}</span> <span style={{fontWeight:'bold'}}>phôi {diplomaNameInPhieuYC}</span> để in {diplomaType.toLowerCase()} cho các thí sinh vào đợt thi/đợt cấp văn bằng như sau:
                                                        </div>
                                                        <div>
                                                            <table id="table-file-name-ARFIOE">
                                                                <thead>
                                                                    <tr>
                                                                        <th style={{textAlign: 'center'}}>{diplomaType}</th>
                                                                        <th style={{textAlign: 'center'}}>Đợt thi/Đợt cấp bằng</th>
                                                                        <th style={{textAlign: 'center'}}>Số lượng thí sinh</th>
                                                                        <th style={{textAlign: 'center'}}>Số seri</th>
                                                                        <th style={{textAlign: 'center'}}>Số cần cấp</th>
                                                                    </tr>
                                                                </thead>    
                                                                <tbody>
                                                                    <tr>
                                                                        <td>{diplomaNameInPhieuYC}</td>
                                                                        <td>{examinationsInPhieuYC}</td>
                                                                        <td>{numberOfEmbryosInPhieuYC}</td>
                                                                        <td>{`${seriStartInPhieuYC}-${seriEndInPhieuYC}`}</td>
                                                                        <td>{numberOfEmbryosInPhieuYC}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style={{fontWeight: 'bold'}} colSpan={4}>Tổng cộng</td>
                                                                        <td style={{fontWeight: 'bold'}}>{numberOfEmbryosInPhieuYC}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div style={{textIndent: '30px', fontSize: '21px', marginTop:'35px'}}>Trân trọng kính chào.</div>
                                                        <div style={{marginTop: '40px', fontSize: '21px', marginLeft: '700px'}}>GIÁM ĐỐC</div>
                                                        <div style={{marginTop: '30px', textIndent: '40px', fontSize: '21px', fontWeight: 'bold', fontStyle: 'italic'}}>Nơi nhận</div>
                                                        <div style={{fontSize: '21px', textIndent: '25px'}}>- Như trên;</div>
                                                        <div style={{fontSize: '21px', textIndent: '25px'}}>- Lưu VP.</div>
                                                    </div>            
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex mt-4 justify-content-end">
                                            <div>
                                                <button
                                                    className="btn"
                                                    onClick={(e) => {
                                                        convertToImage();
                                                    }}
                                                    style={{width: '100px', backgroundColor: '#1b95a2'}}    
                                                    >
                                                        Xuất file
                                                </button>
                                            </div>
                                            <div style={{marginRight: '90px'}}>
                                                <button
                                                    className='btn btn-danger ms-3'  
                                                    onClick={(e)=>{
                                                        setShowDetailRequest(false);
                                                    }}
                                                >
                                                    Hủy bỏ
                                                </button>
                                            </div>
                                        </div>

                                        <div className='title-list-yc-xin-cap-phoi'>
                                            DANH SÁCH HỌC VIÊN KÈM THEO
                                        </div>

                                        <div className="row p-5">
                                            <div id="contain-table-show-dshv-ARFIOE">
                                                <table className='table table-bordered'>
                                                    <thead>
                                                        <tr>
                                                            <th style={{textAlign: 'center'}} scope="col">STT</th>
                                                            <th style={{textAlign: 'center'}} scope="col">Họ tên người được cấp</th>
                                                            <th style={{textAlign: 'center'}} scope="col">Giới tính</th>
                                                            <th style={{textAlign: 'center'}} scope="col">Ngày sinh (M/D/Y)</th>
                                                            <th style={{textAlign: 'center'}} scope="col">Nơi sinh</th>
                                                            <th style={{textAlign: 'center'}} scope="col">CCCD</th>

                                                            {
                                                            optionsOfDiplomaName?.includes(1) ? (
                                                                <th style={{textAlign: 'center'}} scope="col">Điểm trắc nghiệm</th>
                                                            ) : (
                                                                ""
                                                            )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(2) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Điểm thực hành</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(3) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Điểm kỹ năng nghe</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(4) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Điểm kỹ năng nói</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(5) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Điểm kỹ năng đọc</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(6) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Điểm kỹ năng viết</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(7) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Ngày thi (M/D/Y)</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(8) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Năm tốt nghiệp</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(9) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Xếp loại</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(10) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Ngành đào tạo</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }
                                                            {
                                                                optionsOfDiplomaName?.includes(11) ? (
                                                                    <th style={{textAlign: 'center'}} scope="col">Hội đồng thi</th>
                                                                ) : (
                                                                    ""
                                                                )
                                                            }

                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            allDSHVByEIRShow?.map((currentValue, index)=>{
                                                                return(
                                                                    <tr key={index}>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>{currentValue.fullname}</td>
                                                                        <td>{currentValue.sex}</td>
                                                                        <td>{currentValue.dateOfBirth}</td>
                                                                        <td>{currentValue.address}</td>
                                                                        <td>{currentValue.CCCD}</td>

                                                                        {
                                                                        optionsOfDiplomaName?.includes(1) ? (
                                                                            <td>{currentValue.diem_tn}</td>
                                                                        ) : (
                                                                            ""
                                                                        )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(2) ? (
                                                                                <td>{currentValue.diem_th}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(3) ? (
                                                                                <td>{currentValue.nghe}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(4) ? (
                                                                                <td>{currentValue.noi}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(5) ? (
                                                                                <td>{currentValue.doc}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(6) ? (
                                                                                <td>{currentValue.viet}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(7) ? (
                                                                                <td>{currentValue.test_day}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(8) ? (
                                                                                <td>{currentValue.graduationYear}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(9) ? (
                                                                                <td>{currentValue.classification}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(10) ? (
                                                                                <td>{currentValue.nganh_dao_tao}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }
                                                                        {
                                                                            optionsOfDiplomaName?.includes(11) ? (
                                                                                <td>{currentValue.council}</td>
                                                                            ) : (
                                                                                ""
                                                                            )
                                                                        }

                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="d-flex justify-content-center mt-3">
                                                <Stack spacing={2}>
                                                    <Pagination 
                                                        count={Math.ceil(allDSHVByEIR?.length/5)}
                                                        variant="outlined"
                                                        page={pageDSHV}
                                                        onChange={handleChangePageDSHV}
                                                        color="info"
                                                        />
                                                </Stack>
                                            </div>

                                            <div className='d-flex justify-content-end'>
                                                <button 
                                                    onClick={(e)=>{
                                                        downloadDSHV()
                                                    }}
                                                    className='btn'
                                                    style={{backgroundColor: '#1b95a2', marginRight:'40px'}}
                                                >Xuất file</button>
                                            </div>
                                        </div>
                                    </>
                                ) : ("")
                            }
                        </div>
                    </div>
                </div>
                <Toast
                    message="Duyệt yêu cầu cấp phôi thành công"
                    type="success"
                    ref={noti}
                />
            <Footer/>
        </>
    )
} 
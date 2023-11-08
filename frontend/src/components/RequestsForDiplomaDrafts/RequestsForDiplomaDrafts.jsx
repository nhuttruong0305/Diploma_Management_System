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
            numberOfEmbryos: numberOfEmbryos,
            mscb: user.mssv_cb
        }

        try{
            const result1 = await axios.post("http://localhost:8000/v1/embryo_issuance_request/add_new_embryoIssuanceRequest", newYCCapPhoi, {
                headers: {token: `Bearer ${user.accessToken}`}
            })
        }catch(error){
            console.log(error);
        }

        for(let j = 0; j<allDataInExcel.length; j++){
            try{
                const result2 = await axios.post(`http://localhost:8000/v1/DSHV/add_student`, allDataInExcel[j],{
                    headers: {token: `Bearer ${user.accessToken}`}
                })
            }catch(error){
                console.log(error);
            }
        }
        noti6.current.showToast(); 
        await getAllEIR(allDiplomaNameByMU);
    }

    //Phần dưới chứa state và logic xử lý phần hiển thị các yêu cầu cấp phôi văn bằng
    const [selectedSelectDiplomaNameSearchRFDD, setSelectedSelectDiplomaNameSearchRFDD] = useState("");
    const handleChangeSelectedSelectDiplomaNameSearchRFDD = (selectedOption) => {
        setSelectedSelectDiplomaNameSearchRFDD(selectedOption);
    }

    //State để ẩn hiện chi tiết yêu cầu
    const [showRequestDetail, setShowRequestDetail] = useState(false);
    //State để tạo nút đóng
    const [closeButton, setCloseButton] = useState(null);

    useEffect(()=>{
        getAllEIR(allDiplomaNameByMU);
    }, [allDiplomaNameByMU])

    //State để lọc ra các yêu cầu nếu chọn tên văn bằng tại select có id = select-diploma-name-search-RFDD
    const [allEIRShow, setAllEIRShow] = useState([]);
    
    useEffect(()=>{
        if(selectedSelectDiplomaNameSearchRFDD.value!=undefined){
            let result = [];
            allEIR?.forEach((element)=>{
                if(element.diploma_name_id == selectedSelectDiplomaNameSearchRFDD.value){
                    result = [...result, element];
                }
            })
            setAllEIRShow(result);
        }
    }, [selectedSelectDiplomaNameSearchRFDD])
    const handleSeri = (seriNumber) => {//xóa
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

    const handleDateToDMY = (date) => {//xóa
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    const handleDateToMDY = (date) => {//xóa
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
    const [seriStartInPhieuYC, setSeriStartInPhieuYC] = useState("");
    const [seriEndInPhieuYC, setSeriEndInPhieuYC] = useState("");
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
                                                    <div className="col-4">Tên văn bằng</div>
                                                    <div className="col-8">
                                                        <Select
                                                            id='select-diplomaName-RFDD'
                                                            placeholder="Chọn tên văn bằng"
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
                            <div className='col-6'>
                                <Select
                                    id='select-diploma-name-search-RFDD'
                                    options={optionSelectDiplomaNameRFDD}
                                    onChange={handleChangeSelectedSelectDiplomaNameSearchRFDD}
                                    value={selectedSelectDiplomaNameSearchRFDD}
                                    placeholder="Chọn tên văn bằng"
                                />
                            </div>
                        </div>
                        <div className='title-list-yc-xin-cap-phoi'>
                            DANH SÁCH CÁC YÊU CẦU XIN CẤP PHÔI
                        </div>
                        <div className='row p-5'>
                            <div id='contain-table-show-yc-xin-cap-phoi'>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center'}} scope="col">Mã phiếu</th>
                                            <th style={{textAlign: 'center'}} scope="col">Tên văn bằng</th>
                                            <th style={{textAlign: 'center'}} scope="col">Đợt thi/Đợt cấp văn bằng</th>
                                            <th style={{textAlign: 'center'}} scope="col">Số lượng phôi</th>
                                            <th style={{textAlign: 'center'}} scope="col">Số seri</th>
                                            <th style={{textAlign: 'center'}} scope="col">Trạng thái</th>
                                            <th style={{textAlign: 'center'}} scope="col">Xem chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allEIRShow?.map((currentValue, index)=>{
                                                let seriStartAfterProcess = handleSeri(currentValue.seri_number_start);
                                                let seriEndAfterProcess = handleSeri(currentValue.seri_number_end);
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
                                                return(
                                                    <tr style={{textAlign: 'center'}} key={index}>
                                                        <td scope="row">{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                        <td>{diplomaName}</td>
                                                        <td>{handleDateToDMY(currentValue.examination)}</td>
                                                        <td>{currentValue.numberOfEmbryos}</td>
                                                        <td>{seriStartAfterProcess} - {seriEndAfterProcess}</td>
                                                        <td style={{color:"red", fontWeight: 'bold'}}>{currentValue.status}</td>
                                                        <td>
                                                            {
                                                                closeButton == index ? (
                                                                    <i 
                                                                        style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                        class="fa-regular fa-circle-xmark"
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
                                                                            setSeriStartInPhieuYC(currentValue.seri_number_start);
                                                                            setSeriEndInPhieuYC(currentValue.seri_number_end);
                                                                            setOptionsOfDiplomaName(optionsOfDiplomaName);
                                                                            getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, optionsOfDiplomaName)
                                                                        }}
                                                                        >
                                                                    </i>
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
                        {
                            showRequestDetail ? (
                                <>
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
                                </>
                            ) : (
                                <></>
                            )
                        }
                        
                    </div>
                </div>
            </div>
            
            <Footer/>
            <Toast
                message="Vui lòng chọn tên văn bằng"
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
        </>
    )
}
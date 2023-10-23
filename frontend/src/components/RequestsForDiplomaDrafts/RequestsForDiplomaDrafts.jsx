import './RequestsForDiplomaDrafts.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import EmbryoGrantApplicationForm from './EmbryoGrantApplicationForm';
import Select from "react-select";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Toast from '../Toast/Toast';
export default function RequestsForDiplomaDrafts(){
    const user = useSelector((state) => state.auth.login?.currentUser);

    //State để ẩn hiện form điền dữ liệu tạo yêu cầu
    const [showFormAddYC, setShowFormAddYC] = useState(false);

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
                name:"",
                sex:"",
                dateofbirth:"",
                address:"",
                CCCD:"",
                testDay:"",
                Council:"",
                classification:""
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
        worksheet['G1'] = { v: 'Ngày kiểm tra', t: 's' };
        worksheet['H1'] = { v: 'Hội đồng thi', t: 's' };
        worksheet['I1'] = { v: 'Xếp loại', t: 's' };

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
        link.download = 'output.xlsx';

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

    //State để lưu các học viên được lấy ra từ collection dshvs để kiểm tra trùng CCCD
    const [dshvByDiplomaName, setDSHVByDiplomaName] = useState([]);

    //Hàm lấy ra danh sách học viên từ collection dshvs theo trường diploma_name_id
    const getDSHVByDiplomaNameID = async (diploma_name_id) => {
        try{
            const result = await axios.get(`http://localhost:8000/v1/DSHV/get_DSHV_by_diplomaNameId/${diploma_name_id}`);
            setDSHVByDiplomaName(result.data);
        }catch(error){
            console.log(error);
        }        
    }

    useEffect(()=>{
        if(selectedSelectDiplomaNameRFDD != ""){
            getDSHVByDiplomaNameID(selectedSelectDiplomaNameRFDD?.value);
        }
    }, [selectedSelectDiplomaNameRFDD])
    
    //state lưu mảng các dòng trùng CCCD trong file excel
    const [danhSachTrungCCCD, setdanhSachTrungCCCD] = useState([]);

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
        
        //Biến này sẽ là true nếu có 1 dòng trong file excel bị trùng CCCD
        let isFault = false;
        //Danh sách STT dòng bị trùng CCCD
        let listTrungCCCD = [];

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
            //Xử lý ngày kiểm tra
            const dateTestDay = new Date((data[i][6] - 25569) * 86400 * 1000);
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

            //Kiểm tra xem có dòng nào trong file excel trùng CCCD không
            dshvByDiplomaName?.forEach((currentValue)=>{
                if(currentValue.CCCD == data[i][5]){
                    listTrungCCCD = [...listTrungCCCD, i];
                    isFault = true;
                }
            })
            setdanhSachTrungCCCD(listTrungCCCD);

            const newHVObject = {
                fullname: data[i][1],
                sex: data[i][2],
                dateOfBirth: `${dateOfBirthExcel.getFullYear()}-${monthdateOfBirthExcel}-${daydateOfBirthExcel}`,
                address: data[i][4],
                CCCD: data[i][5],
                test_day: `${dateTestDay.getFullYear()}-${monthDateTestDay}-${dayDateTestDay}`,
                council: data[i][7],
                classification: data[i][8]
            }
            allDataInExcel = [...allDataInExcel, newHVObject];
        }

        if(isFault){
            return;
        }else{
            const newYCCapPhoi = {
                management_unit_id: user?.management_unit,
                diploma_name_id: selectedSelectDiplomaNameRFDD?.value,
                diploma_name_name: selectedSelectDiplomaNameRFDD?.label,
                examination: examination,
                numberOfEmbryos: numberOfEmbryos
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
                    const result2 = await axios.post(`http://localhost:8000/v1/DSHV/add_student/${selectedSelectDiplomaNameRFDD?.value}`, allDataInExcel[j],{
                        headers: {token: `Bearer ${user.accessToken}`}
                    })
                }catch(error){
                    console.log(error);
                }
            }
            noti6.current.showToast();
        }
    }
    useLayoutEffect(()=>{
        if(danhSachTrungCCCD.length>0){
            noti5.current.showToast();
        }
    }, [danhSachTrungCCCD])

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
                                        setShowFormAddYC(!showFormAddYC)
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
                            showFormAddYC ? (
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
                                                    <div className="col-4">Đợt thi</div>
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
                                                    <div className="col-4">Danh sách sinh viên kèm theo</div>
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
                message={`Số CCCD của học viên có STT ${danhSachTrungCCCD} trong file excel đã tồn tại`}
                type="warning"
                ref={noti5}
            />
            <Toast
                message="Tạo yêu cầu thành công"
                type="success"
                ref={noti6}
            />
        </>
    )
}
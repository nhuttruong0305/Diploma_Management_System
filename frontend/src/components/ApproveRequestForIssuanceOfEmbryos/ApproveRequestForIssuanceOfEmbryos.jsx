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
    //State để tạo nút đóng
    const [closeButton, setCloseButton] = useState(null);

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
                                                <th style={{textAlign: 'center'}} scope="col">Mã phiếu</th>
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
                                                        <tr style={{textAlign: 'center'}} key={index}>
                                                            <td>{`#${currentValue.embryoIssuanceRequest_id}`}</td>
                                                            <td>{ten_van_bang}</td>
                                                            <td>{handleDateToDMY(currentValue.examination)}</td>
                                                            <td>{currentValue.numberOfEmbryos}</td>
                                                            <td>{`${startSeri} - ${endSeri}`}</td>
                                                            
                                                            <td>{ten_can_bo_tao_yc}</td>
                                                            <td>{currentValue.mscb}</td>

                                                            <td style={{color:"red", fontWeight: 'bold'}}>{currentValue.status}</td>
                                                            <td>
                                                                {
                                                                    closeButton == index ? (
                                                                        <i 
                                                                            style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width:'32px'}}
                                                                            class="fa-regular fa-circle-xmark"
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
                                                                                setSeriStartInPhieuYC(currentValue.seri_number_start);
                                                                                setSeriEndInPhieuYC(currentValue.seri_number_end);
                                                                                setOptionsOfDiplomaName(options);
                                                                                getAllDSHVByEIR(currentValue.embryoIssuanceRequest_id, options)
                                                                            }}                                                              
                                                                        ></i>
                                                                    )
                                                                }
                                                            </td>
                                                            <td>  
                                                                {
                                                                    currentValue.status == "Đã gửi yêu cầu" ? (
                                                                        <i 
                                                                            className="fa-solid fa-check"
                                                                            style={{backgroundColor: "#fed25c", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                            data-bs-toggle="modal" 
                                                                            data-bs-target="#approveRequestModal"
                                                                            onClick={(e)=>{
                                                                                set_idYCCP_approved(currentValue._id)
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
            <Footer/>
        </>
    )
} 
import './DiplomaReview.css';
import Header from '../Header/Header';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {getAllDiplomaIssuanceByMU, searchDiplomaWithMultiCondition, reviewDiploma } from '../../redux/apiRequest';
import Footer from '../Footer/Footer';
import Toast from '../Toast/Toast';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { Tooltip } from 'react-tippy';
export default function DiplomaReview(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    // 1. Các biến dùng để tạo và lấy giá trị từ select có id = select-diplomaName-DR
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    const [optionForSelectDiplomaNameDR, setOptionForSelectDiplomaNameDR] = useState([]);
    const [selectedForSelectDiplomaNameDR, setSelectedForSelectDiplomaNameDR] = useState();

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

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma reviewer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            let result = []
            res.data.forEach((currentValue)=>{
                if(user.listOfDiplomaNameReview.includes(currentValue.diploma_name_id)){
                    result = [...result, currentValue];
                }
            })
            setAllDiplomaNameByMU(result);
        }catch(error){
            console.log(error);
        }
    }

    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);

    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllDiplomaNameByMU(user.management_unit);
        getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        getAllMajorsShowModal();
        getAllUserAccount();
        getAllDiploma_XL_Count();
    }, [])

    useEffect(()=>{
        let optionResult = [];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            optionResult = [...optionResult, newOption];
        })
        setOptionForSelectDiplomaNameDR(optionResult);
    }, [allDiplomaNameByMU]);
    
    const handleChangeselectedForSelectDiplomaNameDR = (selectedOption) =>{
        setSelectedForSelectDiplomaNameDR(selectedOption);
    }
    
    // 2. Các biến dùng để tạo và lấy giá trị từ select có id = select-diplomaIssuance-DR
    //state đại diện cho all đợt cấp văn bằng lấy từ redux dùng cho select có id select-diplomaIssuance-DR
    const allDiplomaIssuance = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.allDiplomaIssuances); 
    const [optionForSelectDiplomaIssuanceDR, setOptionForSelectDiplomaIssuanceDR] = useState([]);
    const [selectedForSelectDiplomaIssuanceDR,setSelectedForSelectDiplomaIssuanceDR] = useState();

    const handleChangeselectedForSelectDiplomaIssuanceDR = (selectedOption) => {
        setSelectedForSelectDiplomaIssuanceDR(selectedOption);
    }

    useEffect(()=>{
        let resultOption = [];
        allDiplomaIssuance?.forEach((currentValue)=>{
            if(currentValue.diploma_name_id == selectedForSelectDiplomaNameDR?.value){
                const newOption = { value: currentValue.diploma_issuance_id, label: currentValue.diploma_issuance_name};
                resultOption = [...resultOption, newOption];
            }
        })
        setOptionForSelectDiplomaIssuanceDR(resultOption);
    }, [selectedForSelectDiplomaNameDR])
    
    //3. State để lấy tên người được cấp văn bằng
    const [fullname, setFullname] = useState("");
    //4. State để lấy số hiệu
    const [diplomaNumber, setDiplomaNumber] = useState("");
    //5. State để lấy số vào sổ
    const [diplomaNumberInNote, setDiplomaNumberInNote] = useState("");
    //6. State để lấy trạng thái văn bằng của select có id = status-diploma-DR
    const [selectedStatusDiploma, setSelectedStatusDiploma] = useState("");
    const handleChangeStatusDiploma = (selectedOption) => {
        setSelectedStatusDiploma(selectedOption);
    }
    
    // 7. State chứa các văn bằng từ CSDL ra 
    const allDiplomaByListOfDiplomaName = useSelector((state) => state.diploma.diplomas?.allDiploma);

    useEffect(() => {
        searchDiplomaWithMultiCondition(dispatch, user.management_unit, fullname, diplomaNumber, diplomaNumberInNote, selectedForSelectDiplomaNameDR?.value, selectedForSelectDiplomaIssuanceDR?.value, user.listOfDiplomaNameReview, selectedStatusDiploma?.value);
    }, [fullname, diplomaNumber, diplomaNumberInNote, selectedStatusDiploma, selectedForSelectDiplomaNameDR, selectedForSelectDiplomaIssuanceDR]);

    //8. Các state dưới đây dùng cho modal duyệt
    const [fullnameModalReview, setFullnameModalReview] = useState("");
    const [sexModalReview, setSexModalReview] = useState();
    const [dateofbirthModalReview, setDateofBirthModalReview] = useState("");
    const [addressModalReview, setAddressModalReview] = useState("");
    const [CCCDModalReview, setCCCDModalReview] = useState("");
    const [signDayModalReview, setSignDayModalReview] = useState("");
    const [diplomaNumberModalReview, setDiplomaNumberModalReview] = useState("");
    const [numberInNoteModalReview, setNumberInNoteModalReview] = useState("");

    const [diemTNModalReview, setDiemTNModalReview] = useState("");
    const [diemTHModalReview, setDiemTHModalReview] = useState("");
    const [ngheModalReview, setNgheModalReview] = useState("");
    const [noiModalReview, setNoiModalReview] = useState("");
    const [docModalReview, setDocModalReview] = useState("");
    const [vietModalReview, setVietModalReview] = useState("");
    const [testDayModalReview, setTestdayModalReview] = useState("");
    const [graduationYearModalReview, setGraduationYearModalReview] = useState("");
    const [classificationModalReview, setClassificationModalReview] = useState("");
    const [nganhDaoTaoModalReview, setNganhDaoTaoModalReview] = useState("");
    const [councilModalReview, setCouncilModalReview] = useState("");
    
    const [optionsOfDiplomaNameModalReview, setOptionsOfDiplomaNameModalReview] = useState("");
    const [statusModalReview, setStatusModalReview] = useState("");

    //Phần diễn giải sẽ được thêm vào DB khi duyệt hoặc không duyệt
    const [explainModalReview, setExplainModalReview] = useState("");
    //_id dùng để tìm và cập nhật văn bằng trong DB
    const [_idDiplomaModalReview, set_IDDiplomaModalReview] = useState("");

    const msg = useSelector((state) => state.diploma?.msgReview);
    const isError = useSelector((state) => state.diploma.diplomas?.error);
    const noti = useRef();

    const handleReview = async () => {
        //MSCB
        const mscbReview = user?.mssv_cb;
        //Tên cán bộ
        const officerNameReview = user?.fullname;
        
        // const today = new Date();
        // const day = today.getDate();
        // const month = today.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
        // const year = today.getFullYear();
        //Lấy ngày hiện tại để điền time tạo yêu cầu
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        const year = today.getFullYear();

        if(day<10){
            day = `0${day}`;
        }

        if(month<10){
            month = `0${month}`;
        }

        //Time
        const dayResult = `${year}-${month}-${day}`;

        const reviewObject = {
            status: 'Đã duyệt',
            mscb: mscbReview,
            officer_name: officerNameReview,
            time: dayResult,
            explain: explainModalReview
        }
        await reviewDiploma(dispatch, user.accessToken, _idDiplomaModalReview, reviewObject);
        noti.current.showToast();
        setTimeout( async ()=>{
            await searchDiplomaWithMultiCondition(dispatch, user.management_unit, fullname, diplomaNumber, diplomaNumberInNote, selectedForSelectDiplomaNameDR?.value, selectedForSelectDiplomaIssuanceDR?.value, user.listOfDiplomaNameReview, selectedStatusDiploma?.value);
        },2000);
    }

    const handleNotReview = async () => {
        //MSCB
        const mscbReview = user?.mssv_cb;
        //Tên cán bộ
        const officerNameReview = user?.fullname;
        
        // const today = new Date();
        // const day = today.getDate();
        // const month = today.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
        // const year = today.getFullYear();
        const today = new Date();
        let day = today.getDate();
        let month = today.getMonth() + 1;
        const year = today.getFullYear();

        if(day<10){
            day = `0${day}`;
        }

        if(month<10){
            month = `0${month}`;
        }

        //Time
        const dayResult = `${year}-${month}-${day}`;

        const reviewObject = {
            status: 'Không duyệt',
            mscb: mscbReview,
            officer_name: officerNameReview,
            time: dayResult,
            explain: explainModalReview
        }
        await reviewDiploma(dispatch, user.accessToken, _idDiplomaModalReview, reviewObject);
        noti.current.showToast();
        setTimeout( async ()=>{
            await searchDiplomaWithMultiCondition(dispatch, user.management_unit, fullname, diplomaNumber, diplomaNumberInNote, selectedForSelectDiplomaNameDR?.value, selectedForSelectDiplomaIssuanceDR?.value, user.listOfDiplomaNameReview, selectedStatusDiploma?.value);
        },2000);
    }

    //Phần logic xử lý phân trang
    const [page, setPage] = useState(1);
    const [allDiplomaByListOfDiplomaNameShow, setAllDiplomaByListOfDiplomaNameShow] = useState([]);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(()=>{
        if(page!=undefined && allDiplomaByListOfDiplomaName!=undefined){
            if(allDiplomaByListOfDiplomaName.length>5){
                const numberOfPage = Math.ceil(allDiplomaByListOfDiplomaName?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allDiplomaByListOfDiplomaName.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allDiplomaByListOfDiplomaName[i]];
                }
                setAllDiplomaByListOfDiplomaNameShow(result);
            }else{
                setAllDiplomaByListOfDiplomaNameShow(allDiplomaByListOfDiplomaName);
            }         
        }
    },[allDiplomaByListOfDiplomaName, page]);//nếu chạy lỗi thì bỏ depen này

    const handleDateToDMY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //Xử lý phần count
    const [count1, setCount1] = useState(0);
    const [count2, setCount2] = useState(0);
    const [count3, setCount3] = useState(0);

    //Xử lý phần đếm count
    const getAllDiploma_XL_Count = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/diploma/get_all_diploma_in_DB");
            let result = [];     
            res.data.forEach((currentValue)=>{
                if(user.listOfDiplomaNameReview.includes(currentValue.diploma_name_id)){
                    result = [...result, currentValue];
                }
            })
            let resultCount1 = 0;
            let resultCount2 = 0;
            let resultCount3 = 0;
            result.forEach((currentValue)=>{
                if(currentValue.status == "Chờ duyệt"){
                    resultCount1++;
                }
                if(currentValue.status == "Đã duyệt" && currentValue.mscb == user.mssv_cb){
                    resultCount2++;
                }
                if(currentValue.status == "Không duyệt" && currentValue.mscb == user.mssv_cb){
                    resultCount3++;
                }
            })
            setCount1(resultCount1);
            setCount2(resultCount2);
            setCount3(resultCount3);
        }catch(error){
            console.log(error);
        }
    }

    return(
        <>
            <Header/>
            <div className="container" id='body-diploma-review'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-md-6">
                                {/* Select chọn tên văn bằng muốn hiện ra để duyệt */}
                                <Select
                                    id='select-diplomaName-DR'
                                    placeholder="Chọn tên văn bằng"
                                    options={optionForSelectDiplomaNameDR}
                                    value={selectedForSelectDiplomaNameDR}
                                    onChange={handleChangeselectedForSelectDiplomaNameDR}
                                />
                            </div>
                            <div className="col-md-6">
                                {/* Select chọn đợt cấp văn bằng theo tên văn bằng */}
                                <Select
                                    id='select-diplomaIssuance-DR'
                                    placeholder='Chọn đợt cấp văn bằng'
                                    options={optionForSelectDiplomaIssuanceDR}
                                    value={selectedForSelectDiplomaIssuanceDR}
                                    onChange={handleChangeselectedForSelectDiplomaIssuanceDR}
                                />
                            </div>
                        </div>
                        <div className="row p-3">
                            <div className="col-md-3">
                                <input 
                                    type="text" 
                                    placeholder='Lọc theo họ tên'
                                    className='form-control'
                                    value={fullname}
                                    onChange={(e)=>{
                                        setFullname(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-2">
                                <input 
                                    type="text" 
                                    placeholder='Lọc số hiệu'    
                                    className='form-control'  
                                    value={diplomaNumber}
                                    onChange={(e)=>{
                                        setDiplomaNumber(e.target.value)
                                    }}
                                />
                            </div>
                            <div className='col-md-2'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc số vào sổ'
                                    className='form-control' 
                                    value={diplomaNumberInNote}
                                    onChange={(e)=>{
                                        setDiplomaNumberInNote(e.target.value)
                                    }}    
                                />
                            </div>
                            <div className='col-md-3'>
                                <Select
                                    placeholder='Chọn trạng thái văn bằng'
                                    id='status-diploma-DR'
                                    options={
                                        [
                                            { value: "", label: "Tất cả trạng thái"},
                                            { value: "Chờ duyệt", label: "Chờ duyệt" },
                                            { value: "Đã duyệt", label: "Đã duyệt" },
                                            { value: "Không duyệt", label: "Không duyệt" }
                                        ]
                                    }
                                    value={selectedStatusDiploma}
                                    onChange={handleChangeStatusDiploma}
                                />
                            </div>
                        </div>

                        <div className="row p-4">
                            <div className="col-4" style={{ padding: '10px'}}>
                                <div style={{backgroundColor: '#21acdd', height: '130px', borderRadius: '5px', color: 'white'}}>
                                    <div className="row" style={{padding: '10px'}}>
                                        <div className="col-7">
                                            <div style={{fontSize: '30px', fontWeight: 'bold'}}>{count1}</div>
                                            <div style={{fontSize: '20px', fontWeight: 'bold'}}>Văn bằng chưa xử lý</div>
                                        </div>
                                        <div className="col-5">
                                            <div style={{marginTop: '20px', fontSize: '60px', textAlign: 'center'}}>
                                                <i className="fa-brands fa-usps"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4" style={{ padding: '10px'}}>
                                <div style={{backgroundColor: '#63c5de', height: '130px', borderRadius: '5px', color: 'white'}}>
                                    <div className="row" style={{padding: '10px'}}>
                                        <div className="col-7">
                                            <div style={{fontSize: '30px', fontWeight: 'bold'}}>{count2}</div>
                                            <div style={{fontSize: '20px', fontWeight: 'bold'}}>Văn bằng được bạn duyệt</div>
                                        </div>
                                        <div className="col-5">
                                            <div style={{marginTop: '20px', fontSize: '60px', textAlign: 'center'}}>
                                                <i className="fa-solid fa-check-double"></i>
                                            </div>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                            <div className="col-4" style={{ padding: '10px'}}>
                                <div style={{backgroundColor: '#fd6b6b', height: '130px', borderRadius: '5px', color: 'white'}}>
                                    <div className="row" style={{padding: '10px'}}>
                                        <div className="col-7">
                                            <div style={{fontSize: '30px', fontWeight: 'bold'}}>{count3}</div>
                                            <div style={{fontSize: '20px', fontWeight: 'bold'}}>Văn bằng không duyệt</div>
                                        </div>
                                        <div className="col-5">
                                            <div style={{marginTop: '20px', fontSize: '60px', textAlign: 'center'}}>
                                                <i className="fa-solid fa-ban"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row mt-2 p-4">
                            <div 
                                id='contain-table-show-diploma-DR'
                            >
                                <table
                                    id='table-show-diploma-DR'
                                    className='table table-striped table-hover table-bordered'
                                >
                                    <thead>
                                        <tr>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col"></th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">STT</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Tên văn bằng</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope='col'>Trạng thái</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Họ tên</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Giới tính</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Ngày sinh</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Nơi sinh</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">CCCD</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Ngày ký</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Số hiệu</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Số vào sổ</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Người nhập</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Ngày nhập</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Người duyệt</th>
                                            <th style={{backgroundColor: '#fed25c'}} scope="col">Ngày duyệt</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaByListOfDiplomaNameShow?.map((currentValue, index)=>{
                                                //Xử lý giới tính
                                                let sex;
                                                if(currentValue.sex == true){
                                                    sex = "Nam"
                                                }else{
                                                    sex = "Nữ"
                                                }

                                                //Lấy ra tên văn bằng
                                                let ten_van_bang;

                                                //Lấy ra options của diplomaName
                                                let options;
                                                allDiplomaNameByMU?.forEach((diplomaName)=>{
                                                    if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                        ten_van_bang = diplomaName.diploma_name_name;
                                                        options = diplomaName.options;
                                                    }
                                                })

                                                let nganh_dao_tao;  
                                                //Lấy ra ngành đào tạo
                                                allMajorInDB?.forEach((major)=>{
                                                    if(major.majors_id == currentValue.nganh_dao_tao){
                                                        nganh_dao_tao = major.majors_name;
                                                    }
                                                })

                                                let nguoi_nhap='';
                                                let nguoi_duyet=''
                                                allUserAccount?.forEach((user)=>{
                                                    if(user.mssv_cb == currentValue.mscb_import){
                                                        nguoi_nhap = user.fullname;
                                                    }
                                                    if(user.mssv_cb == currentValue.mscb){
                                                        nguoi_duyet = user.fullname;
                                                    }
                                                })
                                                return(
                                                <tr key={index}>
                                                    <td>
                                                        <i 
                                                            className="fa-solid fa-eye"
                                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                            data-bs-toggle="modal" data-bs-target="#showDiplomaModal"
                                                            onClick={(e)=>{
                                                                setFullnameModalReview(currentValue.fullname);
                                                                setSexModalReview(currentValue.sex);
                                                                setDateofBirthModalReview(currentValue.dateofbirth);
                                                                setAddressModalReview(currentValue.address);
                                                                setCCCDModalReview(currentValue.cccd);
                                                                setSignDayModalReview(currentValue.sign_day);
                                                                setDiplomaNumberModalReview(currentValue.diploma_number);
                                                                setNumberInNoteModalReview(currentValue.numbersIntoTheNotebook);

                                                                setDiemTNModalReview(currentValue.diem_tn);
                                                                setDiemTHModalReview(currentValue.diem_th);
                                                                setNgheModalReview(currentValue.nghe);
                                                                setNoiModalReview(currentValue.noi);
                                                                setDocModalReview(currentValue.doc);
                                                                setVietModalReview(currentValue.viet);
                                                                setTestdayModalReview(currentValue.test_day);
                                                                setGraduationYearModalReview(currentValue.graduationYear);
                                                                setClassificationModalReview(currentValue.classification);
                                                                setNganhDaoTaoModalReview(nganh_dao_tao)
                                                                setCouncilModalReview(currentValue.council);
                                                                
                                                                setOptionsOfDiplomaNameModalReview(options);
                                                                set_IDDiplomaModalReview(currentValue._id);
                                                                setExplainModalReview("");
                                                                setStatusModalReview(currentValue.status);
                                                            }}
                                                        ></i>
                                                    </td>
                                                    <th scope="row">{index+1}</th>
                                                    <td>{ten_van_bang}</td>
                                                    <td>
                                                        <Tooltip
                                                            // options
                                                            theme='dark'
                                                            html={(
                                                                <div>
                                                                <strong>
                                                                    {currentValue.explain}
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
                                                    <td>{currentValue.fullname}</td>
                                                    <td>{sex}</td>
                                                    <td>{currentValue.dateofbirth}</td>
                                                    <td>{currentValue.address}</td>
                                                    <td>{currentValue.cccd}</td>
                                                    <td>{currentValue.sign_day}</td>
                                                    <td>{currentValue.diploma_number}</td>
                                                    <td>{currentValue.numbersIntoTheNotebook}</td>
                                                    <td>{nguoi_nhap} / {currentValue.mscb_import}</td>
                                                    <td>{handleDateToDMY(currentValue.time_import)}</td>
                                                    <td>{nguoi_duyet} / {currentValue.mscb}</td>
                                                    <td>{currentValue.time == "" ? ("") : (handleDateToDMY(currentValue.time))}</td>
                                                </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <Stack spacing={2}>
                                <Pagination 
                                    count={Math.ceil(allDiplomaByListOfDiplomaName?.length/5)}
                                    variant="outlined"
                                    page={page}
                                    onChange={handleChange}
                                    color="info"
                                    />
                            </Stack>
                        </div>

                        {/* Modal show thông tin văn bằng để duyệt hoặc xem */}
                        <div className="modal fade" id="showDiplomaModal" tabIndex="-1" aria-labelledby="showDiplomaModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                    <h1 className="modal-title fs-5" id="showDiplomaModalLabel">Thông tin văn bằng</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="row inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Họ tên người được cấp
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {fullnameModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Giới tính
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {sexModalReview ? "Nam" : "Nữ"}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Ngày sinh
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {dateofbirthModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Nơi sinh
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {addressModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            CCCD
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {CCCDModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Ngày ký
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {signDayModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Số hiệu
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {diplomaNumberModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Số vào sổ
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {numberInNoteModalReview}
                                        </div>
                                    </div>
                                    
                                    {
                                        optionsOfDiplomaNameModalReview.includes(1) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm trắc nghiệm
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {diemTNModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(2) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm thực hành
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {diemTHModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(3) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm kỹ năng nghe
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {ngheModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(4) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm kỹ năng nói
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {noiModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(5) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm kỹ năng đọc
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {docModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(6) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Điểm kỹ năng viết
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {vietModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(7) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Ngày thi
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {testDayModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(8) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Năm tốt nghiệp
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {graduationYearModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(9) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Xếp loại
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {classificationModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(10) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Ngành đào tạo
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {nganhDaoTaoModalReview}
                                                </div>
                                            </div>
                                        ) : ("")
                                    }

                                    {
                                        optionsOfDiplomaNameModalReview.includes(11) ? (
                                            <div className="row mt-2 inForDiploma-DR">
                                                <div className="col-4 text-end fst-italic">
                                                    Hội đồng thi
                                                </div>
                                                <div className="col-8 fw-bold">
                                                    {councilModalReview}
                                                </div>
                                            </div> 
                                        ) : ("")
                                    }                                       
                                </div>
                                <div id='footer-modal-review-DR'>
                                    <div className="row">
                                        <div className="col-7">
                                            <div className="form-floating">
                                                <textarea 
                                                    className="form-control" 
                                                    value={explainModalReview}
                                                    onChange={(e)=>{
                                                        setExplainModalReview(e.target.value);
                                                    }}
                                                    placeholder="Leave a comment here" 
                                                    id="floatingTextarea2" style={{height: "100px"}}></textarea>
                                                <label htmlFor="floatingTextarea2">Nhập diễn giải</label>
                                            </div>
                                        </div>
                                        <div className="col-5">
                                            <div className='d-flex align-items-end' style={{height: '100%'}}>
                                                {
                                                    statusModalReview == "Chờ duyệt" ? (
                                                        <>
                                                            <div className='ms-2'>
                                                                <button 
                                                                    className="btn btn-primary"
                                                                    onClick={(e)=>{
                                                                        handleReview();
                                                                    }}
                                                                >Duyệt</button>
                                                            </div>
                                                            <div className='ms-2'>
                                                                <button 
                                                                    className="btn btn-danger"
                                                                    onClick={(e)=>{
                                                                        handleNotReview();
                                                                    }}
                                                                >Không duyệt</button>
                                                            </div>
                                                            <div className='ms-2'>
                                                                <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                            <div className='ms-2'>
                                                                <button className="btn btn-secondary" data-bs-dismiss="modal">Hủy bỏ</button>
                                                            </div>
                                                    )
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
            <Footer/>
            <Toast
                message={msg}
                type={isError ? "error" : 'success'}
                ref={noti}
            />
        </>
    )
} 
import Header from '../Header/Header'
import './HomePage.css';
import Footer from '../Footer/Footer';
import {useEffect, useState, useRef} from 'react';
import Select from "react-select";
import {getAllDiplomaName} from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Toast from '../Toast/Toast';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function HomePage() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    //State dùng để chứa all tên(loại) văn bằng
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state lấy ra all diploma name
    const [optionDiplomaName, setOptionDiplomaName] = useState([]);
    const [selectedDiplomaName, setSelectedDiplomaName] = useState();
    const handleChangeSelectedDiplomaName = (selectedOption) => {
        setSelectedDiplomaName(selectedOption);
    }

    useEffect(()=>{
        getAllDiplomaName(dispatch);
        getAllMajorsShowModal();
    }, [])


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

    useEffect(()=>{
        let optionResult = [];
        allDiplomaName?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            optionResult = [...optionResult, newOption];
        })
        setOptionDiplomaName(optionResult);
    }, [allDiplomaName])

    
    const [fullname, setFullName] = useState("");
    const [diplomaNumber, setDiplomaNumber] = useState("");
    const [numberInNote, setNumberInNote] = useState("");

    //Các state sau để dùng cho chức năng tra cứu
    const [allDiplomaSearch, setAllDIplomaSearch] = useState([]);//state dùng để chứa toàn bộ dữ liệu được tìm thấy
    const [allDiplomaShow, setAllDiplomaShow] = useState([]);//state dùng để chứa dữ liệu sau khi đã phân trang hiển thị lên màn hình
    const [page, setPage] = useState(1);
    // const [count, setCount] = useState();
    const handleChange = (event, value) => {
        setPage(value);
      };

    const handleSubmitSearch = async (e) => {
        e.preventDefault();
        if(selectedDiplomaName == undefined){
            noti.current.showToast();
        }
        try{
            let result;
            if(user==null || user.position=="Student"){
                result = await axios.get(`http://localhost:8000/v1/diploma/search_diploma_tracuu_for_student_and_client_user?diploma_name_id=${selectedDiplomaName?.value}&fullname=${fullname}&diploma_number=${diplomaNumber}&number_in_note=${numberInNote}`)
            }else{
                result = await axios.get(`http://localhost:8000/v1/diploma/search_diploma_tracuu?diploma_name_id=${selectedDiplomaName?.value}&fullname=${fullname}&diploma_number=${diplomaNumber}&number_in_note=${numberInNote}`);
            }
            setAllDIplomaSearch(result.data);
            setPage(1);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        if(page!=undefined && allDiplomaSearch!=undefined){
            if(allDiplomaSearch?.length>3){
                const numberOfPage = Math.ceil(allDiplomaSearch?.length/3);
                const startElement = (page - 1) * 3;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allDiplomaSearch.length-1;
                }else{
                    endElement = page * 3-1;
                }
                                
                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allDiplomaSearch[i]];
                }
                setAllDiplomaShow(result);
            }else{
                setAllDiplomaShow(allDiplomaSearch);
            }   
        }       
    }, [page, allDiplomaSearch]);

    const noti = useRef();

    //state để dùng cho modal hiển thị thông tin chi tiết văn bằng
    const [diplomaNameShowModal, setDiplomaNameShowModal] = useState("");
    const [fullnameShowModal, setFullnameShowModal] = useState("");
    const [sexShowModal, setSexShowModal] = useState("");
    const [dateofbirthShowModal,setDateofbirthShowModal] = useState("");
    const [addressShowModal, setAddressShowModal] = useState("");
    const [cccdShowModal, setCCCDShowModal] = useState("");
    const [signDayShowModal, setSignDayShowModal] = useState("");
    const [diplomaNumberShowModal, setDiplomaNumberShowModal] = useState("");
    const [numberInNoteShowModal, setNumberInNoteShowModal] = useState("");

    const [diemTNShowModal, setDiemTNShowModal] = useState("");
    const [diemTHShowModal, setDiemTHShowModal] = useState("");
    const [ngheShowModal, setNgheShowModal] = useState("");
    const [noiShowModal, setNoiShowModal] = useState("");
    const [docShowModal, setDocShowModal] = useState("");
    const [vietShowModal, setVietShowModal] = useState("");
    const [testDayShowModal, setTestDayShowModal] = useState("");
    const [graduationYearShowModal, setGraduationYear] = useState("");
    const [classificationShowModal, setClassificationShowModal] = useState("");
    const [nganhDaoTaoShowModal, setNganhDaoTaoShowModal] = useState("");
    const [councilShowModal, setCouncilShowModal] = useState("");
    
    //State chứa options của diplomaName được chọn khi xem chi tiết diploma
    const [optionsOfDiplomaName, setOptionsOfDiplomaName] = useState([]);
    
    return (
        <>
            <Header />
            <div className="container" id='body-homepage'>
                <form style={{backgroundColor: '#ffffff', borderRadius: '10px'}} onSubmit={(e)=>{handleSubmitSearch(e)}}>
                    <div id='form-search-homepage'>
                        <div id='bg-orange-homepage'>
                            <h5 id='tittle-in-bg-orange-homepage'>
                                Tìm kiếm
                                <p style={{fontSize: '25px', color: '#fff200', marginBottom: '0px'}}>VĂN BẰNG</p>
                            </h5>
                            <div style={{color: 'white'}}>
                                <img 
                                    style={{width: '40px', marginLeft: '70px', marginRight: '10px'}}
                                    src="https://www.web30s.vn/images/icon-arrow.svg" 
                                    alt="Đang tải hình ảnh" />
                                Tại đây 
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 offset-md-2">
                                <label htmlFor="diploma-name-homepage" className="col-form-label text-end d-block" style={{fontSize: '12px', fontStyle: 'italic'}}>Tên văn bằng <span style={{color: 'red'}}>*</span></label>
                            </div>
                            <div className="col-5">
                                <Select
                                    id='select-diplomaName-homepage'
                                    options={optionDiplomaName}
                                    onChange={handleChangeSelectedDiplomaName}
                                    placeholder="Chọn tên văn bằng"
                                />        
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label 
                                    htmlFor="fullname-homepage" 
                                    className="col-form-label text-end d-block" 
                                    style={{fontSize: '12px', fontStyle: 'italic'}}>Họ tên</label>
                            </div>
                            <div className="col-5">
                                <input 
                                    type="text" 
                                    id="fullname-homepage" 
                                    className="form-control"
                                    value={fullname}
                                    onChange={(e)=>{
                                        setFullName(e.target.value)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label 
                                    htmlFor="certificate-number-homepage" 
                                    className="col-form-label text-end d-block" 
                                    style={{fontSize: '12px', fontStyle: 'italic'}}>Số hiệu</label>
                            </div>
                            <div className="col-3">
                                <input 
                                    type="text" 
                                    id="certificate-number-homepage" 
                                    className="form-control"
                                    value={diplomaNumber}
                                    onChange={(e)=>{
                                        setDiplomaNumber(e.target.value);
                                    }}
                                    />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-2 offset-md-2">
                                <label 
                                htmlFor="reference-number-homepage" 
                                className="col-form-label text-end d-block" 
                                style={{fontSize: '12px', fontStyle: 'italic'}}>Số vào sổ</label>
                            </div>
                            <div className="col-3">
                                <input 
                                    type="text" id="reference-number-homepage" 
                                    className="form-control"
                                    value={numberInNote}
                                    onChange={(e)=>{
                                        setNumberInNote(e.target.value)
                                    }}
                                    />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="col-2 offset-md-2">
                            </div>
                            <div className="col-3">
                                <button className='btn' type='submit' id='search-btn-homepage'><i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm</button>
                                <button className='btn btn-success ms-4' type='reset' ><i className="fa-solid fa-rotate"></i> Làm mới</button>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Tên văn bằng</th>
                                <th scope="col">Họ tên</th>
                                <th scope="col">Ngày sinh</th>
                                <th scope="col">Số hiệu</th>
                                <th scope="col">Số vào sổ</th>
                                <th scope='col'></th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {allDiplomaShow?.map((currentValue, index)=>{
                                let diploma_name = '';
                                allDiplomaName?.forEach((diplomaName)=>{
                                    if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                        diploma_name = diplomaName.diploma_name_name;
                                    }
                                })
                                return(
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>        
                                        <td>{diploma_name}</td>
                                        <td>{currentValue.fullname}</td>
                                        <td>{currentValue.dateofbirth}</td>
                                        <td>{currentValue.diploma_number}</td>
                                        <td>{currentValue.numbersIntoTheNotebook}</td>
                                        <td><i 
                                                onClick={(e)=>{
                                                    allDiplomaName?.forEach((diplomaName)=>{
                                                        if(currentValue.diploma_name_id == diplomaName.diploma_name_id){
                                                            setDiplomaNameShowModal(diplomaName.diploma_name_name);
                                                            setOptionsOfDiplomaName(diplomaName.options);
                                                        }
                                                    })
                                                    setFullnameShowModal(currentValue.fullname);
                                                    if(currentValue.sex){
                                                        setSexShowModal("Nam");
                                                    }else{
                                                        setSexShowModal("Nữ");
                                                    }
                                                    setDateofbirthShowModal(currentValue.dateofbirth);
                                                    setAddressShowModal(currentValue.address);
                                                    setCCCDShowModal(currentValue.cccd);
                                                    setSignDayShowModal(currentValue.sign_day);
                                                    setDiplomaNumberShowModal(currentValue.diploma_number);
                                                    setNumberInNoteShowModal(currentValue.numbersIntoTheNotebook);

                                                    setDiemTNShowModal(currentValue.diem_tn);
                                                    setDiemTHShowModal(currentValue.diem_th);
                                                    setNgheShowModal(currentValue.nghe);
                                                    setNoiShowModal(currentValue.noi);
                                                    setDocShowModal(currentValue.doc);
                                                    setVietShowModal(currentValue.viet);
                                                    setTestDayShowModal(currentValue.test_day);
                                                    setGraduationYear(currentValue.graduationYear);
                                                    setClassificationShowModal(currentValue.classification);

                                                    allMajorInDB?.forEach((major)=>{
                                                        if(major.majors_id == currentValue.nganh_dao_tao){
                                                            setNganhDaoTaoShowModal(major.majors_name);
                                                        }
                                                    })
                                                    setCouncilShowModal(currentValue.council);
                                                }}
                                                className="fa-solid fa-eye"
                                                data-bs-toggle="modal" 
                                                data-bs-target="#showDiplomaModal"
                                                style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                        ></i></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {/* Modal hiển thị thông tin chi tiết văn bằng */}
                    <div className="modal fade" id="showDiplomaModal" tabIndex="-1" aria-labelledby="showDiplomaModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="showDiplomaModalLabel">Thông tin chi tiết văn bằng</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Tên văn bằng
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <p style={{fontWeight: 'bold', marginTop: '7px'}}>{diplomaNameShowModal}</p>                                      
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Họ tên người được cấp
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'   
                                            value={fullnameShowModal}
                                        />                                        
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Giới tính
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={sexShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Ngày sinh
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={dateofbirthShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Nơi sinh
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={addressShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            CCCD
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={cccdShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Ngày ký
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={signDayShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Số hiệu
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={diplomaNumberShowModal} 
                                        /> 
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-3">
                                        <label 
                                            className='col-form-label text-end d-block'
                                            style={{ fontStyle: 'italic' }}
                                        >
                                            Số vào sổ
                                        </label>
                                    </div>
                                    <div className="col-9">
                                        <input 
                                            type="text" 
                                            readOnly={true} 
                                            className='form-control'  
                                            value={numberInNoteShowModal} 
                                        /> 
                                    </div>
                                </div>

                                {
                                    optionsOfDiplomaName.includes(1) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm trắc nghiệm
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={diemTNShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(2) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm thực hành
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={diemTHShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(3) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm kỹ năng nghe
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={ngheShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(4) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm kỹ năng nói
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={noiShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(5) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm kỹ năng đọc
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={docShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(6) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Điểm kỹ năng viết
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={vietShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(7) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Ngày thi
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={testDayShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(8) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Năm tốt nghiệp
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={graduationYearShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(9) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Xếp loại
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={classificationShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(10) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Ngành đào tạo
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={nganhDaoTaoShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }
                                {
                                    optionsOfDiplomaName.includes(11) ? (
                                        <div className="row mt-2">
                                            <div className="col-3">
                                                <label 
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontStyle: 'italic' }}
                                                >
                                                    Hội đồng thi
                                                </label>
                                            </div>
                                            <div className="col-9">
                                                <input 
                                                    type="text" 
                                                    readOnly={true} 
                                                    className='form-control'  
                                                    value={councilShowModal} 
                                                /> 
                                            </div>
                                        </div>
                                    ) : ("")
                                }

                                
                                
                                
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className='d-flex justify-content-center'>
                        <Stack spacing={2}>
                            {/* <Typography className='text-center'>Trang: {page}</Typography> */}
                            <Pagination 
                                count={Math.ceil(allDiplomaSearch?.length/3)}
                                variant="outlined"
                                page={page}
                                onChange={handleChange}
                                color="info"
                        
                                />
                        </Stack>
                    </div>
                </div>
            </div>
            <Footer/>
            <Toast
                message="Vui lòng chọn tên văn bằng"
                type="warning"
                ref={noti}
            />
        </>
    );
}
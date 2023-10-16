import './DiplomaReview.css';
import Header from '../Header/Header';
import Select from "react-select";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import {getAllDiplomaIssuanceByMU, searchDiplomaWithMultiCondition, reviewDiploma } from '../../redux/apiRequest';
import Footer from '../Footer/Footer';
import Toast from '../Toast/Toast';
export default function DiplomaReview(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    // 1. Các biến dùng để tạo và lấy giá trị từ select có id = select-diplomaName-DR
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    const [optionForSelectDiplomaNameDR, setOptionForSelectDiplomaNameDR] = useState([]);
    const [selectedForSelectDiplomaNameDR, setSelectedForSelectDiplomaNameDR] = useState();

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

    useEffect(()=>{
        getAllDiplomaNameByMU(user.management_unit);
        getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
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
    const [testDayModalReview, setTestdayModalReview] = useState("");
    const [councilModalReview, setCouncilModalReview] = useState("");
    const [classificationModalReview, setClassificationModalReview] = useState("");
    const [graduationYearModalReview, setGraduationYearModalReview] = useState("");
    const [signDayModalReview, setSignDayModalReview] = useState("");
    const [diplomaNumberModalReview, setDiplomaNumberModalReview] = useState("");
    const [numberInNoteModalReview, setNumberInNoteModalReview] = useState("");

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
        
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
        const year = today.getFullYear();

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
        
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
        const year = today.getFullYear();

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

                        <div className="row mt-2 p-4">
                            <div 
                                // className='table-wrapper table-responsive'
                                id='contain-table-show-diploma-DR'
                            >
                                <table
                                    id='table-show-diploma-DR'
                                    className="table table-bordered"
                                >
                                    <thead>
                                        <tr>
                                            <th style={{width: '50px'}} scope="col"></th>
                                            <th scope="col">STT</th>
                                            <th scope='col'>Trạng thái</th>
                                            <th scope="col">Họ tên</th>
                                            <th scope="col">Giới tính</th>
                                            <th scope="col">Ngày sinh</th>
                                            <th scope="col">Nơi sinh</th>
                                            <th scope="col">Ngày kiểm tra</th>
                                            <th scope="col">Hội đồng</th>
                                            <th scope="col">Xếp loại</th>
                                            <th scope="col">Năm tốt nghiệp</th>
                                            <th scope="col">Ngày ký</th>
                                            <th scope="col">Số hiệu</th>
                                            <th scope="col">Số vào sổ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaByListOfDiplomaName?.map((currentValue, index)=>{
                                                return(
                                                <tr key={index}>
                                                    <td
                                                        style={{textAlign: 'center'}}
                                                    >
                                                        <i 
                                                            className="fa-solid fa-eye"
                                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                            data-bs-toggle="modal" data-bs-target="#showDiplomaModal"
                                                            onClick={(e)=>{
                                                                setFullnameModalReview(currentValue.fullname);
                                                                setSexModalReview(currentValue.sex);
                                                                setDateofBirthModalReview(currentValue.dateofbirth);
                                                                setAddressModalReview(currentValue.address);
                                                                setTestdayModalReview(currentValue.test_day);
                                                                setCouncilModalReview(currentValue.council);
                                                                setClassificationModalReview(currentValue.classification);
                                                                setGraduationYearModalReview(currentValue.graduationYear);
                                                                setSignDayModalReview(currentValue.sign_day);
                                                                setDiplomaNumberModalReview(currentValue.diploma_number);
                                                                setNumberInNoteModalReview(currentValue.numbersIntoTheNotebook);
                                                                set_IDDiplomaModalReview(currentValue._id);
                                                                setExplainModalReview("");
                                                            }}
                                                        ></i>
                                                    </td>
                                                    <th scope="row" style={{textAlign: 'center'}}>{index+1}</th>
                                                    <td>{currentValue.status}</td>
                                                    <td>{currentValue.fullname}</td>
                                                    <td>{currentValue.sex}</td>
                                                    <td>{currentValue.dateofbirth}</td>
                                                    <td>{currentValue.address}</td>
                                                    <td>{currentValue.test_day}</td>
                                                    <td>{currentValue.council}</td>
                                                    <td>{currentValue.classification}</td>
                                                    <td>{currentValue.graduationYear}</td>
                                                    <td>{currentValue.sign_day}</td>
                                                    <td>{currentValue.diploma_number}</td>
                                                    <td>{currentValue.numbersIntoTheNotebook}</td>
                                                </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal show thông tin văn bằng để duyệt hoặc xem */}
                        <div className="modal fade" id="showDiplomaModal" tabIndex="-1" aria-labelledby="showDiplomaModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header">
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
                                            Ngày kiểm tra
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {testDayModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Hội đồng kiểm tra
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {councilModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Xếp loại
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {classificationModalReview}
                                        </div>
                                    </div>
                                    <div className="row mt-2 inForDiploma-DR">
                                        <div className="col-4 text-end fst-italic">
                                            Năm tốt nghiệp
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {graduationYearModalReview}
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
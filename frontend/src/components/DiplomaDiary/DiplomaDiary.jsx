import './DiplomaDiary.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from "react-select";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Tooltip } from 'react-tippy';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
export default function DiplomaDiary() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    //state hiển thị all diploma đã duyệt hoặc không duyệt được hiển thị trong table
    const [allApprovedDiploma, setApprovedDiploma] = useState([]);
    const [officerName, setOfficerName] = useState("");
    const [mscb, setMscb] = useState("");
    const [status, setStatus] = useState({ value: "", label: "Tất cả trạng thái" });

    const [startDateDiary, setStartDateDiary] = useState("");
    const [endDateDiary, setEndDateDiary] = useState("");

    const [optionsDiplomaNameDiary, setOptionsDiplomaNameDiary] = useState([]);
    const [selectedDiplomaNameDiary, setSelectedDiplomaNameDiary] = useState({value: '', label: "Tất cả tên văn bằng"});
    const handleChangeSelectedDiplomaName = (selectedOption) => {
        setSelectedDiplomaNameDiary(selectedOption);
    }

    //State chứa all majors trong db dùng để làm options cho select ngành trong form add và edit diploma
    const [allMajorInDB, setAllMajorInDB] = useState([]);
    const getAllMajorsShowModal = async () => {
        try {
            const result = await axios.get("http://localhost:8000/v1/majors/get_all_majors_show_modal");
            setAllMajorInDB(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    //State chứa all user account
    const [allUserAccount, setAllUserAccount] = useState([]);

    const getAllUserAccount = async () => {
        try {
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    //State chứa các diploma name do DVQL của tài khoản giám đốc trung tâm quản lý
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);

    const getAllDiplomaNameByMU = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${user.management_unit}`);
            setAllDiplomaNameByMU(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllUserAccount();
        getAllDiplomaNameByMU();
        getAllMajorsShowModal();
    }, [])

    useEffect(()=>{
        let resultOption = [{value: '', label: "Tất cả tên văn bằng"}];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsDiplomaNameDiary(resultOption);
    }, [allDiplomaNameByMU])

    const handleChangeStatus = (selectedOption) => {
        setStatus(selectedOption);
    }

    const getAllDiplomaForDiplomaDiary = async (officerName, mscb, status) => {
        try {
            const result = await axios.get(`http://localhost:8000/v1/diploma/search_diploma_for_diploma_diary?mscb=${mscb}&status=${status}`);

            let listDiplomaName = [];
            allDiplomaNameByMU?.forEach((currentValue) => {
                listDiplomaName = [...listDiplomaName, currentValue.diploma_name_id];
            })

            //mảng để lưu các văn bằng sau khi đã lọc ra các văn bằng có trạng thái "Chờ duyệt" và phải là các văn bằng thuộc tên văn bằng dc đơn vị quản lý
            let finalResult = [];
            result.data?.forEach((currentValue) => {
                if (currentValue.status != "Chờ duyệt" && listDiplomaName.includes(currentValue.diploma_name_id)) {
                    finalResult = [...finalResult, currentValue];
                }
            })

            for (let i = 0; i < finalResult.length; i++) {
                for (let j = 0; j < allUserAccount.length; j++) {
                    if (finalResult[i].mscb == allUserAccount[j].mssv_cb) {
                        finalResult[i]['fullname_approve'] = allUserAccount[j].fullname;
                    }
                }
            }

            let finalResult2 = [];
            finalResult.forEach((currentValue) => {
                if (currentValue.fullname_approve.toLowerCase().includes(officerName.toLowerCase())) {
                    finalResult2 = [...finalResult2, currentValue];
                }
            })

            let finalResult3 = [];
            if(startDateDiary != "" && endDateDiary !=""){
                const fromDate = new Date(startDateDiary).getTime();
                const toDate = new Date(endDateDiary).getTime();
                finalResult2.forEach((currentValue)=>{
                    const dayApprove = new Date(currentValue.time).getTime();
                    if(dayApprove>=fromDate && dayApprove<=toDate){
                        finalResult3 = [...finalResult3, currentValue];
                    }
                })
            }else{
                finalResult3 = [...finalResult3, ...finalResult2];
            } 

            let finalResult4 = [];

            if(selectedDiplomaNameDiary.value!=""){
                finalResult3.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == selectedDiplomaNameDiary.value){
                        finalResult4 = [...finalResult4, currentValue];
                    }
                })
            }else{
                finalResult4 = [...finalResult4, ...finalResult3];
            }
            setApprovedDiploma(finalResult4);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllDiplomaForDiplomaDiary(officerName, mscb, status?.value);
    }, [officerName, mscb, status, allUserAccount, allDiplomaNameByMU, startDateDiary, endDateDiary, selectedDiplomaNameDiary]);

    const handleDateToDMY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //Xử lý phân trang
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    //State chứa all YCCP sẽ được hiển thị lên màn hình sau khi phân trang
    const [allApprovedDiploma_PT, setApprovedDiploma_PT] = useState([]);

    useEffect(() => {
        if (page != undefined && allApprovedDiploma != undefined) {
            if (allApprovedDiploma.length > 5) {
                const numberOfPage = Math.ceil(allApprovedDiploma?.length / 5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if (page == numberOfPage) {
                    endElement = allApprovedDiploma.length - 1;
                } else {
                    endElement = page * 5 - 1;
                }

                let result = [];
                for (let i = startElement; i <= endElement; i++) {
                    result = [...result, allApprovedDiploma[i]];
                }
                setApprovedDiploma_PT(result);
            } else {
                setApprovedDiploma_PT(allApprovedDiploma);
            }
        }
    }, [page, allApprovedDiploma])

    //Xử lý phần hiển thị chi tiết văn bằng
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

    return (
        <>
            <Header />
            <div className="container" id='body-diploma-diary'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    placeholder='Tìm kiếm theo họ tên cán bộ duyệt văn bằng'
                                    className='form-control'
                                    value={officerName}
                                    onChange={(e) => {
                                        setOfficerName(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className='form-control'
                                    value={mscb}
                                    onChange={(e) => {
                                        setMscb(e.target.value)
                                    }}
                                    placeholder='Tìm kiếm theo mã số cán bộ duyệt văn bằng'
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    id='operation-DD'
                                    value={status}
                                    onChange={handleChangeStatus}
                                    options={
                                        [
                                            { value: "", label: "Tất cả trạng thái" },
                                            { value: "Đã duyệt", label: "Đã duyệt" },
                                            { value: "Không duyệt", label: "Không duyệt" }
                                        ]
                                    }
                                />
                            </div>
                        </div>
                        <div className="row p-3">
                            <div className="col-3">
                                <input 
                                    type="date"
                                    className='form-control'
                                    value={startDateDiary}
                                    onChange={(e)=>{
                                        setStartDateDiary(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-1 text-center">
                                <i className="fa-solid fa-arrow-right" style={{marginTop: '10px'}}></i>
                            </div>
                            <div className="col-3">
                                <input 
                                    type="date"
                                    className='form-control'    
                                    value={endDateDiary}
                                    onChange={(e)=>{
                                        setEndDateDiary(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="col-4 offset-1">
                                <Select
                                    options={optionsDiplomaNameDiary}
                                    value={selectedDiplomaNameDiary}
                                    onChange={handleChangeSelectedDiplomaName}
                                />
                            </div>
                        </div>
                        <div className="row mt-2 p-4">
                            <div id='contain-table-show-DD'>
                                <table
                                    className='table table-striped table-hover table-bordered' style={{ width: '1220px', border: '2px solid #fed25c', textAlign: 'center' }}
                                    id='table-show-DD'
                                >
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#fed25c', width: '50px' }} scope="col">STT</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên văn bằng</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Cán bộ xét duyệt</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Thao tác</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Thời điểm</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Chi tiết văn bằng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allApprovedDiploma_PT?.map((currentValue, index) => {
                                                let ten_van_bang = '';
                                                let nganh_dao_tao;
                                                let options;
                                                allDiplomaNameByMU.forEach((diplomaName) => {
                                                    if (currentValue.diploma_name_id == diplomaName.diploma_name_id) {
                                                        ten_van_bang = diplomaName.diploma_name_name;
                                                        options = diplomaName.options;
                                                    }
                                                })
                                                allMajorInDB.forEach((major) => {
                                                    if(currentValue.nganh_dao_tao == major.majors_id){
                                                        nganh_dao_tao = major.majors_name;
                                                    }
                                                })

                                                return (
                                                    <tr key={index}>
                                                        <th scope='row'>{index + 1}</th>
                                                        <td>{ten_van_bang}</td>
                                                        <td>{currentValue.fullname_approve} / {currentValue.mscb}</td>
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
                                                        <td>{handleDateToDMY(currentValue.time)}</td>
                                                        <td>
                                                            <i
                                                                className="fa-solid fa-eye"
                                                                style={{ backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white' }}
                                                                data-bs-toggle="modal" data-bs-target="#detailDiplomaDiary"
                                                                onClick={(e) => {
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
                                                                }}
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                {/* Modal hiển thị chi tiết văn bằng         */}
                                <div className="modal fade" id="detailDiplomaDiary" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="detailDiplomaDiaryLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered modal-lg">
                                        <div className="modal-content">
                                            <div className="modal-header" style={{ backgroundColor: '#feefbf' }}>
                                                <h1 className="modal-title fs-5" id="detailDiplomaDiaryLabel">Chi tiết văn bằng</h1>
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
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </div>
                            <div className="d-flex justify-content-center mt-3 mb-3">
                                <Stack spacing={2}>
                                    <Pagination
                                        count={Math.ceil(allApprovedDiploma?.length / 5)}
                                        variant="outlined"
                                        page={page}
                                        onChange={handleChange}
                                        color="info"
                                    />
                                </Stack>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
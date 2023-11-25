//Trang quản lý phôi hư
import './ManagementOfDamagedEmbryos.css'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName } from '../../redux/apiRequest';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Tooltip } from 'react-tippy';
import Toast from '../Toast/Toast';
export default function ManagementOfDamagedEmbryos() {
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng   

    useEffect(() => {
        getAllDiplomaName(dispatch);
    }, [])

    const [optionsDiplomaName, setOptionsDiplomaName] = useState([]);
    const [selectedDiplomaName, setSelectedDiplomaName] = useState({ value: '', label: 'Tất cả loại phôi' });
    const handleChangeSelectDiplomaName = (selectOption) => {
        setSelectedDiplomaName(selectOption)
    }

    useEffect(() => {
        let resultOption = [];
        allDiplomaName?.forEach((currentValue) => {
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptionsDiplomaName(resultOption);
    }, [allDiplomaName])

    const [listSeriNumberDamaged, setListSeriNumberDamaged] = useState([]);
    const getSeriNumberDamaged = async (diploma_name_id) => {
        try {
            const res = await axios.get(`http://localhost:8000/v1/damaged_embryos/get_all_damaged_serial_number_for_managed?diploma_name_id=${diploma_name_id}`);
            setListSeriNumberDamaged(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSeriNumberDamaged(selectedDiplomaName.value);
    }, [selectedDiplomaName])

    const handleSeri = (seriNumber) => {
        let seriAfterProcessing = seriNumber.toString();
        switch (seriAfterProcessing.length) {
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

    const handleResultSeri = (seri_number_start, seri_number_end) => {
        let resultSeri = '';
        for (let i = 0; i < seri_number_start.length - 1; i++) {
            resultSeri += `${handleSeri(seri_number_start[i])} - ${handleSeri(seri_number_end[i])}, `
        }
        resultSeri += `${handleSeri(seri_number_start[seri_number_start.length - 1])} - ${handleSeri(seri_number_end[seri_number_end.length - 1])}`;
        return resultSeri;
    }

    //Xử lý phần thêm danh sách hư
    const [selectedDiplomaNameAdd, setSelectedDiplomaNameAdd] = useState({});
    const handleChangeselectedDiplomaNameAdd = (selectOption) => {
        setSelectedDiplomaNameAdd(selectOption);
    }

    const [numberOfEmbryosAdd, setNumberOfEmbryosAdd] = useState(0);

    const [inputSeriStart, setInputSeriStart] = useState("");
    const [inputSeriEnd, setInputSeriEnd] = useState("");
    const [lowestSerialNumber, setLowestSerialNumber] = useState(1);

    const [seri_number_startAdd, setSeri_number_startAdd] = useState([]);
    const [seri_number_endAdd, setSeri_number_endAdd] = useState([]);
    const [reasonAdd, setReasonAdd] = useState("");


    const noti = useRef()
    const noti2 = useRef()
    const noti3 = useRef()
    const handleAddSeriToArray = async () => {
        if (inputSeriStart == "" || inputSeriStart == NaN || inputSeriEnd == "" || inputSeriEnd == NaN) {
            noti.current.showToast();
            return;
        }

        if (parseInt(inputSeriStart) < parseInt(lowestSerialNumber)) {
            noti2.current.showToast();
            return;
        }

        if (parseInt(inputSeriEnd) < parseInt(inputSeriStart)) {
            noti3.current.showToast();
            return;
        }

        setSeri_number_startAdd((prev) => { return [...prev, parseInt(inputSeriStart)] });
        setSeri_number_endAdd((prev) => { return [...prev, parseInt(inputSeriEnd)] });

        setInputSeriStart("");
        setInputSeriEnd("");

        setLowestSerialNumber(parseInt(inputSeriEnd) + 1);
    }
    const noti4 = useRef();
    const handleAddSeriDamaged = async () => {
        const newObject = {
            diploma_name_id: selectedDiplomaNameAdd.value,
            numberOfEmbryos: numberOfEmbryosAdd,
            seri_number_start: seri_number_startAdd,
            seri_number_end: seri_number_endAdd,
            reason: reasonAdd,
            mscb_create: user.mssv_cb
        }

        try {
            const res = await axios.post("http://localhost:8000/v1/damaged_embryos/add_list_seri_number_damaged", newObject);
            noti4.current.showToast();
            setSelectedDiplomaName({ value: '', label: 'Tất cả loại phôi' })
        } catch (error) {
            console.log(error)
        }
    }

    //Xử lý việc xóa
    const noti5 = useRef();
    const [_IdDelete, set_IdDelete] = useState("");
    const handleDeleteSeriDamaged = async () => {
        try{
            const res = await axios.delete(`http://localhost:8000/v1/damaged_embryos/delete_seri_damaged/${_IdDelete}`);
            noti5.current.showToast();
            setSelectedDiplomaName({ value: '', label: 'Tất cả loại phôi' });
        }catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Header />
            <div id='body-MODE' className="container">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card p-3">
                        <div className="row p-3">
                            <button className='btn' data-bs-toggle="modal" data-bs-target="#modalAddSeriDamaged" style={{ backgroundColor: '#fed25c', width: '170px' }}>Thêm danh sách phôi hư</button>
                        </div>

                        <div className="modal fade" id="modalAddSeriDamaged" tabIndex="-1" aria-labelledby="modalAddSeriDamagedLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header" style={{ backgroundColor: '#feefbf' }}>
                                        <h1 className="modal-title fs-5" id="modalAddSeriDamagedLabel">Thêm phôi hư</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-2">
                                                <label
                                                    htmlFor="fullname"
                                                    className="col-form-label text-end d-block"
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >Loại phôi</label>
                                            </div>
                                            <div className="col-10">
                                                <Select
                                                    options={optionsDiplomaName}
                                                    onChange={handleChangeselectedDiplomaNameAdd}
                                                    value={selectedDiplomaNameAdd}
                                                    placeholder="Chọn loại phôi"
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-2">
                                                <label
                                                    htmlFor="fullname"
                                                    className="col-form-label text-end d-block"
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >Số lượng phôi hư</label>
                                            </div>
                                            <div className="col-10">
                                                <input type="number"
                                                    value={numberOfEmbryosAdd}
                                                    onChange={(e) => {
                                                        setNumberOfEmbryosAdd(e.target.value)
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-2">
                                                <label
                                                    htmlFor="fullname"
                                                    className="col-form-label text-end d-block"
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >Nhập số seri phôi hư</label>
                                            </div>
                                            <div className="col-3">
                                                <input
                                                    type="number"
                                                    className='form-control'
                                                    placeholder='Số seri bắt đầu'
                                                    value={inputSeriStart}
                                                    onChange={(e) => {
                                                        setInputSeriStart(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="col-2 text-center">
                                                <i className="fa-solid fa-arrow-right" style={{ marginTop: '10px' }}></i>
                                            </div>
                                            <div className="col-3">
                                                <input
                                                    type="number"
                                                    className='form-control'
                                                    placeholder='Số seri kết thúc'
                                                    value={inputSeriEnd}
                                                    onChange={(e) => {
                                                        setInputSeriEnd(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="col-1">
                                                <i
                                                    className="fa-solid fa-check"
                                                    style={{ backgroundColor: "#3184fa", padding: '10px 7px 7px 7px', borderRadius: '5px', color: 'white', width: '37px', height: '37px', textAlign: 'center' }}
                                                    onClick={(e) => {
                                                        handleAddSeriToArray()
                                                    }}
                                                ></i>
                                            </div>
                                            <div className="col-1">
                                                <i
                                                    className="fa-solid fa-arrows-rotate"
                                                    style={{ backgroundColor: "#990000", padding: '10px 7px 7px 7px', borderRadius: '5px', color: 'white', width: '37px', height: '37px', textAlign: 'center' }}
                                                    onClick={(e) => {
                                                        setLowestSerialNumber(1);
                                                        setSeri_number_startAdd([]);
                                                        setSeri_number_endAdd([]);
                                                    }}
                                                ></i>
                                            </div>
                                        </div>

                                        {
                                            seri_number_startAdd?.map((currentValue, index) => {
                                                return (
                                                    <div className="row mt-3" key={index}>
                                                        <div className="col-3 offset-2">
                                                            <input
                                                                type="number"
                                                                className='form-control'
                                                                value={currentValue}
                                                                readOnly={true}

                                                            />
                                                        </div>
                                                        <div className="col-2 text-center">
                                                            <i className="fa-solid fa-arrow-right" style={{ marginTop: '10px' }}></i>
                                                        </div>
                                                        <div className="col-3">
                                                            <input
                                                                type="number"
                                                                className='form-control'
                                                                readOnly={true}
                                                                value={seri_number_endAdd[index]}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className="row mt-3">
                                            <div className="col-2">
                                                <label
                                                    htmlFor="fullname"
                                                    className="col-form-label text-end d-block"
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >Lý do</label>
                                            </div>
                                            <div className="col-10">
                                                <input type="text"
                                                    placeholder='Nhập lý do'
                                                    value={reasonAdd}
                                                    onChange={(e) => {
                                                        setReasonAdd(e.target.value)
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button type="button" className="btn" style={{ backgroundColor: '#1b95a2' }} onClick={(e) => { handleAddSeriDamaged() }}>Lưu</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6" style={{ paddingLeft: '15px' }}>
                                <Select
                                    placeholder="Tìm kiếm loại phôi"
                                    value={selectedDiplomaName}
                                    options={[{ value: '', label: "Tất cả loại phôi" }, ...optionsDiplomaName]}
                                    onChange={handleChangeSelectDiplomaName}
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <p className='title-list-yc-xin-cap-phoi'>DANH SÁCH SỐ SERI PHÔI BỊ HƯ</p>
                        </div>
                        <div className="row mt-3" style={{ padding: '0px 50px' }}>
                            <div style={{ height: '300px', overflowY: 'auto' }}>
                                <table className='table table-striped table-hover table-bordered' style={{ border: '2px solid #fed25c', textAlign: 'center' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">STT</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Tên loại phôi</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Số seri bị hư</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Lý do hư</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Trạng thái</th>
                                            <th style={{ backgroundColor: '#fed25c' }} scope="col">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            listSeriNumberDamaged?.map((currentValue, index) => {
                                                let ten_loai_phoi = '';
                                                allDiplomaName?.forEach((diplomaName) => {
                                                    if (diplomaName.diploma_name_id == currentValue.diploma_name_id) {
                                                        ten_loai_phoi = diplomaName.diploma_name_name;
                                                    }
                                                })
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{ten_loai_phoi}</td>
                                                        <td>{
                                                            // <Tooltip
                                                            //     theme='dark'
                                                            //     html={(
                                                            //         <div>
                                                            //             <strong>
                                                            //                 {handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end)}
                                                            //             </strong>
                                                            //         </div>
                                                            //     )}
                                                            //     arrow={true}
                                                            //     position="top"
                                                            // >
                                                            //     <i
                                                            //         className="fa-brands fa-periscope"

                                                            //         style={{ backgroundColor: "#2F4F4F", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                            //     ></i>
                                                            // </Tooltip>
                                                            handleResultSeri(currentValue.seri_number_start, currentValue.seri_number_end)
                                                        }</td>
                                                        <td>{currentValue.reason}</td>
                                                        <td>{currentValue.status}</td>
                                                        <td>
                                                            <i
                                                                className="fa-solid fa-trash"
                                                                style={{ backgroundColor: "red", padding: '7px', borderRadius: '5px', color: 'white', width: '32px' }}
                                                                data-bs-toggle="modal" data-bs-target="#deleteSeriDamagedModal"
                                                                onClick={(e)=>{
                                                                    set_IdDelete(currentValue._id);
                                                                }}
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                {/* Modal xóa */}
                                <div className="modal fade" id="deleteSeriDamagedModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="deleteSeriDamagedModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                                <h1 className="modal-title fs-5" id="deleteSeriDamagedModalLabel"></h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <h5>Bạn có chắc muốn xóa danh sách số seri phôi hư này</h5>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                                <button 
                                                    type="button" 
                                                    className="btn" 
                                                    style={{backgroundColor: '#1b95a2'}}
                                                    onClick={(e)=>{
                                                        handleDeleteSeriDamaged()
                                                    }}
                                                >Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <Toast
                message="Vui lòng nhập đầy đủ số seri"
                type="warning"
                ref={noti}
            />
            <Toast
                message={`Số seri bắt đầu phải lớn hơn hoặc bằng ${lowestSerialNumber}`}
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Số seri kết thúc phải lớn hơn hoặc bằng số seri bắt đầu"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Thêm danh sách phôi hư thành công"
                type="success"
                ref={noti4}
            />
            <Toast
                message="Xóa thành công"
                type="success"
                ref={noti5}
            />
        </>
    )
}
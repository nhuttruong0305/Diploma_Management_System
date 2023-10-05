import Header from '../Header/Header';
import axios from 'axios';
import './DiplomaIssuance.css';
import {getAllDiplomaIssuanceByMU, getAllDiplomaName, addDiplomaIssuanceByMU } from '../../redux/apiRequest';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import Toast from '../Toast/Toast';

export default function DiplomaIssuance(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const allDiplomaIssuance = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.allDiplomaIssuances); //state đại diện cho all đợt cấp văn bằng lấy từ redux
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]); //state này để lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const [options, setOptions] = useState([]);
    
    //Thông báo và focus vào trường chọn tên văn bằng khi chưa chọn
    const noti = useRef();
    const inputAddDiplomaNameOfFormRef = useRef();

    //Thông báo và focus vào trường nhập tên
    const noti2 = useRef();
    const inputAddDiplomaIssuanceNameOfFormRef = useRef();

    //Thông báo khi thêm thành công đợt cấp văn bằng
    const noti3 = useRef();
    const msg = useSelector((state) => state.diplomaIssuance?.msg);
    const isError = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.error);

    //2 state này dùng để hiện thông tin ở phần thông tin chung
    const [inputSelectDiplomaName, setInputSelectDiplomaIssuanceName] = useState(null); //state này đại diện cho select được chọn của tên văn bằng (selectOption.value)
    const [inputDiplomaIssuanceName, setInputDiplomaIssuanceName] = useState('');

    //2 state này dùng để lấy giá trị dùng cho việc thêm đợt cấp văn bằng mới
    const [inputAddDiplomaNameOfForm, setInputAddDiplomaNameOfForm] = useState(null);
    const [inputAddDiplomaIssuanceNameOfForm, setInputAddDiplomaIssuanceNameOfForm] = useState('');

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect để lấy ra all đợt cấp của các loại văn bằng được quản lý bởi đơn vị quản lý của tài khoản cán bộ có quyền Diploma importer
    useEffect(()=>{
        getAllDiplomaName(dispatch);
        getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        getAllDiplomaNameByMU(user.management_unit);
    }, []);

    //Gọi useEffect để lấy các giá trị từ state allDiplomaNameByMU để tạo options cho select, options là 1 mảng các object có kiểu như ví dụ bên dưới
    // const options = [
    //     { value: "chocolate", label: "Chocolate" },
    //     { value: "strawberry", label: "Strawberry" },
    //     { value: "vanilla", label: "Vanilla" }
    // ];
    
    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptions(resultOption);
    }, [allDiplomaNameByMU])

    const handleChange = (selectedOption) => {
        setInputSelectDiplomaIssuanceName(selectedOption);
    }

    const handleChangeFormAdd = (selectedOption) => {
        setInputAddDiplomaNameOfForm(selectedOption);
    }

    //Hàm submit form để thêm đợt cấp văn bằng mới
    const handleSubmitAddDiplomaIssuance = async (e) => {
        e.preventDefault();
        if(inputAddDiplomaNameOfForm == null){
            noti.current.showToast();
            inputAddDiplomaNameOfFormRef.current.focus();
            return;
        }

        if(inputAddDiplomaIssuanceNameOfForm == ""){
            noti2.current.showToast();
            inputAddDiplomaIssuanceNameOfFormRef.current.focus();
            return;
        }
        const DiplomaIssuanceInfor = {
            diploma_issuance_name: inputAddDiplomaIssuanceNameOfForm,
            diploma_name_id: inputAddDiplomaNameOfForm.value
        }
        await addDiplomaIssuanceByMU(dispatch, user.accessToken, DiplomaIssuanceInfor);
        noti3.current.showToast();  
        await getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
    }
 
    // console.log("select form add: ", inputAddDiplomaNameOfForm);
    // console.log("name: ", inputAddDiplomaIssuanceNameOfForm);

    return(
        <>
            <Header/>
            <div className="container" id='body-DI'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        {/* <div className="row p-3"> */}
                            <div className='p-3'>
                                <button 
                                    id='add-diploma-issuance-DI' 
                                    className='btn'
                                    type='button'
                                    data-bs-toggle="modal" 
                                    data-bs-target="#modalAddDiplomaIssuance"
                                ><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
                            </div>
                            <div className="row" style={{padding: '5px 28px 5px 28px'}}>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                        <th scope="col"></th>
                                        <th scope="col">Tên đợt cấp văn bằng</th>
                                        <th scope="col">Tên văn bằng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaIssuance?.map((currentValue, index) => {
                                                let nameOfDiplomaName = '';
                                                allDiplomaName.forEach((diplomaName)=>{
                                                    if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                        nameOfDiplomaName = diplomaName.diploma_name_name;
                                                    }
                                                })
                                                return(
                                                    <tr 
                                                        key={index}
                                                        onClick={(e)=>{
                                                            setInputDiplomaIssuanceName(currentValue.diploma_issuance_name);
                                                            options.forEach((option)=>{
                                                                if(option.value == currentValue.diploma_name_id){
                                                                    setInputSelectDiplomaIssuanceName(option);
                                                                }
                                                            })

                                                        }}
                                                    >
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{currentValue.diploma_issuance_name}</td>
                                                        <td>{nameOfDiplomaName}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='row' style={{padding: '0px 0px 0px 20px'}}>
                                <p 
                                    style={{color: '#297fbb', fontWeight: 'bold', marginLeft:'10px', paddingLeft: '0px'}}
                                >Thông tin chung</p>                                
                            </div>
                            <div className='row mt-2'>
                                <div className="col-md-2">
                                    <label 
                                        className='col-form-label text-end d-block'>
                                        Tên văn bằng
                                    </label>
                                </div>
                                <div className="col-md-4">
                                    <Select
                                        isDisabled={true}
                                        value={inputSelectDiplomaName}
                                        options={options}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-2">
                                    <label 
                                        htmlFor="nameOfDiplomaIssuance"
                                        className='col-form-label text-end d-block'
                                    >
                                        Tên đợt cấp văn bằng
                                    </label>
                                </div>
                                <div className="col-md-4">
                                    <input 
                                        type="text"
                                        value={inputDiplomaIssuanceName}
                                        onChange={(e)=>{
                                            setInputDiplomaIssuanceName(e.target.value);
                                        }}
                                        className='form-control'
                                        id='nameOfDiplomaIssuance'
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className='d-flex justify-content-end'>
                                    <div className='mx-2'>
                                        <button className='btn' style={{backgroundColor: '#0b619d', width:'110px'}}>Lưu</button>
                                    </div>
                                    <div className='mx-2'>
                                        <button className='btn btn-danger' style={{ width:'110px'}}>Xóa</button>
                                    </div>
                                    <div className='mx-2'>
                                        <button className='btn' style={{border: '1px solid black', width:'110px'}}>Hủy bỏ</button>
                                    </div>
                                </div>
                                
                            </div>
                        
                        {/* Modal thêm đợt cấp văn bằng */}
                        <div className="modal fade" id="modalAddDiplomaIssuance" tabIndex="-1" aria-labelledby="modalAddDiplomaIssuanceLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="modalAddDiplomaIssuanceLabel">Thêm đợt cấp văn bằng mới</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form
                                        id='form-add-diplomaIssuance'
                                        onSubmit={(e)=>{
                                            handleSubmitAddDiplomaIssuance(e);
                                        }}
                                    >
                                        <div className="row">
                                            <div className="col-2">
                                                <label
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >
                                                    Tên văn bằng
                                                </label>
                                            </div>
                                            <div className='col-10'>
                                                <Select
                                                    ref={inputAddDiplomaNameOfFormRef}
                                                    value={inputAddDiplomaNameOfForm}
                                                    options={options}
                                                    onChange={handleChangeFormAdd}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-2">
                                                <label 
                                                    htmlFor="input-add-diplomaIssuanceName-DI"
                                                    className='col-form-label text-end d-block'
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >
                                                    Tên đợt cấp văn bằng
                                                </label>
                                            </div>
                                            <div className="col-10">
                                                <input 
                                                    className='form-control'
                                                    ref={inputAddDiplomaIssuanceNameOfFormRef}
                                                    value={inputAddDiplomaIssuanceNameOfForm}
                                                    onChange={(e)=>{
                                                        setInputAddDiplomaIssuanceNameOfForm(e.target.value);
                                                    }}
                                                    type="text" 
                                                    id='input-add-diplomaIssuanceName-DI'    
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        data-bs-dismiss="modal"
                                    >Đóng</button>
                                    <button 
                                        type="submit"
                                        form='form-add-diplomaIssuance'
                                        className="btn btn-primary"
                                    >Lưu</button>
                                </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Toast
                message="Bạn chưa chọn tên văn bằng"
                type="warning"
                ref={noti}
            />
            <Toast
                message="Bạn chưa nhập tên đợt cấp văn bằng"
                type="warning"
                ref={noti2}
            />
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti3}
            />
        </>
    )
}
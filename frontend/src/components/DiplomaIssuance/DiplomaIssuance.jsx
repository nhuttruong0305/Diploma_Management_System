import Header from '../Header/Header';
import axios from 'axios';
import './DiplomaIssuance.css';
import {getAllDiplomaIssuanceByMU, getAllDiplomaName, addDiplomaIssuanceByMU, editDiplomaIssuanceByMU, deleteDiplomaIssuance } from '../../redux/apiRequest';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";
import Toast from '../Toast/Toast';
import Footer from '../Footer/Footer';
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
    const inputDiplomaIssuanceNameRef = useRef();

    //Thông báo khi thêm thành công hoặc lỗi khi thêm đợt cấp văn bằng
    const noti3 = useRef();
    const msg = useSelector((state) => state.diplomaIssuance?.msg);
    const isError = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.error);

    const noti4 = useRef();

    //msgEdit
    const msgEdit = useSelector((state) => state.diplomaIssuance?.msgForEdit);
    const isErrorEdit = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.error);

    //2 state này dùng để hiện thông tin ở phần thông tin chung
    const [inputSelectDiplomaName, setInputSelectDiplomaIssuanceName] = useState(null); //state này đại diện cho select được chọn của tên văn bằng (selectOption.value)
    const [inputDiplomaIssuanceName, setInputDiplomaIssuanceName] = useState('');
    const [_idOfDiplomaIssuance, set_idOfDiplomaIssuance] = useState(''); //State này dùng để lấy _id để cập nhật
    const [diplomaNameId, setDiplomaNameId] = useState(null); //state này để lấy diploma_name_id dùng để cập nhật đợt cấp văn bằng

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
            if(user.listOfDiplomaNameImport.includes(currentValue.diploma_name_id)){
                const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
                resultOption = [...resultOption, newOption];
            }
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
        setTimeout(async()=>{
            await getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        }, 2000)
    }

    //Hàm submit form để cập nhật tên đợt cấp văn bằng
    const handleSubmitEditDiplomaIssuance = async (e) => {
        e.preventDefault();
        if(inputDiplomaIssuanceName == ""){
            noti2.current.showToast();
            inputDiplomaIssuanceNameRef.current.focus();
            return;
        }

        const DiplomaIssuanceInfor = {
            diploma_issuance_name: inputDiplomaIssuanceName,
            diploma_name_id: diplomaNameId
        }

        await editDiplomaIssuanceByMU(dispatch, user.accessToken, DiplomaIssuanceInfor, _idOfDiplomaIssuance);
        noti4.current.showToast();  
        setTimeout(async()=>{
            await getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        }, 2000);
    }

    //xử lý logic xóa đợt cấp văn bằng
    const msgDelete = useSelector((state) => state.diplomaIssuance?.msgDelete);
    const isErrorDelete = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.error);
    const noti5 = useRef();
    const noti6 = useRef();

    const handleDeleteDiplomaIssuance = async () => {
        if(_idOfDiplomaIssuance == ""){
            noti6.current.showToast();
            return;
        }
        await deleteDiplomaIssuance(dispatch, user.accessToken, _idOfDiplomaIssuance);
        noti5.current.showToast();
        setTimeout( async ()=>{
            await getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
        },2000);
    }

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
                            <div className="row" style={{padding: '5px 28px 5px 28px'}} id='contain-table-show-all-DI'>
                                <table 
                                    // className="table table-bordered"
                                    id='table-showDI'
                                >
                                    <thead>
                                        <tr>
                                            <th style={{padding: '10px'}}></th>
                                            <th style={{padding: '10px'}}>Tên đợt cấp văn bằng</th>
                                            <th style={{padding: '10px'}}>Tên văn bằng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaIssuance?.map((currentValue, index) => {
                                                // const listOfDiplomaNameImport = user.listOfDiplomaNameImport;
                                                if(user.listOfDiplomaNameImport.includes(currentValue.diploma_name_id)){
                                                    let nameOfDiplomaName = '';
                                                    allDiplomaName?.forEach((diplomaName)=>{
                                                        if(diplomaName.diploma_name_id == currentValue.diploma_name_id){
                                                            nameOfDiplomaName = diplomaName.diploma_name_name;
                                                        }
                                                    })
                                                    return(
                                                        <tr 
                                                            key={index}
                                                            onClick={(e)=>{
                                                                setInputDiplomaIssuanceName(currentValue.diploma_issuance_name);
                                                                set_idOfDiplomaIssuance(currentValue._id);
                                                                setDiplomaNameId(currentValue.diploma_name_id);
                                                                options.forEach((option)=>{
                                                                    if(option.value == currentValue.diploma_name_id){
                                                                        setInputSelectDiplomaIssuanceName(option);
                                                                    }
                                                                })
                                                                const currentElement = document.querySelector(".item-selected-DI");
                                                                if (currentElement) {
                                                                    currentElement.classList.remove("item-selected-DI");
                                                                }
                                                                e.target.parentNode.classList.add("item-selected-DI");
                                                            }}
                                                        >
                                                            <th style={{width: '50px', textAlign: 'center'}}>{index + 1}</th>
                                                            <td>{currentValue.diploma_issuance_name}</td>
                                                            <td>{nameOfDiplomaName}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='row' style={{padding: '0px 0px 0px 20px'}}>
                                <p 
                                    style={{color: '#1b95a2', fontWeight: 'bold', marginLeft:'10px', paddingLeft: '0px'}}
                                >Thông tin chung</p>                                
                            </div>
                            <form
                                id='form-edit-diploma-issuance'
                                onSubmit={(e) => {
                                    handleSubmitEditDiplomaIssuance(e);
                                }}
                            >
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
                                            ref={inputDiplomaIssuanceNameRef}
                                            onChange={(e)=>{
                                                setInputDiplomaIssuanceName(e.target.value);
                                            }}
                                            className='form-control'
                                            id='nameOfDiplomaIssuance'
                                        />
                                    </div>
                                </div>
                            </form>
                            
                            <div className="row mt-2">
                                <div className='d-flex justify-content-end'>
                                    <div className='mx-2'>
                                        <button 
                                            className='btn' 
                                            type='submit'
                                            form='form-edit-diploma-issuance'
                                            style={{backgroundColor: '#1b95a2', width:'110px', color: 'white'}}
                                        >Lưu</button>
                                    </div>
                                    <div className='mx-2'>
                                        <button 
                                            className='btn btn-danger' 
                                            style={{ width:'110px'}}
                                            onClick={(e)=>{
                                                handleDeleteDiplomaIssuance()
                                            }}
                                        >Xóa</button>
                                    </div>
                                    <div className='mx-2'>
                                        <button 
                                            className='btn' 
                                            style={{ width:'110px', color: 'white', backgroundColor: 'grey'}}
                                            onClick={(e) => {
                                                setInputSelectDiplomaIssuanceName(null);
                                                setInputDiplomaIssuanceName('');
                                                set_idOfDiplomaIssuance("");

                                                const currentElement = document.querySelector(".item-selected-DI");
                                                if (currentElement) {
                                                    currentElement.classList.remove("item-selected-DI");
                                                }
                                            }}
                                        >Hủy bỏ</button>
                                    </div>
                                </div>
                                
                            </div>
                        
                        {/* Modal thêm đợt cấp văn bằng */}
                        <div className="modal fade" id="modalAddDiplomaIssuance" tabIndex="-1" aria-labelledby="modalAddDiplomaIssuanceLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered">
                                <div className="modal-content">
                                <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
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
                                        className="btn"
                                        style={{backgroundColor: '#1b95a2'}}
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
            <Toast
                message={msgEdit}
                type={isErrorEdit ? "error" : "success"}
                ref={noti4}
            />
            <Toast
                message={msgDelete}
                type={isErrorDelete ? "error" : 'success'}
                ref={noti5}
            />
            <Toast
                message="Vui lòng chọn đợt cấp văn bằng cần xóa"
                type="warning"
                ref={noti6}
            />
            <Footer/>
        </>
    )
}
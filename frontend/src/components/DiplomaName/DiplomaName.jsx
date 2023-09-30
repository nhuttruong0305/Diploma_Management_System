//Quản lý danh mục tên văn bằng
import './DiplomaName.css';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName, getAllDiplomaType, addDiplomaName, editDiplomaName } from '../../redux/apiRequest';
import Toast from '../Toast/Toast';

export default function DiplomaName(){
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state lấy ra all diploma name
    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType); //state lấy ra all diploma type

    const [diplomaNameInput, setDiplomaNameInput] = useState(''); // state đại diện cho input diploma name
    const [choose_diplomaTypeId, setChooseDiplomaTypeId] = useState(); // state đại diện cho id diploma type được chọn

    const [diplomaNameEditInput, setDiplomaNameEditInput] = useState(''); //state đại diện cho diploma name input trong form chỉnh sửa thông tin tên văn bằng
    const [choose_diplomaTypeIdEdit, setChoose_diplomaTypeIdEdit] = useState(); //state đại diện cho id diploma type trong form chỉnh sửa thông tin tên văn bằng
    const [DiplomaNameIdEdit, setDiplomaNameIdEdit] = useState('') // state đại diện cho _id dùng để truyền vào api để cập nhật

    const user = useSelector((state) => state.auth.login?.currentUser); // lấy thông tin user để lấy accessToken
    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();

    //ref dùng để focus vào input khi gặp lỗi chưa điền đủ thông tin khi nhập form thêm diploma name
    const diplomaNameInputRef = useRef();
    const diplomaTypeIdSelect = useRef();

    //ref dùng để focus vào input khi gặp lỗi chưa điền đủ thông tin khi nhập form chỉnh sửa
    const diplomaTypeIdSelectEdit = useRef();
    const diplomaNameEditInputRef = useRef();

    const msg = useSelector((state) => state.diplomaName?.msg);
    const isError = useSelector((state) => state.diplomaName.diplomaNames?.error);

    //Gọi useEffect để lấy tất cả DiplomaName
    useEffect(() => {
        getAllDiplomaName(dispatch);
        getAllDiplomaType(dispatch);
    }, []);    
    //Hàm submit thêm tên văn bằng mới
    const handleSubmitAddDiplomaName = async (e) => {
        e.preventDefault();
        //Báo lỗi khi chưa nhập tên văn bằng
        if(diplomaNameInput == ""){
            noti2.current.showToast();
            diplomaNameInputRef.current.focus();
            return;
        }

        //Báo lỗi khi chưa chọn loại văn bằng
        if(choose_diplomaTypeId == "" || choose_diplomaTypeId == undefined){
            noti3.current.showToast();
            diplomaTypeIdSelect.current.focus();
            return;
        }

        const DiplomaNameInfor = {
            diploma_name_name: diplomaNameInput,
            diploma_type_id: choose_diplomaTypeId,
            isCheckDuplicate: true
        }

        await addDiplomaName(DiplomaNameInfor, dispatch, user.accessToken);
        noti.current.showToast();  
        await getAllDiplomaName(dispatch);      
    }

    //Hàm submit để chỉnh sửa thông tin tên văn bằng
    const handleSubmitEditDiplomaName = async (e) => {
        e.preventDefault();
        //Báo lỗi khi chưa nhập tên văn bằng
        if(diplomaNameEditInput == ""){
            noti2.current.showToast();
            diplomaNameEditInputRef.current.focus();
            return;
        }

        //Báo lỗi khi chưa chọn loại văn bằng
        if(choose_diplomaTypeIdEdit == "" || choose_diplomaTypeIdEdit == undefined){
            noti3.current.showToast();
            diplomaTypeIdSelectEdit.current.focus();
            return;
        }
        
        
        const DiplomaNameEditInfor = {
            diploma_name_name: diplomaNameEditInput,
            diploma_type_id: choose_diplomaTypeIdEdit 
        };

        await editDiplomaName(DiplomaNameEditInfor, dispatch, user.accessToken, DiplomaNameIdEdit);
        noti.current.showToast();  
        console.log("msg: ", msg);
        await getAllDiplomaName(dispatch);
    }
    
    return(
        <>
            <Header/>
            <div className="container" id='body-diplomaname'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/diploma-type'><li className="list-group-item">Danh mục loại văn bằng</li></Link>
                                    <Link style={{textDecoration: 'none'}} to='/decentralize-diploma-management'>
                                        <li className="list-group-item">Phân quyền quản lý văn bằng</li>
                                    </Link>
                                    <li id='active-diplomaname' className="list-group-item">Danh mục tên văn bằng</li>
                                    <li className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <div className='card p-3'>
                                <div>
                                    <button 
                                        type='button' 
                                        id='add-diploma-name'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalAddDiplomaName"
                                    ><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
                                </div>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Tên văn bằng</th>
                                            <th scope="col">Loại văn bằng</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaName?.map((currentValue, index) => {
                                                let nameOfDiplomaType = '';
                                                allDiplomaType?.forEach((diplomaType) => {
                                                    if(currentValue.diploma_type_id == diplomaType.diploma_type_id){
                                                        nameOfDiplomaType = diplomaType.diploma_type_name;
                                                    }
                                                })
                                                return(
                                                    <tr key={index}>
                                                        <th scope='row'>{index + 1}</th>
                                                        <td>{currentValue.diploma_name_name}</td>
                                                        <td>{nameOfDiplomaType}</td>
                                                        <td>
                                                            <i
                                                                onClick={(e) => {
                                                                    setDiplomaNameEditInput(currentValue.diploma_name_name);
                                                                    setChoose_diplomaTypeIdEdit(currentValue.diploma_type_id);
                                                                    setDiplomaNameIdEdit(currentValue.diploma_name_id);
                                                                }}
                                                                type='button' 
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#modalEditDiplomaName"
                                                                className="fa-solid fa-eye"
                                                            ></i>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>

                                {/* Modal để thêm loại văn bằng */}
                                <div className="modal fade" id="modalAddDiplomaName" tabIndex="-1" aria-labelledby="modalAddDiplomaNameLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="modalAddDiplomaNameLabel">Thêm tên văn bằng mới</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form
                                                id='form-add-diplomaName-diplomaName'
                                                onSubmit={(e) => {
                                                    handleSubmitAddDiplomaName(e);
                                                }}
                                            >   
                                                <div className="row">
                                                    <div className="col-2">
                                                        <label
                                                            htmlFor='input-add-diplomaname-diplomaName'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input
                                                            id='input-add-diplomaname-diplomaName'
                                                            type='text'
                                                            ref={diplomaNameInputRef}
                                                            className='form-control'
                                                            value={diplomaNameInput}
                                                            onChange={(e) => {
                                                                setDiplomaNameInput(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label 
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }} 
                                                        >
                                                            Loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <select 
                                                            ref={diplomaTypeIdSelect}
                                                            value={choose_diplomaTypeId}
                                                            onChange={(e) => {
                                                                setChooseDiplomaTypeId(e.target.value);
                                                            }}
                                                            className="form-select" 
                                                            aria-label="Default select example"
                                                        >
                                                            <option value="">-- Loại văn bằng --</option>
                                                            {
                                                                allDiplomaType?.map((currentValue, index) => {
                                                                    return(
                                                                        <option
                                                                            key={index}
                                                                            value={currentValue.diploma_type_id}
                                                                        >
                                                                            {currentValue.diploma_type_name}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>    
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-add-diplomaName-diplomaName' 
                                                className="btn btn-primary"
                                            >Thêm</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal để chỉnh sửa tên văn bằng */}
                                <div className="modal fade" id="modalEditDiplomaName" tabIndex="-1" aria-labelledby="modalEditDiplomaNameLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="modalEditDiplomaNameLabel">Sửa thông tin tên văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form
                                                id='form-edit-diplomaName-diplomaName'
                                                onSubmit={(e) => {
                                                    handleSubmitEditDiplomaName(e);
                                                }}
                                            >   
                                                <div className="row">
                                                    <div className="col-2">
                                                        <label
                                                            htmlFor='input-edit-diplomaname-diplomaName'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input
                                                            id='input-edit-diplomaname-diplomaName'
                                                            type='text'
                                                            ref={diplomaNameEditInputRef}
                                                            className='form-control'
                                                            value={diplomaNameEditInput}
                                                            onChange={(e) => {
                                                                setDiplomaNameEditInput(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label 
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }} 
                                                        >
                                                            Loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <select 
                                                            ref={diplomaTypeIdSelectEdit}
                                                            value={choose_diplomaTypeIdEdit}
                                                            onChange={(e) => {
                                                                setChoose_diplomaTypeIdEdit(e.target.value);
                                                            }}
                                                            className="form-select" 
                                                            aria-label="Default select example"
                                                        >
                                                            <option value="">-- Loại văn bằng --</option>
                                                            {
                                                                allDiplomaType?.map((currentValue, index) => {
                                                                    return(
                                                                        <option
                                                                            key={index}
                                                                            value={currentValue.diploma_type_id}
                                                                        >
                                                                            {currentValue.diploma_type_name}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>    
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-edit-diplomaName-diplomaName' 
                                                className="btn btn-primary"
                                            >Lưu</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>






                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lỗi khi đã nhập đầy đủ thông tin */}
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti}
            />

            {/* Lỗi khi chưa nhập đầy đủ thông tin     */}
            <Toast
                message="Vui lòng nhập tên văn bằng"
                type="warning"
                ref={noti2}
            />

            <Toast
                message="Vui lòng chọn loại văn bằng"
                type="warning"
                ref={noti3}
            />
        </>
    );
}
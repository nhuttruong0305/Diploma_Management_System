import { useEffect, useState, useRef } from 'react';

import './DiplomaType.css';
import Header from '../Header/Header';
import {getAllDiplomaType, addDiplomaType} from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../Toast/Toast';

export default function DiplomaType(){
    const dispatch = useDispatch();
    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType);
    const [diplomaName, setDiplomaName] = useState('');
    const user = useSelector((state) => state.auth.login?.currentUser);
    const msg = useSelector((state) => state.diplomaType?.msg);
    const noti = useRef();
    const isError = useSelector((state) => state.diplomaType.diplomaTypes?.error);

    //Gọi useEffect để lấy tất cả Diploma type
    useEffect(()=>{
        getAllDiplomaType(dispatch);
    }, []);

    //Hàm submit thêm loại văn bằng 
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDiploma = {
            diploma_type_name: diplomaName
        }
        
        await addDiplomaType(newDiploma , dispatch, user.accessToken);
        noti.current.showToast();
        await getAllDiplomaType(dispatch);
    }
 
    return(
        <>
            <Header/>
            <div className="container" id='body-diplomatype'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li id='active-diplomatype' className="list-group-item">Danh mục loại văn bằng</li>
                                    <li className="list-group-item">Phân quyền quản lý văn bằng</li>
                                    <li className="list-group-item">Danh mục tên văn bằng</li>
                                    <li className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-9">
                            <div className="card p-3">
                                <div>
                                    <button type='button' id='add-diploma-type' data-bs-toggle="modal" data-bs-target="#modalAddDiplomaType"><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
                                </div>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Tên loại văn bằng</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {
                                                allDiplomaType?.map((currentValue, index) => {
                                                    return(
                                                        <tr key={index}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{currentValue.diploma_type_name}</td>
                                                            <td><i className="fa-solid fa-eye"></i></td>
                                                        </tr>
                                                    )
                                                })   
                                            } 
                                    </tbody>
                                </table>
                                
                                <div className="modal fade" id="modalAddDiplomaType" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalAddDiplomaTypeLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="modalAddDiplomaTypeLabel">Thêm mới loại văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form 
                                                id='form-add-diplomatype'
                                                onSubmit={(e)=>{
                                                    handleSubmit(e);
                                                }}>
                                                <div className="row">
                                                    <div className='col-2'>
                                                        <label
                                                            htmlFor=''
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className='col-10'>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={diplomaName}
                                                            onChange={(e) => {
                                                                setDiplomaName(e.target.value)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-add-diplomatype' 
                                                className="btn btn-primary"
                                            >Thêm</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
            </div>
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti}
            />
        </>
    )
}

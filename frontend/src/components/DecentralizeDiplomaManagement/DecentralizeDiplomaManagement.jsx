import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Header from '../Header/Header';
import './DecentralizeDiplomaManagement.css';
import TableShowDiplomaName from './TableShowDiplomaName';
import { useEffect, useState } from 'react';
import {searchDiplomaName} from '../../redux/apiRequest';

export default function DecentralizeDiplomaManagement(){
    // const [allDiplomaName, setAllDiplomaName] = useState([]) //state lấy ra all diploma name
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state lấy ra all diploma name
    const [inputSearchDDM, setInputSearchDDM] = useState(''); //state đại diện cho input nhập để tìm kiếm tên văn bằng
    const [chooseDiplomaStatusDDM, setChooseDiplomaStatusDDM] = useState('');
    const dispatch = useDispatch();

    useEffect(()=>{
        searchDiplomaName(dispatch, inputSearchDDM, chooseDiplomaStatusDDM);
    }, [inputSearchDDM, chooseDiplomaStatusDDM]);

    return(
        <>
            <Header/>
            <div className="container" id='body-decentralizeDiplomaManagement'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/diploma-type'>
                                        <li className="list-group-item">Danh mục loại văn bằng</li>
                                    </Link>
                                    <li id='active-decentralizeDiplomaManagement' className="list-group-item">Phân quyền quản lý văn bằng</li>
                                    <Link style={{textDecoration: 'none'}} to='/diploma-name'><li className="list-group-item">Danh mục tên văn bằng</li></Link>
                                    <li className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                </ul>
                            </div>
                        </div>

                        <div className='col-md-9'>
                            <div className="card p-3">
                                <div className='mt-3'>
                                    <form>
                                        <div className="row">
                                            <div className="col-4">
                                                <input 
                                                    value={inputSearchDDM}
                                                    onChange={(e)=>{
                                                        setInputSearchDDM(e.target.value);
                                                    }}
                                                    className='form-control'
                                                    id='input-diploname-search-decentralizeDiplomaManagement'
                                                    placeholder='Nhập tên văn bằng muốn tìm kiếm'
                                                />        
                                            </div>
                                            <div className='col-4'>
                                                <select 
                                                    className='form-select'
                                                    value={chooseDiplomaStatusDDM}
                                                    onChange={(e)=>{
                                                        setChooseDiplomaStatusDDM(e.target.value);
                                                    }}
                                                >
                                                    <option 
                                                        value=""
                                                    >--Chọn trạng thái văn bằng--</option>
                                                    <option 
                                                        value={true}
                                                    >Đã phân quyền</option>
                                                    <option 
                                                        value={false}
                                                    >Chưa phân quyền</option>
                                                </select>
                                            </div>    
                                            {/* <div className="col-4">
                                                <button className='btn' style={{backgroundColor:'#0b619d', color: 'white'}}><i className="fa-solid fa-filter"></i></button>
                                            </div> */}
                                        </div>
                                    </form>
                                </div>

                                <TableShowDiplomaName
                                    data={allDiplomaName}
                                    inputSearch={inputSearchDDM}
                                    status={chooseDiplomaStatusDDM}
                                ></TableShowDiplomaName>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
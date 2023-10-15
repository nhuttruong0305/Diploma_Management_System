import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import './DiplomaNameManagementHistory.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {searchDiplomaNameForDNMH} from '../../redux/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../Footer/Footer';
export default function DiplomaNameManagementHistory(){
    const [inputSearch, setInputSearch] = useState(''); //state đại diện cho input để lọc văn bằng theo tên
    const [inputMU, setInputMU] = useState(); //state đại diện cho input để lọc văn bằng theo đơn vị quản lý
    const [allMU, setAllMU] = useState([]); //state đại diện cho all MU được lấy ra từ DB
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName);

    const dispatch = useDispatch();
    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setAllMU(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect để lấy ra all MU
    useEffect(() => {   
        getAllManagementUnit();
    },[])

    //Gọi useEffect khi 1 trong 2 state thay đổi
    useEffect(()=>{ 
        searchDiplomaNameForDNMH(dispatch, inputSearch, inputMU);
    }, [inputSearch, inputMU]);

    return(
        <>
            <Header/>
            <div className='container' id='body-DNMH'>
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
                                    <Link style={{textDecoration: 'none'}} to='/decentralize-diploma-management'>
                                        <li className="list-group-item">Phân quyền quản lý văn bằng</li>
                                    </Link>
                                    <Link style={{textDecoration: 'none'}} to='/diploma-name'><li className="list-group-item">Danh mục tên văn bằng</li></Link>
                                    <li id='active-DNMH' className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <div className='card p-3'>
                                <div className="row">
                                    <div className="col-4">
                                        {/* Lọc theo đơn vị */}
                                        <select 
                                            className='form-select'
                                            value={inputMU}
                                            onChange={(e)=>{
                                                setInputMU(e.target.value);
                                            }}
                                        >
                                            <option 
                                                value=""
                                            >--Lọc theo đơn vị--
                                            </option>

                                            {
                                                allMU?.map((currentValue, index) => {
                                                    return(
                                                        <option
                                                            key={index}
                                                            value={currentValue.management_unit_id}
                                                        >{currentValue.management_unit_name}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-4">
                                        {/* Lọc theo tên văn bằng */}
                                        <input
                                            type='text'
                                            value={inputSearch}
                                            onChange={(e)=>{
                                                setInputSearch(e.target.value);
                                            }}
                                            className='form-control'
                                            placeholder='Tìm kiếm theo tên văn bằng'
                                        />
                                    </div>
                                </div>
                                <table className='table mt-3'>
                                    <thead>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Đơn vị quản lý</th>
                                            <th scope="col">Tên văn bằng</th>
                                            <th scope="col">Từ ngày</th>
                                            <th scope="col">Đến ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allDiplomaName?.map((diploma, index) => {
                                                let nameOFMU ='';
                                                allMU?.forEach((MU)=>{
                                                    if(MU.management_unit_id == diploma.management_unit_id){
                                                        nameOFMU = MU.management_unit_name;                                                        
                                                    }
                                                })
                                                return(
                                                    <tr key={index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{nameOFMU}</td>
                                                        <td>
                                                            {diploma.diploma_name_name}
                                                        </td>
                                                        <td>
                                                            {diploma.from}
                                                        </td>
                                                        <td>
                                                            {diploma.to}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        
                                        
                                        {/* <tr>
                                            <th scope="row">1</th>
                                            <td>Trường Kinh tế</td>
                                            <td>
                                                Chứng chỉ A tin học
                                            </td>
                                            <td>
                                                10-11-2023
                                            </td>
                                            <td>
                                                20-12-2023
                                            </td>
                                        </tr> */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}
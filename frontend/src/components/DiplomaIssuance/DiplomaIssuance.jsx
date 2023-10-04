import Header from '../Header/Header';
import axios from 'axios';
import './DiplomaIssuance.css';
import {getAllDiplomaIssuanceByMU, getAllDiplomaName} from '../../redux/apiRequest';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from "react-select";

export default function DiplomaIssuance(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const allDiplomaIssuance = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.allDiplomaIssuances); //state đại diện cho all đợt cấp văn bằng lấy từ redux
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]); //state này để lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const [options, setOptions] = useState([]);

    const [inputSelectDiplomaName, setInputSelectDiplomaIssuanceName] = useState(null); //state này đại diện cho select được chọn của tên văn bằng (selectOption.value)
    const [inputDiplomaIssuanceName, setInputDiplomaIssuanceName] = useState('');

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

    console.log("Select: ", inputSelectDiplomaName);
    console.log("Issuance name: ",inputDiplomaIssuanceName);

    return(
        <>
            <Header/>
            <div className="container" id='body-DI'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        {/* <div className="row p-3"> */}
                            <div className='p-3'>
                                <button id='add-diploma-issuance-DI' className='btn'><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
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
                        {/* </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}
import Header from '../Header/Header'
import Select from "react-select";
import './ImportDiploma.css';
import Toast from '../Toast/Toast';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getAllDiplomaIssuanceByMU} from '../../redux/apiRequest';

export default function ImportDiploma(){
    const user = useSelector((state) => state.auth.login?.currentUser);
    const dispatch = useDispatch();
    
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]); //state này để lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select có id select-DiplomaName-ID
    const [options, setOptions] = useState([]); //options cho component Select có id select-DiplomaName-ID
    const allDiplomaIssuance = useSelector((state) => state.diplomaIssuance.diplomaIssuances?.allDiplomaIssuances); //state đại diện cho all đợt cấp văn bằng lấy từ redux dùng cho select có id select-DiplomaIssuance-ID
    const [optionsOfDiplomIssuance, setOptionsOfDiplomIssuance] = useState();//state này để chứa options của Select có id select-DiplomaIssuance-ID

    //Đầu tiên lấy all diploma issuance từ redux ra, rồi dựa theo selected option của
    //Select chọn tên văn bằng để lọc ra các đợt cấp văn bằng

    //state này để chứa các đợt cấp văn bằng của 1 loại văn bằng cụ thể
    const [listOfDiplomaIssuance, setListOfDiplomaIssuance] = useState([]);
    const [selectedOptionDiplomaName, setSelectedOptionDiplomaName] = useState();//state để lưu selectedOption của component Select tên văn bằng

    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //Gọi useEffect để lấy ra tất cả các văn bằng được quản lý bởi management_unit của tài khoản
    //Và tất cả đợt cấp văn bằng của các tên văn bằng đó
    useEffect(()=>{
        getAllDiplomaNameByMU(user.management_unit);
        getAllDiplomaIssuanceByMU(dispatch, user.management_unit);
    },[])

    //Gọi useEffect khi state allDiplomaNameByMU thay đổi thì set lại state options
    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = { value: currentValue.diploma_name_id, label: currentValue.diploma_name_name };
            resultOption = [...resultOption, newOption];
        })
        setOptions(resultOption);
    }, [allDiplomaNameByMU])

    const handleChangeSelectedOptionDiplomaName = (selectedOption) => {
        setSelectedOptionDiplomaName(selectedOption);
    };

    //Gọi useEffect để khi select option thay đổi thì các select của tên đợt cấp văn bằng thay đổi
    useEffect(()=>{
        let result = [];
        if(selectedOptionDiplomaName != undefined){
            allDiplomaIssuance.forEach((currentValue) => {
                if(currentValue.diploma_name_id == selectedOptionDiplomaName.value){
                    result = [...result, currentValue];
                }
            })
            setListOfDiplomaIssuance(result);
        };
    }, [selectedOptionDiplomaName]);
    
    //Gọi useEffect để khi listOfDiplomaIssuance thì optionsOfDiplomIssuance thay đổi



    console.log("all diploma name by mu: ", allDiplomaNameByMU);
    console.log("all đợt cấp văn bằng: ", allDiplomaIssuance);
    console.log("select option: ", selectedOptionDiplomaName);
    console.log("dot cap van bang theo ten van bang", listOfDiplomaIssuance);
    return(
        <>
            <Header/> 
            <div className="container" id='body-import-diploma'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-md-6">
                                {/* Select chọn tên văn bằng */}
                                <Select
                                    id='select-DiplomaName-ID'
                                    options={options}
                                    placeholder="Chọn tên văn bằng"
                                    onChange={handleChangeSelectedOptionDiplomaName}
                                    value={selectedOptionDiplomaName}
                                />
                            </div>
                            <div className="col-md-6">
                                <Select
                                    id='select-DiplomaIssuance-ID'
                                    // options = 
                                    placeholder="Chọn đợt cấp văn bằng"
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className='d-flex justify-content-start'>
                                <div className='ms-3'>
                                    <button style={{width: '110px', backgroundColor: '#0b619d'}} className='btn'>Thêm mới</button>
                                </div>
                                <div className='ms-3'>
                                    <button style={{width: '110px', backgroundColor: '#0b619d'}} className='btn'>Import</button>
                                </div>
                                <div className='ms-3'>
                                    <button style={{width: '110px', backgroundColor: '#297fbb'}} className='btn'>Mẫu Import</button>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2 p-3'>
                            <div className='col-md-3'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc theo họ tên'
                                    className='form-control'    
                                />
                            </div>
                            <div className='col-md-2'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc số hiệu'
                                    className='form-control'    
                                />
                            </div>
                            <div className='col-md-2'>
                                <input 
                                    type="text" 
                                    placeholder='Lọc số vào sổ'
                                    className='form-control'    
                                />
                            </div>
                            <div className='col-md-3'>
                                <Select
                                    placeholder='Chọn trạng thái văn bằng'
                                    options={
                                        [
                                            { value: "Chờ duyệt", label: "Chờ duyệt" },
                                            { value: "Đã duyệt", label: "Đã duyệt" },
                                            { value: "Không duyệt", label: "Không duyệt" }
                                        ]
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
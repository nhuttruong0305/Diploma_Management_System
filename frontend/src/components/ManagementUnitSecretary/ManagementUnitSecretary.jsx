//Trang Nhật ký nhận phôi của tài khoản có chức vụ Thư ký của đơn vị quản lý

import './ManagementUnitSecretary.css'
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
export default function ManagementUnitSecretary(){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    //State lấy ra all diploma name theo đơn vị quản lý
    const [allDiplomaNameByMU, setAllDiplomaNameByMU] = useState([]);
    //Hàm lấy ra các tên (loại văn bằng) được quản lý bởi đơn vị quản lý của tài khoản Diploma importer dùng cho select
    const getAllDiplomaNameByMU = async (management_unit_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma_name/get_all_diplomaNameByMU/${management_unit_id}`);
            setAllDiplomaNameByMU(res.data);
        }catch(error){
            console.log(error);
        }
    }

    //State options của select có id = select-diploma-name
    const [optionsSelectDiplomaName, setOptionsSelectDiplomaName] = useState([]);
    const [selectedSelectDiplomaName, setSelectedSelectDiplomaName] = useState({value:"", label: "Tất cả loại phôi"});
    const handleChangeSelectDiplomaName = (selectedOption) => {
        setSelectedSelectDiplomaName(selectedOption);
    }

    useEffect(()=>{
        getAllDiplomaNameByMU(user.management_unit);
    }, [])

    useEffect(()=>{
        let resultOption = [];
        allDiplomaNameByMU?.forEach((currentValue)=>{
            const newOption = {value: currentValue.diploma_name_id, label: currentValue.diploma_name_name};
            resultOption = [...resultOption, newOption];
        })
        setOptionsSelectDiplomaName(resultOption);
    }, [allDiplomaNameByMU])

    const [loaiYC, setLoaiYC] = useState({value: 'Tất cả loại phiếu', label: 'Tất cả loại phiếu'});
    const handleChangeLoaiYC = (selectedOption) => {
        setLoaiYC(selectedOption)
    }

    return(
        <>
            <Header/>
            <div id='body-management-unit-secretary' className="container">
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className='card pb-3'>
                        <div className="row p-3">
                            <div className="col-4">
                                <Select
                                    id='select-diploma-name'
                                    options={optionsSelectDiplomaName}
                                    value={selectedSelectDiplomaName}
                                    onChange={handleChangeSelectDiplomaName}
                                />
                            </div>
                            <div className="col-4">
                                <input 
                                    type="text" 
                                    placeholder='Tìm kiếm theo mã phiếu'
                                    className='form-control'
                                />
                            </div>
                            <div className="col-4">
                                <Select
                                    id='select-loai-phieu'
                                    options={[
                                        {value: 'Tất cả loại phiếu', label: 'Tất cả loại phiếu'},
                                        {value: 'Yêu cầu xin cấp mới', label: 'Yêu cầu xin cấp mới'},
                                        {value: 'Yêu cầu xin cấp lại', label: 'Yêu cầu xin cấp lại'}
                                    ]}
                                    value={loaiYC}
                                    onChange={handleChangeLoaiYC}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )   
}

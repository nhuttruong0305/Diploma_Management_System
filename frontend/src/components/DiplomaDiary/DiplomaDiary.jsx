import './DiplomaDiary.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from "react-select";
import { useEffect, useState } from 'react';
import axios from 'axios';
export default function DiplomaDiary(){
    //state hiển thị all diploma đã duyệt hoặc không duyệt được hiển thị trong table
    const [allApprovedDiploma, setApprovedDiploma] = useState([]);
    const [officerName, setOfficerName] = useState("");
    const [mscb, setMscb] = useState("");
    const [status, setStatus] = useState();

    const handleChangeStatus = (selectedOption) => {
        setStatus(selectedOption);
    }
    
    const getAllDiplomaForDiplomaDiary = async (officerName, mscb, status) =>{
        try{
            if(status == undefined){
                status = "";
            }
            const result = await axios.get(`http://localhost:8000/v1/diploma/search_diploma_for_diploma_diary?officer_name=${officerName}&mscb=${mscb}&status=${status}`);
            setApprovedDiploma(result.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        getAllDiplomaForDiplomaDiary(officerName, mscb, status?.value);
    }, [officerName, mscb, status]);

    console.log(allApprovedDiploma);

    return(
        <>
            <Header/>
            <div className="container" id='body-diploma-diary'>
                <div  style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="card pb-3">
                        <div className="row p-3">
                            <div className="col-md-4">
                                <input 
                                    type="text" 
                                    placeholder='Tìm kiếm theo họ tên cán bộ'
                                    className='form-control'
                                    value={officerName}
                                    onChange={(e)=>{
                                        setOfficerName(e.target.value)
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <input 
                                    type="text" 
                                    className='form-control'
                                    value={mscb}
                                    onChange={(e)=>{
                                        setMscb(e.target.value)
                                    }}
                                    placeholder='Tìm kiếm theo mã số cán bộ'      
                                />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    id='operation-DD'
                                    value={status}
                                    onChange={handleChangeStatus}
                                    options={
                                        [
                                            {value: "", label: "Tất cả trạng thái"},
                                            {value: "Đã duyệt", label: "Đã duyệt"},
                                            {value: "Không duyệt", label: "Không duyệt"}
                                        ]
                                    }
                                />
                            </div>
                        </div>
                        <div className="row mt-2 p-4">
                            <div id='contain-table-show-DD'>
                                <table
                                    className="table table-bordered"
                                    id='table-show-DD'
                                >   
                                    <thead>
                                        <tr>
                                            <th style={{width: '50px'}} scope="col">STT</th>
                                            <th scope="col">Mã cán bộ</th>
                                            <th scope="col">Tên cán bộ</th>
                                            <th scope="col">Mã văn bằng</th>
                                            <th scope="col">Thao tác</th>
                                            <th scope="col">Thời điểm</th>
                                            <th scope="col">Diễn giải</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allApprovedDiploma?.map((currentValue, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <th scope='row'>{index + 1}</th>
                                                        <td>{currentValue.mscb}</td>
                                                        <td>{currentValue.officer_name}</td>
                                                        <td>{currentValue.diploma_id}</td>
                                                        <td>{currentValue.status}</td>
                                                        <td>{currentValue.time}</td>
                                                        <td>{currentValue.explain}</td>
                                                    </tr>
                                                )
                                            })
                                        }
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
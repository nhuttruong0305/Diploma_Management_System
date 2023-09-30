import { useEffect, useState } from "react";
import axios from 'axios';

export default function TableShowDiplomaName({data}){
    const [allManagementUnit, setManagementUnit]= useState([]);

    //Hàm lấy ra tất cả các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            setManagementUnit(res.data);
            return res.data;
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        const res = getAllManagementUnit();
    }, [])
    return(
        <>
            <table className='table mt-3'>
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Tên văn bằng</th>
                        <th scope="col">Tên đơn vị</th>
                        <th scope="col">Từ ngày</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((dataValue, index) => {
                            let nameManagementUnit = '';
                            allManagementUnit?.forEach((management_unit)=>{
                                if(management_unit.management_unit_id == dataValue.management_unit_id){
                                    nameManagementUnit = management_unit.management_unit_name;
                                }
                            })

                            return(
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{dataValue.diploma_name_name}</td>
                                    <td>
                                        {
                                            nameManagementUnit
                                        }

                                    </td>
                                    <td>{dataValue.from}</td>
                                    <td>
                                        <i 
                                            className="fa-solid fa-eye"
                                        ></i>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}
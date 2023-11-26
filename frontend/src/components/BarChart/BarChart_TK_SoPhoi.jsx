//Biểu đồ thống kê phôi đã cấp
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';
import axios from 'axios';
Chart.register(...registerables);

const BarChart_TK_SoPhoi = ({
                                statisticalType, 
                                phoi_da_cap_theo_thang,
                                phoi_da_cap_theo_dvql
                            }) => {
    //State chứa all management unit trong DB, trừ tổ quản lý VBCC ra
    const [allManagementUnit, setAllManagementUnit] = useState([]);


    //Hàm call api lấy danh sách các đơn vị quản lý
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            let result = [];
            res.data.forEach((currentValue)=>{
                if(currentValue.management_unit_id != 13){
                    result = [...result, handleManagementUnit(currentValue.management_unit_name)];
                }
            })
            setAllManagementUnit(result);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getAllManagementUnit();
    }, [])

    const handleManagementUnit = (management_unit) => {
        const resultSplit = management_unit.split(" ");
        let finalResult = "";
        resultSplit.forEach((currentValue) => {
          if (currentValue == "&") {
            finalResult += ` ${currentValue[0].toUpperCase()} `;
          } else {
            finalResult += currentValue[0].toUpperCase();
          }
        });
        return finalResult;
    };

    if(statisticalType == "Thống kê theo tháng"){
        const data = {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            datasets: [
                {
                    label: "Số phôi đã cấp",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: phoi_da_cap_theo_thang,
                },
            ],
        };
    
        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
    
        return <Bar data={data} options={options} />;
    }
    if(statisticalType == "Thống kê theo đơn vị quản lý"){
        const data = {
            labels: allManagementUnit,
            datasets: [
                {
                    label: "Số phôi đã cấp",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: phoi_da_cap_theo_dvql,
                },
            ],
        };
    
        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };
    
        return <Bar data={data} options={options} />;
    }
};

export default BarChart_TK_SoPhoi;
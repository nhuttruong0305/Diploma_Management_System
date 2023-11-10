import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables} from 'chart.js';

Chart.register(...registerables);
const BarChart = ({statisticalType}) => {
    if(statisticalType == "Thống kê theo tháng"){
        const data = {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
            datasets: [
                {
                    label: "Văn bằng được nhập",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(75,192,192,0.4)",
                    hoverBorderColor: "rgba(75,192,192,1)",
                    data: [65, 59, 80, 81, 65, 59, 80, 81, 65, 59, 80, 81],
                  },
                  {
                    label: "Văn bằng được duyệt",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: [45, 30, 50, 70, 45, 30, 50, 70, 45, 30, 50, 70],
                  },
                  {
                    label: "Yêu cầu xin cấp phôi được tạo",
                    backgroundColor: "rgba(255,206,86,0.2)",
                    borderColor: "rgba(255,206,86,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,206,86,0.4)",
                    hoverBorderColor: "rgba(255,206,86,1)",
                    data: [80, 70, 65, 55, 80, 70, 65, 55, 80, 70, 65, 55],
                  },
                  {
                    label: "Yêu cầu xin cấp phôi được xử lý",
                    backgroundColor: "rgba(54,162,235,0.2)",
                    borderColor: "rgba(54,162,235,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(54,162,235,0.4)",
                    hoverBorderColor: "rgba(54,162,235,1)",
                    data: [30, 50, 40, 60, 30, 50, 40, 60, 30, 50, 40, 60],
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
            labels: ["1", "2", "3", "4", "5"],
            datasets: [
                {
                    label: "Sales Data",
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(75,192,192,0.4)",
                    hoverBorderColor: "rgba(75,192,192,1)",
                    data: [65, 59, 80, 81, 56],
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
    // const data = {
    //     labels: ["January", "February", "March", "April", "May"],
    //     datasets: [
    //         {
    //             label: "Sales Data",
    //             backgroundColor: "rgba(75,192,192,0.2)",
    //             borderColor: "rgba(75,192,192,1)",
    //             borderWidth: 1,
    //             hoverBackgroundColor: "rgba(75,192,192,0.4)",
    //             hoverBorderColor: "rgba(75,192,192,1)",
    //             data: [65, 59, 80, 81, 56],
    //         },
    //     ],
    // };

    // const options = {
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //         },
    //     },
    // };

    // return <Bar data={data} options={options} />;
};

export default BarChart;




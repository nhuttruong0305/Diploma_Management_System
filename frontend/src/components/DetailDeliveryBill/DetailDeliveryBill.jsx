import './DetailDeliveryBill.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDiplomaName } from '../../redux/apiRequest';
import axios from 'axios';
export default function DetailDeliveryBill({delivery_bill, delivery_bill_creation_time, fullname_of_consignee, address_department, reason, export_warehouse, address_export_warehouse, embryo_type, numberOfEmbryos, seri_number_start, seri_number_end, unit_price, mscb}){
    const dispatch = useDispatch();
    
    //Xử lý lấy ra ngày lập phiếu
    const [dateCreate, setDateCreate] = useState([]);

    //Hàm tạo file pdf yêu cầu cấp phôi
    const convertToImage = async () => {
        const element = document.getElementById("file-delivery-bill"); // Thay "your-element-id" bằng ID của phần muốn chuyển đổi
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        // Bây giờ bạn có một hình ảnh dưới dạng dữ liệu chuỗi, có thể lưu nó hoặc sử dụng nó dựa trên nhu cầu.
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 230); // Chèn hình ảnh vào PDF
    
        pdf.save("phieu_xuat_kho.pdf");
    };

    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

    useEffect(()=>{
        const splitDate = delivery_bill_creation_time.split("-");
        setDateCreate(splitDate);
        getAllManagementUnit();
        getAllDiplomaName(dispatch);
        getAllUserAccount();
    }, [])

    //Xử lý việc lấy ra địa chỉ, bộ phận nhận sản phẩm (thực chất là đơn vị quản lý)
    //State chứa all management unit trong DB trừ tổ QLVBCC
    const [allManagementUnit, setAllManagementUnit] = useState([]);
    const [embryoReceiptAddress, setEmbryoReceiptAddress] = useState("");
    const getAllManagementUnit = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/management_unit/get_all_management_unit");
            let result = [];
            res.data.forEach((currentValue)=>{
                result = [...result, currentValue];
            })
            setAllManagementUnit(result);
        }catch(error){
            console.log(error);
        }
    }
    
    useEffect(()=>{
        allManagementUnit?.forEach((management_unit)=>{
            if(management_unit.management_unit_id == address_department){
                setEmbryoReceiptAddress(management_unit.management_unit_name);
            }
        })
    }, [address_department, allManagementUnit])

    //Xử lý lấy ra tên loại phôi (thực chất là tên văn bằng)
    const [nameOfEmbryoType, setNameOfEmbryoType] = useState("");
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng

    useEffect(()=>{
        allDiplomaName?.forEach((currentValue)=>{
            if(currentValue.diploma_name_id == embryo_type){
                setNameOfEmbryoType(currentValue.diploma_name_name)
            }
        })
    }, [embryo_type, allDiplomaName])

    //Xử lý lấy ra tên cán bộ tạo phiếu
    //State lấy ra all user trong DB để lấy tên cán bộ tạo yêu cầu
    const [allUserAccount, setAllUserAccount] = useState([]);
    const [creator, setCreator] = useState("");
    //Hàm gọi api lấy all user trong DB
    const getAllUserAccount = async () => {
        try{
            const res = await axios.get("http://localhost:8000/v1/user_account/get_all_useraccount");
            setAllUserAccount(res.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        allUserAccount?.forEach((currentValue)=>{
            if(currentValue.mssv_cb == mscb){
                setCreator(currentValue.fullname);
            }
        })
    }, [mscb, allUserAccount])

    const handleSeri = (seriNumber) => {
        let seriAfterProcessing = seriNumber.toString();
        switch(seriAfterProcessing.length){
            case 1:
                seriAfterProcessing = `00000${seriAfterProcessing}`;
                break;
            case 2:
                seriAfterProcessing = `0000${seriAfterProcessing}`;  
                break;
            case 3:
                seriAfterProcessing = `000${seriAfterProcessing}`;  
                break;      
            case 4:
                seriAfterProcessing = `00${seriAfterProcessing}`;  
                break;    
            case 5:
                seriAfterProcessing = `0${seriAfterProcessing}`;  
                break;   
            case 6:
                seriAfterProcessing = `${seriAfterProcessing}`;  
                break;   
        }
        return seriAfterProcessing;
    }
    return(
        <>
            <div className="row">
                <p style={{ textAlign: 'center', fontSize: '27px', color: "#1b95a2", fontWeight: 'bold' }}>CHI TIẾT PHIẾU XUẤT KHO</p>
                <div className="d-flex justify-content-center">
                    <div id='show-file-delivery-bill'>
                        <div id="file-delivery-bill" style={{fontSize: '21px'}}>
                            <div className='d-flex justify-content-between' style={{fontWeight: 'bold'}}>
                                <div>Đơn vị:........</div>
                                <div style={{marginRight:'130px'}}>Mẫu số 02 - VT</div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div style={{fontWeight: 'bold'}}>
                                    Bộ phận:.........
                                </div>
                                <div style={{textAlign: 'center'}}>
                                    <div>
                                        (Ban hành theo Thông tư số 200/2014/TT-BTC
                                    </div>
                                    <div>
                                        Ngày 22/12/2014 của Bộ Tài chính)
                                    </div>
                                </div>
                            </div>
                            <div style={{marginTop: '90px', fontSize: '26px', fontWeight: 'bold', textAlign: 'center'}}>
                                PHIẾU XUẤT KHO
                            </div>
                            <div style={{textAlign: 'center', fontStyle: 'italic', marginTop: '10px'}}>
                                Ngày {dateCreate[2]}.. tháng {dateCreate[1]}.. năm {dateCreate[0]}..
                            </div>
                            <div style={{textAlign: 'center'}}>
                                Số: {delivery_bill}...............
                            </div>
                            <div className='d-flex justify-content-between' style={{marginTop: '50px'}}>
                                <div>- Họ tên người nhận hàng: {fullname_of_consignee}</div>
                                <div>Địa chỉ (bộ phận): {embryoReceiptAddress}</div>
                            </div>
                            <div style={{marginTop: '15px'}}>
                                - Lý do xuất kho: {reason}
                            </div>
                            <div className='d-flex justify-content-between' style={{marginTop: '15px'}}>
                                <div>
                                    - Xuất tại kho (ngăn lô): {export_warehouse}
                                </div>
                                <div>
                                    Địa điểm: {address_export_warehouse}
                                </div>
                            </div>
                            <div style={{marginTop:'30px'}}>
                                <table id='table-delivery-bill-detail'> 
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>STT</th>
                                            <th style={{ textAlign: 'center', width: '350px' }}>Loại phôi</th>
                                            <th style={{ textAlign: 'center' }}>Số lượng xuất</th>
                                            <th style={{ textAlign: 'center' }}>Số seri</th>
                                            <th style={{ textAlign: 'center' }}>Đơn giá</th>
                                            <th style={{ textAlign: 'center' }}>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{textAlign: 'center'}}>
                                            <td>1</td>
                                            <td>{nameOfEmbryoType}</td>
                                            <td>{numberOfEmbryos}</td>
                                            <td>{`${handleSeri(seri_number_start)} - ${handleSeri(seri_number_end)}`}</td>
                                            <td>{formatter.format(unit_price)}</td>
                                            <td>{formatter.format(unit_price*numberOfEmbryos)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{marginTop: '70px'}}>
                                - Tổng số tiền (viết bằng chữ) ..............................................................................................................................
                            </div>
                            <div className='d-flex justify-content-end' style={{marginTop: '45px', fontStyle: 'italic'}}>
                                Ngày .... tháng .... năm ....
                            </div>
                            <div className='d-flex justify-content-between text-center' style={{marginTop: '20px'}}>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Người lập phiếu</div>
                                    <div>(Ký, họ tên)</div>
                                    <div style={{marginTop: '120px'}}>{creator}</div>
                                </div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Người nhận hàng</div>
                                    <div>(Ký, họ tên)</div>
                                </div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Thủ kho</div>
                                    <div>(Ký, họ tên)</div>
                                </div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Kế toán trưởng</div>
                                    <div>(Ký, họ tên)</div>
                                </div>
                                <div>
                                    <div style={{fontWeight: 'bold'}}>Giám đốc</div>
                                    <div>(Ký, họ tên)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex mt-4 justify-content-end"> 
                <button
                    className="btn"
                    style={{ width: '100px', backgroundColor: '#df4e4f', marginRight: '90px', color: 'white'}}
                    onClick={(e)=>{
                        convertToImage();
                    }}
                >
                    Xuất file
                </button>
            </div>
        </>
    )
}
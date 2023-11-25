import './UnitPriceManagement.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { searchDiplomaName } from '../../redux/apiRequest';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Toast from '../Toast/Toast';
export default function UnitPriceManagement(){
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state đại diện cho all diploma name để lấy ra tên văn bằng   
    const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

    //State chứa value tìm phôi theo tên
    const [inputNameSearch, setInputNameSearch] = useState("");

    useEffect(()=>{
        searchDiplomaName(dispatch, inputNameSearch, "");
    }, [inputNameSearch])

    //State chứa giá sẽ được thiết lập/cập nhật
    const [unit_price, setUnit_price] = useState("");
    //State chứa diploma_name_id cần cập nhật giá
    const [diploma_name_idUpdatePrice, setDiploma_name_idUpdatePrice] = useState(null)
    
    const noti = useRef();

    //Hàm cập nhật giá
    const updateUnitPrice = async () => {
        try{
            const updateDoc = {
                unit_price: parseInt(unit_price)
            }

            const updateUnitPrice = await axios.put(`http://localhost:8000/v1/diploma_name/update_unit_price/${diploma_name_idUpdatePrice}`, updateDoc);
            noti.current.showToast();
            setTimeout(()=>{
                searchDiplomaName(dispatch, inputNameSearch, "");
            },2000 )
        }catch(error){
            console.log(error);
        }
    }

    return(
        <>
            <Header/>
                <div className="container" id='body-unit-price-management'>
                    <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                        <div className="card pb-3">
                            <div className="row p-3">
                                <div className="col-6">
                                    <input 
                                        type="text" 
                                        placeholder='Nhập tên loại phôi cần tìm'
                                        value={inputNameSearch}
                                        onChange={(e)=>{
                                            setInputNameSearch(e.target.value)
                                        }}
                                        className='form-control'
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <p className='title-list-yc-xin-cap-phoi'>GIÁ CÁC LOẠI PHÔI</p>
                            </div>
                            <div className="row mt-3" style={{padding: '0px 50px'}}>
                                <div id="contain-table-unit-price">
                                    <table className='table table-striped table-hover table-bordered' style={{ border: '2px solid #fed25c', textAlign: 'center'}}>
                                        <thead>
                                            <tr>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">STT</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Tên loại phôi</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Giá mỗi phôi</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Điều chỉnh giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            
                                                {
                                                    allDiplomaName?.map((currentValue, index)=>{
                                                        return(
                                                            <tr key={index}>
                                                                <td>
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    {currentValue.diploma_name_name}
                                                                </td>
                                                                <td>
                                                                    {formatter.format(currentValue.unit_price)}
                                                                </td>
                                                                <td>
                                                                    <i 
                                                                        className="fa-solid fa-money-check-dollar"
                                                                        style={{backgroundColor: "#df4e4f", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                        data-bs-toggle="modal" data-bs-target="#setUnitPrice"
                                                                        onClick={(e)=>{
                                                                            setDiploma_name_idUpdatePrice(currentValue.diploma_name_id);
                                                                            if(currentValue.unit_price == null){
                                                                                setUnit_price("")
                                                                            }else{
                                                                                setUnit_price(currentValue.unit_price);
                                                                            }
                                                                        }}
                                                                    ></i>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Modal điều chỉnh/thiết lập giá */}
                            <div className="modal fade" id="setUnitPrice" tabIndex="-1" aria-labelledby="setUnitPriceLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="setUnitPriceLabel">Điều chỉnh giá</h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-4">
                                                <label
                                                    htmlFor="fullname"
                                                    className="col-form-label text-end d-block"
                                                    style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                >Nhập giá mới</label>
                                            </div>
                                            <div className="col-8">
                                                <input 
                                                    type="number" 
                                                    value={unit_price}
                                                    onChange={(e)=>{
                                                        setUnit_price(e.target.value);
                                                    }}
                                                    className='form-control'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                        <button 
                                            type="button" 
                                            className="btn"
                                            style={{backgroundColor: "#1b95a2"}}
                                            onClick={(e)=>{
                                                updateUnitPrice();
                                            }}
                                        >Lưu</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <Footer/>
            <Toast
                message="Cập nhật giá thành công"
                type="success"
                ref={noti}
            />
        </>
    )
}
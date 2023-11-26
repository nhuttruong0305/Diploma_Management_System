import { useEffect, useLayoutEffect, useState, useRef } from "react";
import axios from 'axios';
import Toast from '../Toast/Toast';
import {decentralizationDiplomaName, searchDiplomaName, transferDiplomaName, addDiplomaName} from '../../redux/apiRequest';
import { useDispatch, useSelector } from "react-redux";

export default function TableShowDiplomaName({data, inputSearch, status}){
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login?.currentUser);
    const msg = useSelector((state) => state.diplomaName?.msgForDDM);
    const msgPQ = useSelector((state) => state.diplomaName?.msgPQ);
    const [allManagementUnit, setManagementUnit]= useState([]); //state để lấy ra all đơn vị quản lý
    const [inputShowDiplomaName, setInputShowDiplomaName] = useState(''); //state đại diện cho ô input show diploname
    const [inputChooseMUTableShowDiplomaName, setInputChooseMUTableShowDiplomaName] = useState(); //state đại diện cho đơn vị quản lý của diploma name
    const [dateFrom, setDateFrom] = useState(''); //state đại diện cho ngày bắt đầu 
    const [readOnlyState, setReadOnlyState] = useState(false); //state đại diện cho
    const [idDiplomaName, setIdDiplomaName] = useState(); //state đại diện cho id được lấy ra để cập nhật (id được lấy là trường _id trong mongo) 
    const [showDec, setShowDec] = useState(false); //satate đại diện cho việc show form phân quyền hay form chuyển: true là show form phân quyền, false là form chuyển

    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();
    const noti4 = useRef();
    const noti5 = useRef();
    const select1 = useRef();
    const date1 = useRef();
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

    //Hàm phân quyền cho đơn vị quản lý
    const handleDecentralization = async (e) => {
        e.preventDefault();
        if(inputChooseMUTableShowDiplomaName == ""){
            noti2.current.showToast();
            select1.current.focus();
            return;
        }

        //Chỉ cho phép chọn ngày lớn hơn hoặc bằng ngày hiện tại
        const getDate = dateFrom.split("-");
    
        const currentDate = new Date();
        const day = currentDate.getDate(); // Lấy ngày
        const month = currentDate.getMonth() + 1; // Lấy tháng (chú ý: tháng bắt đầu từ 0)
        const year = currentDate.getFullYear(); // Lấy năm
        
        if(getDate[0]<year){
            noti4.current.showToast();
            date1.current.focus();
            return;
        }

        if(getDate[0]==year && getDate[1]<month){
            noti4.current.showToast();
            date1.current.focus();
            return;
        }
        
        if(getDate[0]==year && getDate[1]==month && getDate[2]<day){
            noti4.current.showToast();
            date1.current.focus();
            return;
        }


        if(dateFrom == ""){
            noti3.current.showToast();
            date1.current.focus();
            return;
        }
        const dataUpdate = {
            management_unit_id: inputChooseMUTableShowDiplomaName,
            from: dateFrom
        }
        await decentralizationDiplomaName(dataUpdate, dispatch, user.accessToken, idDiplomaName);
        noti5.current.showToast();
        setTimeout( async() => {
            await searchDiplomaName(dispatch, inputSearch, status);
        }, 200);
    }

    // useLayoutEffect(()=>{
    //     if(msg!=""){
    //         noti.current.showToast();
    //     }
    // }, [msg])

    //Hàm chuyển
    //State diplomaNameIdUsedToDeleteList dùng để lấy ra diploma_name_id dùng để khi chuyển thì xóa diploma_name_id này ra khỏi 2 danh sách: listOfDiplomaNameImport và listOfDiplomaNameReview của user
    const [diplomaNameIdUsedToDeleteList, setDiplomaNameIdUsedToDeleteList] = useState();
    const handleTransfer = async (e) => {
        e.preventDefault();
        await transferDiplomaName(dispatch, user.accessToken, idDiplomaName, diplomaNameIdUsedToDeleteList);

        const DiplomaNameInfor = {
            diploma_name_name: inputShowDiplomaName,
            diploma_type_id: 1,
            isCheckDuplicate: false
        }
        await addDiplomaName(DiplomaNameInfor, dispatch, user.accessToken);
        noti.current.showToast();
        setTimeout(async()=>{
            await searchDiplomaName(dispatch, inputSearch, status);
        }, 200)
    }

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
                                            type='button'
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalShow_MU_OfDiplomaName"
                                            style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                            onClick={()=>{
                                                setInputShowDiplomaName(dataValue.diploma_name_name);
                                                setIdDiplomaName(dataValue._id);
                                                setDiplomaNameIdUsedToDeleteList(dataValue.diploma_name_id);
                                                if(dataValue.management_unit_id == null){
                                                    setInputChooseMUTableShowDiplomaName(""); 
                                                    setDateFrom("");
                                                    setReadOnlyState(false);
                                                    setShowDec(true);
                                                }else{
                                                    setInputChooseMUTableShowDiplomaName(dataValue.management_unit_id);
                                                    setDateFrom(dataValue.from);
                                                    setReadOnlyState(true);
                                                    setShowDec(false);
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
            {/* Modal show thông tin về đơn vị quản lý của tên văn bằng - Phân quyền*/}
                    
            <div className="modal fade" id="modalShow_MU_OfDiplomaName" tabIndex="-1" aria-labelledby="modalShow_MU_OfDiplomaNameLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="modalShow_MU_OfDiplomaNameLabel">Thông tin chung</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">

                        {/* Form phân quyền */}
                        {
                            showDec ? (
                                <form
                                    id="formShow_MU_OfDiplomaName"
                                    onSubmit={(e) => {
                                        handleDecentralization(e);
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-2">
                                            <label
                                                htmlFor='input-show-diplomaname-table-show-diplomaname'
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Tên văn bằng
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                readOnly={true}
                                                value={inputShowDiplomaName}
                                                type="text" 
                                                id="input-show-diplomaname-table-show-diplomaname"
                                                className='form-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label    
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Tên đơn vị
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <select 
                                                disabled={readOnlyState}
                                                className="form-select" 
                                                aria-label="Default select example"
                                                value={inputChooseMUTableShowDiplomaName}
                                                onChange={(e) => {
                                                    setInputChooseMUTableShowDiplomaName(e.target.value);
                                                }}
                                                ref={select1}
                                            >
                                                <option value="">-- Đơn vị quản lý --</option>
                                                {
                                                    allManagementUnit?.map((currentValue, index) => {
                                                        return(
                                                            <option
                                                                key={index}
                                                                value={currentValue.management_unit_id}
                                                            >
                                                                {currentValue.management_unit_name}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Từ ngày
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <input
                                                type="date"
                                                readOnly={readOnlyState}
                                                value={dateFrom}
                                                className="form-control"
                                                onChange={(e)=>{
                                                    setDateFrom(e.target.value);
                                                }}
                                                ref={date1}
                                            />
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <form 
                                    id="formShow_MU_OfDiplomaNameTransfer"
                                    onSubmit = {(e)=>{
                                        handleTransfer(e);
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-2">
                                            <label
                                                htmlFor='input-show-diplomaname-table-show-diplomanameTransfer'
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Tên văn bằng
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <input 
                                                readOnly={true}
                                                value={inputShowDiplomaName}
                                                type="text" 
                                                id="input-show-diplomaname-table-show-diplomanameTransfer"
                                                className='form-control'
                                            />
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label    
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Tên đơn vị
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <select 
                                                disabled={readOnlyState}
                                                className="form-select" 
                                                aria-label="Default select example"
                                                value={inputChooseMUTableShowDiplomaName}
                                                onChange={(e) => {
                                                    setInputChooseMUTableShowDiplomaName(e.target.value);
                                                }}
                                            >
                                                <option value="">-- Đơn vị quản lý --</option>
                                                {
                                                    allManagementUnit?.map((currentValue, index) => {
                                                        return(
                                                            <option
                                                                key={index}
                                                                value={currentValue.management_unit_id}
                                                            >
                                                                {currentValue.management_unit_name}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-2">
                                            <label
                                                className='col-form-label text-end d-block'
                                                style={{ fontSize: '12px', fontStyle: 'italic' }}
                                            >
                                                Từ ngày
                                            </label>
                                        </div>
                                        <div className="col-10">
                                            <input
                                                type="date"
                                                readOnly={readOnlyState}
                                                value={dateFrom}
                                                className="form-control"
                                                onChange={(e)=>{
                                                    setDateFrom(e.target.value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </form>
                            )
                        }

                    </div>
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >Đóng</button>

                        {
                            showDec ? (
                                <button 
                                    type="submit" 
                                    form="formShow_MU_OfDiplomaName"
                                    className="btn"
                                    style={{backgroundColor: '#1b95a2'}}
                                >Lưu</button>
                            ) : (
                                <button
                                    type="submit"
                                    form="formShow_MU_OfDiplomaNameTransfer"
                                    className="btn btn-info"
                                >
                                    Chuyển
                                </button>
                            )
                        }
                    </div>
                    </div>
                </div>
            </div>            

            <Toast
                message="Vui lòng chọn đơn vị quản lý"
                type="warning"
                ref={noti2}
            />
            <Toast
                message="Vui lòng chọn ngày bắt đầu"
                type="warning"
                ref={noti3}
            />
            <Toast
                message="Vui lòng chọn ngày bắt đầu lớn hơn ngày hiện tại"
                type="warning"
                ref={noti4}
            />
            <Toast
                message={msg}
                type="success"
                ref={noti}
            />
            <Toast
                message={msgPQ}
                type="success"
                ref={noti5}
            />
        </>
    )
}
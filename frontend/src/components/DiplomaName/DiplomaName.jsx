//Quản lý danh mục tên văn bằng
import './DiplomaName.css';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchDiplomaName, getAllDiplomaName, getAllDiplomaType, addDiplomaName, editDiplomaName, deleteDiplomaName } from '../../redux/apiRequest';
import Toast from '../Toast/Toast';
import Footer from '../Footer/Footer';
import axios from 'axios';
export default function DiplomaName(){
    const dispatch = useDispatch();
    const allDiplomaName = useSelector((state) => state.diplomaName.diplomaNames?.allDiplomaName); //state lấy ra all diploma name
    const allDiplomaType = useSelector((state) => state.diplomaType.diplomaTypes?.allDiplomaType); //state lấy ra all diploma type

    const [diplomaNameInput, setDiplomaNameInput] = useState(''); // state đại diện cho input diploma name
    const [choose_diplomaTypeId, setChooseDiplomaTypeId] = useState(); // state đại diện cho id diploma type được chọn
    const [checkOptionDiplomaNameAdd, setCheckOptionDiplomaNameAdd] =useState([]);//State để lưu mảng option trong modal thêm tên văn bằng
    function handleCheckOptionDiplomaNameAdd(option) {
        setCheckOptionDiplomaNameAdd((prev) => {
          const exist = checkOptionDiplomaNameAdd.includes(option);
          if (exist) {
            return prev.filter((currentValue) => {
              return currentValue != option;
            });
          } else {
            return [...prev, option];
          }
        });
    }
    
    const [diplomaNameEditInput, setDiplomaNameEditInput] = useState(''); //state đại diện cho diploma name input trong form chỉnh sửa thông tin tên văn bằng
    const [choose_diplomaTypeIdEdit, setChoose_diplomaTypeIdEdit] = useState(); //state đại diện cho id diploma type trong form chỉnh sửa thông tin tên văn bằng
    const [DiplomaNameIdEdit, setDiplomaNameIdEdit] = useState('') // state đại diện cho _id dùng để truyền vào api để cập nhật
    const [checkOptionDiplomaNameEdit, setCheckOptionDiplomaNameEdit] = useState([]); //state để lưu mảng option trong modal chỉnh sửa tên văn bằng
    function handleCheckOptionDiplomaNameEdit(option){
        setCheckOptionDiplomaNameEdit((prev) => {
            const exist = checkOptionDiplomaNameEdit.includes(option);
            if (exist) {
              return prev.filter((currentValue) => {
                return currentValue != option;
              });
            } else {
              return [...prev, option];
            }
        });
    }


    const [inputSearch, setInputSearch] = useState(''); //state dùng để search tên văn bằng

    const user = useSelector((state) => state.auth.login?.currentUser); // lấy thông tin user để lấy accessToken
    const noti = useRef();
    const noti2 = useRef();
    const noti3 = useRef();

    //ref dùng để focus vào input khi gặp lỗi chưa điền đủ thông tin khi nhập form thêm diploma name
    const diplomaNameInputRef = useRef();
    const diplomaTypeIdSelect = useRef();

    //ref dùng để focus vào input khi gặp lỗi chưa điền đủ thông tin khi nhập form chỉnh sửa
    const diplomaTypeIdSelectEdit = useRef();
    const diplomaNameEditInputRef = useRef();

    const msg = useSelector((state) => state.diplomaName?.msg);
    const isError = useSelector((state) => state.diplomaName.diplomaNames?.error);

    //Gọi useEffect để lấy tất cả DiplomaName
    useEffect(() => {
        // getAllDiplomaName(dispatch);
        getAllDiplomaType(dispatch);
    }, []);    

    //Gọi useEffect để tìm kiếm tên văn bằng
    useEffect(() => {
        searchDiplomaName(dispatch, inputSearch, "");
    }, [inputSearch]);

    //Hàm submit thêm tên văn bằng mới
    const handleSubmitAddDiplomaName = async (e) => {
        e.preventDefault();
        //Báo lỗi khi chưa nhập tên văn bằng
        if(diplomaNameInput == ""){
            noti2.current.showToast();
            diplomaNameInputRef.current.focus();
            return;
        }

        //Báo lỗi khi chưa chọn loại văn bằng
        if(choose_diplomaTypeId == "" || choose_diplomaTypeId == undefined){
            noti3.current.showToast();
            diplomaTypeIdSelect.current.focus();
            return;
        }

        const DiplomaNameInfor = {
            diploma_name_name: diplomaNameInput,
            diploma_type_id: choose_diplomaTypeId,
            isCheckDuplicate: true,
            options: checkOptionDiplomaNameAdd
        }

        await addDiplomaName(DiplomaNameInfor, dispatch, user.accessToken);
        noti.current.showToast();  
        // await getAllDiplomaName(dispatch);    
        setTimeout(async() => {
            await searchDiplomaName(dispatch, inputSearch, "");  
        }, 200);
    }

    //Hàm submit để chỉnh sửa thông tin tên văn bằng
    const handleSubmitEditDiplomaName = async (e) => {
        e.preventDefault();
        //Báo lỗi khi chưa nhập tên văn bằng
        if(diplomaNameEditInput == ""){
            noti2.current.showToast();
            diplomaNameEditInputRef.current.focus();
            return;
        }

        //Báo lỗi khi chưa chọn loại văn bằng
        if(choose_diplomaTypeIdEdit == "" || choose_diplomaTypeIdEdit == undefined){
            noti3.current.showToast();
            diplomaTypeIdSelectEdit.current.focus();
            return;
        }
        
        
        const DiplomaNameEditInfor = {
            diploma_name_name: diplomaNameEditInput,
            diploma_type_id: choose_diplomaTypeIdEdit,
            options: checkOptionDiplomaNameEdit
        };

        await editDiplomaName(DiplomaNameEditInfor, dispatch, user.accessToken, DiplomaNameIdEdit);
        noti.current.showToast();  
        setTimeout(async()=>{
            await searchDiplomaName(dispatch, inputSearch, "");   
        }, 200)
    }
    //Xử lý logic cho phần xóa tên văn bằng
    const msgDelete = useSelector((state) => state.diplomaName?.msgDelete);
    const isErrorDelete = useSelector((state) => state.diplomaName.diplomaNames?.error);
    const noti4 = useRef();
    const handleDeleteDiplomaName = async (diploma_name_id) => {
        await deleteDiplomaName(dispatch, user.accessToken, diploma_name_id);
        noti4.current.showToast();
        setTimeout( async()=>{
            await searchDiplomaName(dispatch, inputSearch, "");  
        }, 200)
    }

    //State để quyết định xem có hiển thị phần thông tin thêm khi chỉnh sửa văn bằng không
    const [showMoreInfor, setShowMoreInfor] = useState(false);
    //State lấy ra các diploma trong collection diplomas để xem loại văn bằng đang chọn để chỉnh sửa đã có tồn tại các văn bằng trong csdl chưa
    const [allDiplomaByDiplomaNameID, setAllDiplomaByDiplomaNameID] = useState([]);
    //Hàm call api lấy ra các diploma theo 1 diploma_name_id
    const getAllDiplomaByDiplomaNameId = async (diploma_name_id) => {
        try{
            const res = await axios.get(`http://localhost:8000/v1/diploma/get_all_diploma_by_diploma_name_id/${diploma_name_id}`)
            setAllDiplomaByDiplomaNameID(res.data);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        if(allDiplomaByDiplomaNameID.length > 0){
            setShowMoreInfor(false);
        }else{
            setShowMoreInfor(true);
        }
    }, [allDiplomaByDiplomaNameID])


    return(
        <>
            <Header/>
            <div className="container" id='body-diplomaname'>
                <div style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa-solid fa-sliders"></i>
                                </div>
                                <ul className="list-group list-group-flush">
                                    <Link style={{textDecoration: 'none'}} to='/diploma-type'><li className="list-group-item">Danh mục loại văn bằng</li></Link>
                                    <Link style={{textDecoration: 'none'}} to='/decentralize-diploma-management'>
                                        <li className="list-group-item">Phân quyền quản lý văn bằng</li>
                                    </Link>
                                    <li id='active-diplomaname' className="list-group-item">Danh mục tên văn bằng</li>
                                    <Link style={{textDecoration: 'none'}} to='/diploma-name-management-history'>
                                        <li className="list-group-item">Lịch sử quản lý tên văn bằng</li>
                                    </Link>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-9">
                            <div className='card p-3'>
                                <div>
                                    <button 
                                        type='button' 
                                        id='add-diploma-name'
                                        data-bs-toggle="modal" 
                                        data-bs-target="#modalAddDiplomaName"
                                    ><i className="fa-sharp fa-solid fa-plus"></i> Thêm</button>
                                </div>
                                <div className='row mt-3'>
                                    <div className="col-4">
                                        <input 
                                            type="text" 
                                            value={inputSearch}
                                            onChange={(e) => {
                                                setInputSearch(e.target.value);
                                            }}
                                            className='form-control'
                                            placeholder='Nhập tên văn bằng muốn tìm kiếm'
                                        />
                                    </div>
                                </div>
                                <div id='contain-table-diplomaName-DN'>
                                    <table style={{border: '2px solid #fed25c'}} className='table table-striped table-hover table-bordered mt-3'>
                                        <thead>
                                            <tr style={{textAlign: 'center'}}>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">STT</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Tên văn bằng</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Loại văn bằng</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Sửa</th>
                                                <th style={{backgroundColor: '#fed25c'}} scope="col">Xóa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allDiplomaName?.map((currentValue, index) => {
                                                    let nameOfDiplomaType = '';
                                                    allDiplomaType?.forEach((diplomaType) => {
                                                        if(currentValue.diploma_type_id == diplomaType.diploma_type_id){
                                                            nameOfDiplomaType = diplomaType.diploma_type_name;
                                                        }
                                                    })
                                                    return(
                                                        <tr style={{textAlign: 'center'}} key={index}>
                                                            <th scope='row'>{index + 1}</th>
                                                            <td style={{width: '50%'}}>{currentValue.diploma_name_name}</td>
                                                            <td >{nameOfDiplomaType}</td>
                                                            <td >
                                                                <i
                                                                    onClick={(e) => {
                                                                        setDiplomaNameEditInput(currentValue.diploma_name_name);
                                                                        setChoose_diplomaTypeIdEdit(currentValue.diploma_type_id);
                                                                        setDiplomaNameIdEdit(currentValue.diploma_name_id);
                                                                        setCheckOptionDiplomaNameEdit(currentValue.options);
                                                                        getAllDiplomaByDiplomaNameId(currentValue.diploma_name_id);
                                                                    }}
                                                                    type='button' 
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#modalEditDiplomaName"
                                                                    className="fa-solid fa-eye"
                                                                    style={{backgroundColor: "#1b95a2", padding: '7px', borderRadius: '5px', color: 'white'}}
                                                                ></i>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className='btn'
                                                                    style={{backgroundColor:'red', width:'32px', height: '30px'}}
                                                                >
                                                                    <i
                                                                        onClick={(e)=>{
                                                                            handleDeleteDiplomaName(currentValue.diploma_name_id);
                                                                        }}
                                                                        className="fa-solid fa-trash text-center d-block"
                                                                        style={{marginLeft: '-4px', color: 'white'}}
                                                                    ></i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>            
                                </div>
                                
                                {/* Modal để thêm loại văn bằng */}
                                <div className="modal fade" id="modalAddDiplomaName" tabIndex="-1" aria-labelledby="modalAddDiplomaNameLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                            <h1 className="modal-title fs-5" id="modalAddDiplomaNameLabel">Thêm tên văn bằng mới</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form
                                                id='form-add-diplomaName-diplomaName'
                                                onSubmit={(e) => {
                                                    handleSubmitAddDiplomaName(e);
                                                }}
                                            >   
                                                <div className="row">
                                                    <div className="col-2">
                                                        <label
                                                            htmlFor='input-add-diplomaname-diplomaName'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input
                                                            id='input-add-diplomaname-diplomaName'
                                                            type='text'
                                                            ref={diplomaNameInputRef}
                                                            className='form-control'
                                                            value={diplomaNameInput}
                                                            onChange={(e) => {
                                                                setDiplomaNameInput(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label 
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }} 
                                                        >
                                                            Loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <select 
                                                            ref={diplomaTypeIdSelect}
                                                            value={choose_diplomaTypeId}
                                                            onChange={(e) => {
                                                                setChooseDiplomaTypeId(e.target.value);
                                                            }}
                                                            className="form-select" 
                                                            aria-label="Default select example"
                                                        >
                                                            <option value="">-- Loại văn bằng --</option>
                                                            {
                                                                allDiplomaType?.map((currentValue, index) => {
                                                                    return(
                                                                        <option
                                                                            key={index}
                                                                            value={currentValue.diploma_type_id}
                                                                        >
                                                                            {currentValue.diploma_type_name}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {/* Phần xử lý cho việc thêm "thông tin thêm" cho tên văn bằng */}
                                                <hr />
                                                <p style={{textAlign:'center', fontStyle: 'italic'}}>Hãy chọn các thông tin cần thêm cho tên văn bằng này</p>
                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(1)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(1)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm trắc nghiệm
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(2)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(2)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm thực hành
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(3)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(3)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm nghe
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(4)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(4)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm nói
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(5)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(5)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm đọc
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(6)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(6)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Điểm viết
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(7)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(7)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Ngày thi
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(8)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(8)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Năm tốt nghiệp
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(9)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(9)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Xếp loại
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(10)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(10)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Ngành đào tạo
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-2"></div>
                                                    <div className="col-5">
                                                        <div className="form-check">  
                                                            <input 
                                                                className="form-check-input" 
                                                                type="checkbox" 
                                                                checked={checkOptionDiplomaNameAdd.includes(11)}
                                                                onChange={(e)=>{
                                                                    handleCheckOptionDiplomaNameAdd(11)
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Hội đồng thi
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>    
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-add-diplomaName-diplomaName' 
                                                className="btn"
                                                style={{backgroundColor: '#1b95a2'}}
                                            >Thêm</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal để chỉnh sửa tên văn bằng */}
                                <div className="modal fade" id="modalEditDiplomaName" tabIndex="-1" aria-labelledby="modalEditDiplomaNameLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                        <div className="modal-content">
                                        <div className="modal-header" style={{backgroundColor: '#feefbf'}}>
                                            <h1 className="modal-title fs-5" id="modalEditDiplomaNameLabel">Sửa thông tin tên văn bằng</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form
                                                id='form-edit-diplomaName-diplomaName'
                                                onSubmit={(e) => {
                                                    handleSubmitEditDiplomaName(e);
                                                }}
                                            >   
                                                <div className="row">
                                                    <div className="col-2">
                                                        <label
                                                            htmlFor='input-edit-diplomaname-diplomaName'
                                                            className='col-form-label text-end d-block'
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }}
                                                        >
                                                            Tên văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <input
                                                            id='input-edit-diplomaname-diplomaName'
                                                            type='text'
                                                            ref={diplomaNameEditInputRef}
                                                            className='form-control'
                                                            value={diplomaNameEditInput}
                                                            onChange={(e) => {
                                                                setDiplomaNameEditInput(e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row mt-3">
                                                    <div className="col-2">
                                                        <label 
                                                            className="col-form-label text-end d-block"
                                                            style={{ fontSize: '12px', fontStyle: 'italic' }} 
                                                        >
                                                            Loại văn bằng
                                                        </label>
                                                    </div>
                                                    <div className="col-10">
                                                        <select 
                                                            ref={diplomaTypeIdSelectEdit}
                                                            value={choose_diplomaTypeIdEdit}
                                                            onChange={(e) => {
                                                                setChoose_diplomaTypeIdEdit(e.target.value);
                                                            }}
                                                            className="form-select" 
                                                            aria-label="Default select example"
                                                        >
                                                            <option value="">-- Loại văn bằng --</option>
                                                            {
                                                                allDiplomaType?.map((currentValue, index) => {
                                                                    return(
                                                                        <option
                                                                            key={index}
                                                                            value={currentValue.diploma_type_id}
                                                                        >
                                                                            {currentValue.diploma_type_name}
                                                                        </option>
                                                                    );
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {/* Xử lý phần thông tin thêm trong modal chỉnh sửa */}
                                                {
                                                    showMoreInfor ? (
                                                        <>
                                                            <hr />
                                                            <p style={{textAlign:'center', fontStyle: 'italic'}}>Hãy chọn các thông tin cần thêm cho tên văn bằng này</p>
                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(1)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(1)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm trắc nghiệm
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(2)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(2)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm thực hành
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(3)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(3)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm nghe
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(4)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(4)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm nói
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(5)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(5)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm đọc
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(6)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(6)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Điểm viết
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(7)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(7)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Ngày thi
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(8)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(8)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Năm tốt nghiệp
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(9)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(9)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Xếp loại
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(10)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(10)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Ngành đào tạo
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-3">
                                                                <div className="col-2"></div>
                                                                <div className="col-5">
                                                                    <div className="form-check">  
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="checkbox" 
                                                                            checked={checkOptionDiplomaNameEdit.includes(11)}
                                                                            onChange={(e)=>{
                                                                                handleCheckOptionDiplomaNameEdit(11)
                                                                            }}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                            Hội đồng thi
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : ("")
                                                }
                                                
                                            </form>    
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                                            <button 
                                                type="submit"
                                                form='form-edit-diplomaName-diplomaName' 
                                                className="btn"
                                                style={{backgroundColor: '#1b95a2'}}
                                            >Lưu</button>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Lỗi khi đã nhập đầy đủ thông tin */}
            <Toast
                message={msg}
                type={isError ? "error" : "success"}
                ref={noti}
            />

            {/* Lỗi khi chưa nhập đầy đủ thông tin     */}
            <Toast
                message="Vui lòng nhập tên văn bằng"
                type="warning"
                ref={noti2}
            />

            <Toast
                message="Vui lòng chọn loại văn bằng"
                type="warning"
                ref={noti3}
            />
            <Toast
                message={msgDelete}
                type={isErrorDelete ? "error" : "success"}
                ref={noti4}
            />
            <Footer/>
        </>
    );
}
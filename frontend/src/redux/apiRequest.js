import axios from 'axios';
import {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed
} from './authSlice';

import {
    getAllDiplomaTypeStart,
    getAllDiplomaTypeSuccess,
    getAllDiplomaTypeFailed,
    addDiplomaTypeStart,
    addDiplomaTypeSuccess,
    addDiplomaTypeFailed,
    editDiplomaTypeStart,
    editDiplomaTypeSuccess,
    editDiplomaTypeFailed,
    searchDiplomaTypeStart,
    searchDiplomaTypeSuccess,
    searchDiplomaTypeFailed,
    deleteDiplomaTypeStart,
    deleteDiplomaTypeSuccess,
    deleteDiplomaTypeFailed
} from './diplomaSlice';

import {
    getAllDiplomaNameStart,
    getAllDiplomaNameSuccess,
    getAllDiplomaNameFailed,
    addDiplomaNameStart,
    addDiplomaNameSuccess,
    addDiplomaNameFailed,
    editDiplomaNameStart,
    editDiplomaNameSuccess,
    editDiplomaNameFailed,
    searchDiplomaNameStart,
    searchDiplomaNameSuccess,
    searchDiplomaNameFailed,
    decentralizationDiolomaNameStart,
    decentralizationDiolomaNameSuccess,
    decentralizationDiolomaNameFailed,
    transferDiolomaNameStart,
    transferDiplomaNameSuccess,
    transferDiplomaNameFailed,
    searchDiplomaNameForDNMHStart,
    searchDiplomaNameForDNMHSuccess,
    searchDiplomaNameForDNMHFailed,
    deleteDiplomaNameStart,
    deleteDiplomaNameSuccess,
    deleteDiplomaNameFailed
} from './diplomaNameSlice';

import {
    getAllDiplomaIssuanceByMUStart,
    getAllDiplomaIssuanceByMUSuccess,
    getAllDiplomaIssuanceByMUFailed,
    addDiplomaIssuanceByMUStart,
    addDiplomaIssuanceByMUSuccess,
    addDiplomaIssuanceByMUFailed,
    editDiplomaIssuanceByMUStart,
    editDiplomaIssuanceByMUSuccess,
    editDiplomaIssuanceByMUFailed,
    deleteDiplomaIssuanceStart,
    deleteDiplomaIssuanceSuccess,
    deleteDiplomaIssuanceFailed
} from './diplomaIssuanceSlice';

import {
    addDiplomaStart,
    addDiplomaSuccess,
    addDiplomaFailed,
    getAllDiplomaByListOfDiplomaNameImportStart,
    getAllDiplomaByListOfDiplomaNameImportSuccess,
    getAllDiplomaByListOfDiplomaNameImportFailed,
    searchDiplomaWithMultiConditionStart,
    searchDiplomaWithMultiConditionSuccess,
    searchDiplomaWithMultiConditionFailed,
    editDiplomaStart,
    editDiplomaSuccess,
    editDiplomaFailed,
    deleteDiplomaStart,
    deleteDiplomaSuccess,
    deleteDiplomaFailed,
    reviewDiplomaStart,
    reviewDiplomaSuccess,
    reviewDiplomaFailed  
} from './diploma'

export const LoginUser = async(user, dispatch, navigate) => {
    //tham số đầu tiên user là 1 object chứa thông tin gồm: mssv_cb, password
    dispatch(loginStart());
    try{
        const res = await axios.post("http://localhost:8000/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        if(res.data.changedPassword == false){
            navigate("/change-password");
        }else{
            navigate("/");
        }
    }catch(err){
        dispatch(loginFailed(err.response.data));
    }
}

export const registerUser = async (userInfor, dispatch, accessToken) => {
    dispatch(registerStart());
    try{
        const result = await axios.post("http://localhost:8000/v1/auth/register", userInfor, {
            headers: {token: `Bearer ${accessToken}`} //cách đưa token vào headers
        });
        dispatch(registerSuccess());
    }catch(err){
        dispatch(registerFailed(err.response.data))
    }
}

export const logoutUser = (dispatch, navigate) => {
    dispatch(logoutStart());
    try{
        dispatch(logoutSuccess());
        navigate("/");
    }catch(err){
        dispatch(logoutFailed());
    }
}

//Request for DiplomaType API

export const getAllDiplomaType = async (dispatch) => {
    dispatch(getAllDiplomaTypeStart());
    try{
        const result = await axios.get("http://localhost:8000/v1/diploma_type/get_all_diploma_type");
        dispatch(getAllDiplomaTypeSuccess(result.data));
    }catch(err){
        dispatch(getAllDiplomaTypeFailed());
    }
}

export const addDiplomaType = async (DiplomaTypeInfor, dispatch, accessToken) => {
    dispatch(addDiplomaTypeStart());
    try{
        const res = await axios.post("http://localhost:8000/v1/diploma_type/add_diploma_type", DiplomaTypeInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addDiplomaTypeSuccess());
    }catch(error){
        dispatch(addDiplomaTypeFailed(error.response.data));
    }
}

export const editDiplomaType = async (DiplomaTypeInfor, dispatch, accessToken, _idDiplomaType) => {
    dispatch(editDiplomaTypeStart());
    try{
        const res = await axios.put(`http://localhost:8000/v1/diploma_type/edit_diploma_type/${_idDiplomaType}`, DiplomaTypeInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(editDiplomaTypeSuccess());
    }catch(error){
        dispatch(editDiplomaTypeFailed(error.response.data));
    }
}

export const searchDiplomaType = async (dispatch, keyword) => {
    dispatch(searchDiplomaTypeStart());
    try{
        const result = await axios.get(`http://localhost:8000/v1/diploma_type/search_diploma_type?keyword=${keyword}`);
        dispatch(searchDiplomaTypeSuccess(result.data));
    }catch(error){
        dispatch(searchDiplomaTypeFailed());
    }
}

export const deleteDiplomaType = async (dispatch, accessToken, _id) => {
    dispatch(deleteDiplomaTypeStart());
    try{
        const result = await axios.delete(`http://localhost:8000/v1/diploma_type/delete_diploma_type/${_id}`,{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(deleteDiplomaTypeSuccess());
    }catch(error){
        dispatch(deleteDiplomaTypeFailed(error.response.data));
    }
}

//Request for DiplomaName API
export const getAllDiplomaName = async (dispatch) => {
    dispatch(getAllDiplomaNameStart());
    try{
        const res = await axios.get("http://localhost:8000/v1/diploma_name/get_all_diploma_name");
        dispatch(getAllDiplomaNameSuccess(res.data));
    }catch(error){
        dispatch(getAllDiplomaNameFailed());
    }
}

export const addDiplomaName = async (DiplomaNameInfor, dispatch, accessToken) => {
    dispatch(addDiplomaNameStart());
    try{
        const res = await axios.post("http://localhost:8000/v1/diploma_name/add_diploma_name", DiplomaNameInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addDiplomaNameSuccess());
    }catch(error){
        dispatch(addDiplomaNameFailed(error.response.data));
    }
}

export const editDiplomaName = async (DiplomaNameEditInfor, dispatch, accessToken, diploma_name_id) => {
    dispatch(editDiplomaNameStart());
    try{
        const res = await axios.put(`http://localhost:8000/v1/diploma_name/edit_diploma_name/${diploma_name_id}`, DiplomaNameEditInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(editDiplomaNameSuccess());
    }catch(error){
        dispatch(editDiplomaNameFailed(error.response.data));
    }
}

export const searchDiplomaName = async (dispatch, keyword, status) => {
    dispatch(searchDiplomaNameStart());
    try{    
        const result = await axios.get(`http://localhost:8000/v1/diploma_name/search_diplomaName/bykeyword?keyword=${keyword}`);
        if(status != ""){
            let res = [];
            result.data.forEach((currentValue) => {
                if(currentValue.isEffective == JSON.parse(status)){
                    res.push(currentValue);
                }
            })
            dispatch(searchDiplomaNameSuccess(res));
        }else{
            dispatch(searchDiplomaNameSuccess(result.data));
        }
    }catch(error){
        dispatch(searchDiplomaNameFailed())
    }
}

export const decentralizationDiplomaName = async (data, dispatch, accessToken, diploma_name_id) => {
    dispatch(decentralizationDiolomaNameStart());
    try{    
        const res = await axios.put(`http://localhost:8000/v1/diploma_name/decentralization/${diploma_name_id}`, data, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(decentralizationDiolomaNameSuccess());
    }catch(error){
        dispatch(decentralizationDiolomaNameFailed())
    }
}

export const transferDiplomaName = async (dispatch, accessToken, _id, diplomaNameIdUsedToDeleteList) => {
    dispatch(transferDiolomaNameStart());
    try{
        const res = await axios.put(`http://localhost:8000/v1/diploma_name/transfer/${_id}/${diplomaNameIdUsedToDeleteList}`, _id, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(transferDiplomaNameSuccess());
    }catch(error){
        dispatch(transferDiplomaNameFailed());
    }
}

export const deleteDiplomaName = async(dispatch, accessToken, diploma_name_id) => {
    dispatch(deleteDiplomaNameStart());
    try{
        const res = await axios.delete(`http://localhost:8000/v1/diploma_name/delete_diploma_name/${diploma_name_id}`,{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(deleteDiplomaNameSuccess(res.data));
    }catch(error){
        dispatch(deleteDiplomaNameFailed(error.response.data));
    }
}

//Request for DNMH API
export const searchDiplomaNameForDNMH = async (dispatch, keyword, idMU) =>{
    dispatch(searchDiplomaNameForDNMHStart());
    try{
        const result = await axios.get(`http://localhost:8000/v1/diploma_name/search_diplomaNameForDNMH?keyword=${keyword}`);
        if(parseInt(idMU)>0){
            let res = [];
            result.data.forEach((currentValue)=>{
                if(currentValue.management_unit_id == parseInt(idMU)){
                    res.push(currentValue);
                }   
            })
            console.log(res);
            console.log(result.data);
            dispatch(searchDiplomaNameForDNMHSuccess(res));
        }else{
            dispatch(searchDiplomaNameForDNMHSuccess(result.data));
        }   
    }catch(error){
        dispatch(searchDiplomaNameForDNMHFailed())
    }
}

//Request for DiplomaIssuance
export const getAllDiplomaIssuanceByMU = async (dispatch, management_unit_id) => {
    dispatch(getAllDiplomaIssuanceByMUStart());
    try{
        const result = await axios.get(`http://localhost:8000/v1/diploma_issuance/get_all_diploma_issuance/${management_unit_id}`);
        dispatch(getAllDiplomaIssuanceByMUSuccess(result.data));
    }catch(error){
        dispatch(getAllDiplomaIssuanceByMUFailed())
    }
}

export const addDiplomaIssuanceByMU = async (dispatch, accessToken, DiplomaIssuanceInfor) => {
    dispatch(addDiplomaIssuanceByMUStart());
    try{
        const result = await axios.post("http://localhost:8000/v1/diploma_issuance/add_diploma_issuance", DiplomaIssuanceInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(addDiplomaIssuanceByMUSuccess());
    }catch(error){
        dispatch(addDiplomaIssuanceByMUFailed(error.response.data));
    }
}

export const editDiplomaIssuanceByMU = async (dispatch, accessToken, DiplomaIssuanceInfor, _id) => {
    dispatch(editDiplomaIssuanceByMUStart());
    try{
        const result = await axios.put(`http://localhost:8000/v1/diploma_issuance/edit_diploma_issuance/${_id}`, DiplomaIssuanceInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(editDiplomaIssuanceByMUSuccess());
    }catch(error){
        dispatch(editDiplomaIssuanceByMUFailed(error.response.data));
    }
}

export const deleteDiplomaIssuance = async (dispatch, accessToken, _id) => {
    dispatch(deleteDiplomaIssuanceStart());
    try{
        const res = await axios.delete(`http://localhost:8000/v1/diploma_issuance/delete_diploma_issuance/${_id}`,{
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(deleteDiplomaIssuanceSuccess());
    }catch(error){
        dispatch(deleteDiplomaIssuanceFailed(error.response.data));
    }
}

//Request for Diploma
export const addDiploma = async (dispatch, accessToken, diplomaInfor) => {
    dispatch(addDiplomaStart());
    try{
        const result = await axios.post("http://localhost:8000/v1/diploma/add_new_diploma", diplomaInfor, {
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(addDiplomaSuccess());
    }catch(error){
        dispatch(addDiplomaFailed(error.response.data))
    }
}

//Hàm này nhận văn listOfDiplomaNameImport của user và trả về các diploma có diploma_name_id thuộc các loại trong listOfDiplomaNameImport
//Hàm này ko dùng trong code chỉ dùng để kiểm tra kết quả khi hàm searchDiplomaWithMultiCondition search với all điều kiện rỗng thì có ra kết quả là tất cả các văn bằng thuộc 1 đơn vị quản lý ko
// export const getAllDiplomaByListOfDiplomaNameImport = async (dispatch, listOfDiplomaNameImport, management_unit_id) => {
//     dispatch(getAllDiplomaByListOfDiplomaNameImportStart());
//     try{
//         const res = await axios.get(`http://localhost:8000/v1/diploma/get_all_diploma_byMU/${management_unit_id}`)
//         let result = [];
//         res.data.forEach((currentValue)=>{
//             if(listOfDiplomaNameImport.includes(currentValue.diploma_name_id)){
//                 result = [...result, currentValue];
//             }
//         })
//         dispatch(getAllDiplomaByListOfDiplomaNameImportSuccess(result));
//     }catch(error){
//         dispatch(getAllDiplomaByListOfDiplomaNameImportFailed()); 
//     }
// }

//Hàm search diploma theo nhiều điều kiện
export const searchDiplomaWithMultiCondition = async (dispatch, management_unit_id, fullname, diploma_number, numbersIntoTheNotebook, diploma_name_id, diploma_issuance_id, listOfDiplomaNameImport, statusDiplomaSearch) => {
    dispatch(searchDiplomaWithMultiConditionStart());
    try{
        if(statusDiplomaSearch == undefined){
            statusDiplomaSearch = "";
        }
        const listOfDiploma = await axios.get(`http://localhost:8000/v1/diploma/search_diploma/${management_unit_id}?name=${fullname}&diplomaNumber=${diploma_number}&numbersIntoTheNotebook=${numbersIntoTheNotebook}&status=${statusDiplomaSearch}`);

        let res = [];
        listOfDiploma.data.forEach((currentValue)=>{
            if(listOfDiplomaNameImport.includes(currentValue.diploma_name_id)){
                res = [...res, currentValue];
            }
        })
        
        if(diploma_name_id != undefined){
            if(diploma_issuance_id != undefined){
                let result3 = [];
                res.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == diploma_name_id && currentValue.diploma_issuance_id == diploma_issuance_id){
                        result3 = [...result3, currentValue];
                    }
                })
                dispatch(searchDiplomaWithMultiConditionSuccess(result3));       
            }else{
                let result2 = [];
                res.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == diploma_name_id){
                        result2 = [...result2, currentValue];
                    }
                })    
                dispatch(searchDiplomaWithMultiConditionSuccess(result2));
            }
        }else{
            dispatch(searchDiplomaWithMultiConditionSuccess(res));
        }
    }catch(error){
        dispatch(searchDiplomaWithMultiConditionFailed());
    }
}
//Hàm chỉnh sửa văn bằng
export const editDiplomaInImportDiploma = async(dispatch, accessToken, _id, diploma_name_id, diplomaUpdate) => {
    dispatch(editDiplomaStart());
    try{
        const res = await axios.put(`http://localhost:8000/v1/diploma/edit_diploma/${_id}/${diploma_name_id}`, diplomaUpdate, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(editDiplomaSuccess());
    }catch(error){
        dispatch(editDiplomaFailed(error.response.data));
    }
}
//Hàm xóa văn bằng
export const deleteDiploma = async (dispatch, accessToken, _id) => {
    dispatch(deleteDiplomaStart());
    try{
        const res = await axios.delete(`http://localhost:8000/v1/diploma/delete_diploma/${_id}`,{
            headers: {token: `Bearer ${accessToken}`}
        })
        dispatch(deleteDiplomaSuccess());
    }catch(error){
        dispatch(deleteDiplomaFailed());
    }
}
//Hàm duyệt văn bằng
export const reviewDiploma = async (dispatch, accessToken, _id, updateInfor) => {
    dispatch(reviewDiplomaStart());
    try{
        const res = await axios.put(`http://localhost:8000/v1/diploma/review_diploma/${_id}`, updateInfor, {
            headers: {token: `Bearer ${accessToken}`}
        });
        dispatch(reviewDiplomaSuccess());
    }catch(error){
        dispatch(reviewDiplomaFailed());
    }
}

//Hàm chỉnh sửa thông tin tài khoản
// export const editUserAccount = async(dispatch, _id, updateInfor) => {
//     dispatch(editUserAccountStart());
//     try{
//         const res = await axios.put(`http://localhost:8000/v1/user_account/edit_user_account_info/${_id}`,updateInfor);
//         dispatch(editUserAccountSuccess());
//     }catch(error){
//         dispatch(editUserAccountFailed(error.response.data));
//     }
// }
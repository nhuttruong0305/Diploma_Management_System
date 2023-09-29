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
    editDiplomaTypeFailed
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
    editDiplomaNameFailed
} from './diplomaNameSlice';

export const LoginUser = async(user, dispatch, navigate) => {
    //tham số đầu tiên user là 1 object chứa thông tin gồm: mssv_cb, password
    dispatch(loginStart());
    try{
        const res = await axios.post("http://localhost:8000/v1/auth/login", user);
        dispatch(loginSuccess(res.data));
        if(res.data.role[0] == "System administrator"){
            navigate("/user-account-management");
        }
        if(res.data.role.length == 0){
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
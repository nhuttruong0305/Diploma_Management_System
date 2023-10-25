//Slice để quản lý đợt cấp văn bằng

import {createSlice} from '@reduxjs/toolkit';

const diplomaIssuanceSlice = createSlice({
    name: 'diplomaIssuance',
    initialState: {
        diplomaIssuances:{
            allDiplomaIssuances: null,
            isFetching: false,
            error: false
        },
        msg: '', //state này để thông báo khi thêm đợt cấp văn bằng thành công
        msgForEdit: '',
        msgDelete: ''
    },
    reducers:{
        getAllDiplomaIssuanceByMUStart: (state) => {
            state.diplomaIssuances.isFetching = true;
            state.diplomaIssuances.error = false;
        },
        getAllDiplomaIssuanceByMUSuccess: (state, action) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = false;
            state.diplomaIssuances.allDiplomaIssuances = action.payload;
        },
        getAllDiplomaIssuanceByMUFailed: (state) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = true;
        },
        addDiplomaIssuanceByMUStart: (state) => {
            state.diplomaIssuances.isFetching = true;
            state.diplomaIssuances.error = false;
            state.msg = '';
        },
        addDiplomaIssuanceByMUSuccess: (state) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = false;
            state.msg = 'Thêm đợt cấp văn bằng thành công';
        },
        addDiplomaIssuanceByMUFailed: (state, action) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = true;
            state.msg = action.payload;
        },
        editDiplomaIssuanceByMUStart: (state) => {
            state.diplomaIssuances.isFetching = true;
            state.diplomaIssuances.error = false;
            state.msgForEdit = '';
        },
        editDiplomaIssuanceByMUSuccess: (state) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = false;
            state.msgForEdit = 'Cập nhật thông tin đợt cấp văn bằng thành công';
        },
        editDiplomaIssuanceByMUFailed: (state, action) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = true;
            state.msgForEdit = action.payload;            
        },
        deleteDiplomaIssuanceStart: (state) => {
            state.diplomaIssuances.isFetching = true;
            state.diplomaIssuances.error = false;
            state.msgDelete = '';
        },
        deleteDiplomaIssuanceSuccess:(state) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = false;
            state.msgDelete = 'Xóa đợt cấp văn bằng thành công';
        },
        deleteDiplomaIssuanceFailed: (state, action) => {
            state.diplomaIssuances.isFetching = false;
            state.diplomaIssuances.error = true;
            state.msgDelete = action.payload;  
        }
    }
})

export const {
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
} = diplomaIssuanceSlice.actions;

export default diplomaIssuanceSlice.reducer;
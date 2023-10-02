import {createSlice} from '@reduxjs/toolkit';

const diplomaNameSlice = createSlice({
    name: 'diplomaName',
    initialState: {
        diplomaNames: {
            allDiplomaName: null,
            isFetching: false,
            error: false
        },
        msg:'', //msg này để thông báo cho component DiplomaName.jsx
        msgForDDM: '' //msg này để thông báo cho component DecentralizeDiplomaManagement.jsx và component TableShowDiplomaName.jsx
    },
    reducers:{
        getAllDiplomaNameStart: (state) => { //lấy để hiện ra màn hình
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
        },
        getAllDiplomaNameSuccess: (state, action) => { //lấy để hiện ra màn hình
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.diplomaNames.allDiplomaName = action.payload;
        },
        getAllDiplomaNameFailed: (state) => { //lấy để hiện ra màn hình
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
        },
        addDiplomaNameStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
            state.msg = '';
        },
        addDiplomaNameSuccess: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.msg = 'Thêm tên văn bằng thành công';
        },
        addDiplomaNameFailed: (state, action) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
            state.msg = action.payload;
        },
        editDiplomaNameStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
            state.msg = '';
        },
        editDiplomaNameSuccess: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.msg = 'Cập nhật tên văn bằng thành công'
        },
        editDiplomaNameFailed: (state, action) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
            state.msg = action.payload;
        },
        searchDiplomaNameStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
            state.msgForDDM = '';
        },
        searchDiplomaNameSuccess: (state, action) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.diplomaNames.allDiplomaName = action.payload;
        },
        searchDiplomaNameFailed: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
        },
        decentralizationDiolomaNameStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
            state.msgForDDM = '';
        },
        decentralizationDiolomaNameSuccess: (state) => {
            state.diplomaNames.error = false;
            state.diplomaNames.isFetching = false;
            state.msgForDDM = 'Phân quyền thành công';
        },
        decentralizationDiolomaNameFailed: (state) => {
            state.diplomaNames.error = true;
            state.diplomaNames.isFetching = false;
        },
        transferDiolomaNameStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
            state.msgForDDM = '';
        },
        transferDiplomaNameSuccess: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.msgForDDM = 'Đã chuyển vào lịch sử quản lý tên văn bằng';
        },
        transferDiplomaNameFailed: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
        },
        searchDiplomaNameForDNMHStart: (state) => {
            state.diplomaNames.isFetching = true;
            state.diplomaNames.error = false;
        },
        searchDiplomaNameForDNMHSuccess: (state, action) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = false;
            state.diplomaNames.allDiplomaName = action.payload;
        },
        searchDiplomaNameForDNMHFailed: (state) => {
            state.diplomaNames.isFetching = false;
            state.diplomaNames.error = true;
        }
    }
})  

export const {
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
    searchDiplomaNameForDNMHFailed
} = diplomaNameSlice.actions;

export default diplomaNameSlice.reducer;
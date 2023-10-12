//Slice để quản lý văn bằng
import {createSlice} from '@reduxjs/toolkit';

const diplomaSlice = createSlice({
    name: 'diploma',
    initialState: {
        diplomas: {
            allDiploma: null,
            isFetching: false,
            error: false
        },
        msg: '', //state để thống báo khi thêm văn bằng thành công
        msgEdit: '' //state để thông báo khi chỉnh sửa văn bằng thành công
    },
    reducers:{
        addDiplomaStart: (state) => {
            state.diplomas.isFetching = true;
            state.diplomas.error = false;
            state.msg = '';
        },
        addDiplomaSuccess: (state) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = false;
            state.msg = 'Thêm văn bằng thành công'
        },
        addDiplomaFailed: (state, action) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = true;
            state.msg = action.payload;
        },
        getAllDiplomaByListOfDiplomaNameImportStart: (state) => {
            state.diplomas.isFetching = true;
            state.diplomas.error = false;
        },
        getAllDiplomaByListOfDiplomaNameImportSuccess: (state, action) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = false;
            state.diplomas.allDiploma = action.payload;
        },
        getAllDiplomaByListOfDiplomaNameImportFailed: (state) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = true;
        },
        searchDiplomaWithMultiConditionStart: (state) => {
            state.diplomas.isFetching = true;
            state.diplomas.error = false;
        },
        searchDiplomaWithMultiConditionSuccess: (state, action) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = false;
            state.diplomas.allDiploma = action.payload;
        },
        searchDiplomaWithMultiConditionFailed: (state) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = true;
        },
        editDiplomaStart: (state)=>{
            state.diplomas.isFetching = true;
            state.diplomas.error = false;
            state.msgEdit = '';
        },
        editDiplomaSuccess: (state) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = false;
            state.msgEdit = 'Cập nhật văn bằng thành công'
        },
        editDiplomaFailed: (state, action) => {
            state.diplomas.isFetching = false;
            state.diplomas.error = true;
            state.msgEdit = action.payload;
        }
    }
})

export const {
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
    editDiplomaFailed     
} = diplomaSlice.actions;

export default diplomaSlice.reducer;
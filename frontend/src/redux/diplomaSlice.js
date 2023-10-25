import {createSlice} from '@reduxjs/toolkit';

const diplomaTypeSlice = createSlice({
    name: 'diplomaType',
    initialState: {
        diplomaTypes: {
            allDiplomaType: null,
            isFetching: false,
            error: false
        },
        msg: '',
        msgDelete: ''
    },
    reducers:{
        getAllDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
        },
        getAllDiplomaTypeSuccess: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = false;
            state.diplomaTypes.allDiplomaType = action.payload;
        },
        getAllDiplomaTypeFailed: (state) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
        },
        addDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
            state.msg = '';
        },
        addDiplomaTypeSuccess: (state) => {
            state.diplomaTypes.error = false;
            state.diplomaTypes.isFetching = false;
            state.msg = 'Thêm loại văn bằng thành công';
        },
        addDiplomaTypeFailed: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
            state.msg = action.payload;
        },
        editDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
            state.msg = '';
        },
        editDiplomaTypeSuccess: (state) => {
            state.diplomaTypes.error = false;
            state.diplomaTypes.isFetching = false;
            state.msg = 'Cập nhật tên loại văn bản thành công';
        },
        editDiplomaTypeFailed: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
            state.msg = action.payload;
        },
        searchDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
        },
        searchDiplomaTypeSuccess: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = false;
            state.diplomaTypes.allDiplomaType = action.payload;
        },
        searchDiplomaTypeFailed: (state) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
        },
        deleteDiplomaTypeStart:(state) => {
            state.diplomaTypes.isFetching = true;
            state.diplomaTypes.error = false;
            state.msgDelete = '';
        },
        deleteDiplomaTypeSuccess: (state) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = false;
            state.msgDelete = 'Xóa loại văn bằng thành công';
        },
        deleteDiplomaTypeFailed: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
            state.msgDelete = action.payload;
        }
    }
})

export const {
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
} = diplomaTypeSlice.actions;

export default diplomaTypeSlice.reducer;
import {createSlice} from '@reduxjs/toolkit';

const diplomaNameSlice = createSlice({
    name: 'diplomaName',
    initialState: {
        diplomaNames: {
            allDiplomaName: null,
            isFetching: false,
            error: false
        },
        msg:''
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
        }
    }
})  

export const {
    getAllDiplomaNameStart,
    getAllDiplomaNameSuccess,
    getAllDiplomaNameFailed,
    addDiplomaNameStart,
    addDiplomaNameSuccess,
    addDiplomaNameFailed
} = diplomaNameSlice.actions;

export default diplomaNameSlice.reducer;
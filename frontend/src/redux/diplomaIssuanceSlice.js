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
        msg: '' //state này để thông báo khi thêm đợt cấp văn bằng thành công
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
        }
    }
})

export const {
    getAllDiplomaIssuanceByMUStart,
    getAllDiplomaIssuanceByMUSuccess,
    getAllDiplomaIssuanceByMUFailed,
    addDiplomaIssuanceByMUStart,
    addDiplomaIssuanceByMUSuccess,
    addDiplomaIssuanceByMUFailed
} = diplomaIssuanceSlice.actions;

export default diplomaIssuanceSlice.reducer;
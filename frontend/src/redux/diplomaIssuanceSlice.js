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
        msg: ''
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
        }
    }
})

export const {
    getAllDiplomaIssuanceByMUStart,
    getAllDiplomaIssuanceByMUSuccess,
    getAllDiplomaIssuanceByMUFailed
} = diplomaIssuanceSlice.actions;

export default diplomaIssuanceSlice.reducer;
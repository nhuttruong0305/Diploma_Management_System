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
        msg: '' //state để thống báo khi thêm văn bằng thành công
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
        }
    }
})

export const {
    addDiplomaStart,
    addDiplomaSuccess,
    addDiplomaFailed            
} = diplomaSlice.actions;

export default diplomaSlice.reducer;
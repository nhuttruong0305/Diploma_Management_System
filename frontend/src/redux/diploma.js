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
    searchDiplomaWithMultiConditionFailed           
} = diplomaSlice.actions;

export default diplomaSlice.reducer;
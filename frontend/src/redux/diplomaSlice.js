import {createSlice} from '@reduxjs/toolkit';

const diplomaTypeSlice = createSlice({
    name: 'diplomaType',
    initialState: {
        diplomaTypes: {
            allDiplomaType: null,
            isFetching: false,
            error: false
        },
        msg: ''
    },
    reducers:{
        getAllDiplomaTypeStart: (state) => {
            state.diplomaTypes.isFetching = true;
        },
        getAllDiplomaTypeSuccess: (state, action) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.allDiplomaType = action.payload;
        },
        getAllDiplomaTypeFailed: (state) => {
            state.diplomaTypes.isFetching = false;
            state.diplomaTypes.error = true;
        }
    }
})

export const {
    getAllDiplomaTypeStart,
    getAllDiplomaTypeSuccess,
    getAllDiplomaTypeFailed
} = diplomaTypeSlice.actions;

export default diplomaTypeSlice.reducer;
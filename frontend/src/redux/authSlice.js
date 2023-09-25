import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState:{
        login:{
            currentUser: null, //khi đăng nhập sẽ trả về infor user về đây
            isFetching: false,
            error: false
        },
        register:{
            isFetching: false,
            error: false,
            success: false
        },
        msg: ''
    },
    reducers:{
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload; 
            state.login.error = false;

            state.msg = ''
        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = true;

            state.msg = action.payload;//Hiển thị lỗi(sai mssv_cb hoặc sai mật khẩu) khi đăng nhập thất bại
        },
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state) =>{
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;

            state.msg = "Thêm tài khoản người dùng thành công";
        },
        registerFailed: (state, action) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;

            state.msg = action.payload; // hiển thị lỗi khi thêm tài khoản không thành công
        },
        logoutStart: (state) => {
            state.login.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed
} = authSlice.actions;

export default authSlice.reducer;
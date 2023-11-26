const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        mssv_cb: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            // required: true,
            // unique: true, 
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        dateofbirth: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
            minlength: 30
        },
        cccd: {
            type: String,
            required: true,
            minlength: 12,
            unique: true
        },
        sex: {
            type: Boolean,
            required: true,
        },
        phonenumber: {
            type: String,
            required: true,
            minlength: 10,
        },
        // religion: { //tôn giáo
        //     type: String,
        // },
        // nation: { //dân tộc
        //     type: String,
        // },
        // nationality: { //quốc tịch
        //     type: String
        // },
        position:{ //đại diện cho chức vụ (có 2 giá trị là Student hoặc Officer)
            type: String,
            required: true
        },
        class:{ //Lớp của sinh viên trong trường B1910015, nếu position là cán bộ thì field này trống
            type: String,
            required: false
        },
        faculty:{ //đại diện cho Khoa, nếu là tài khoản sinh viên thì sử dụng trường này
            type: Number,
            required: false
        },
        majors:{ //chuyên ngành
            type: Number,
            required: false
        },
        course:{ //khóa
            type: Number,
            required: false
        },
        management_unit:{ //đại diện cho đơn vị quản lý, nếu tài khoản có quyền khác sinh viên thì dùng trường này
            type: Number,
            required: false
        },        
        role:{ 
            //đại diện cho các quyền của user account: 
            //System administrator: quyền quản trị hệ thống
            //Diploma importer: người nhập văn bằng
            //Diploma reviewer: người duyệt văn bằng
            type: Array,
            default:[]
        },
        listOfDiplomaNameImport:{
            type: Array,
            default: []
        },
        listOfDiplomaNameReview:{
            type: Array,
            default: []
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("User", userSchema);
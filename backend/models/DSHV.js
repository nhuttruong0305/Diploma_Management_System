//Model lưu DSSV kèm theo khi gửi yêu cầu xin cấp phôi
const mongoose = require("mongoose");

const DSSVSchema = new mongoose.Schema(
    {
        embryoIssuanceRequest_id:{ //lưu id của yêu cầu để biết được học viên này nằm trong DSHV kèm theo của yêu cầu cấp văn bằng nào
            type: Number,
            required: true
        },
        fullname:{
            type: String
        },
        sex: {
            type: String
        },
        dateOfBirth: {
            type: String
        },
        address: {
            type: String
        },
        CCCD: {
            type:String
        },

        //Thông tin thêm
        diem_tn:{
            type: Number,
            default: null
        },
        diem_th:{
            type: Number,
            default: null
        },
        nghe: {
            type: Number,
            default: null
        },
        noi:{
            type: Number,
            default: null
        },
        doc:{
            type: Number,
            default: null
        },
        viet:{
            type: Number,
            default: null
        },
        test_day: {
            type: String,
            default: ""
        },
        graduationYear: {
            type: Number,
            default: null
        },
        classification:{
            type: String,
            default: ""
        },
        nganh_dao_tao:{
            type: Number,
            default: null
        },
        council: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("DSHV", DSSVSchema);
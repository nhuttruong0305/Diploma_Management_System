//Model lưu DSSV kèm theo khi gửi yêu cầu xin cấp phôi
const mongoose = require("mongoose");

const DSSVSchema = new mongoose.Schema(
    {
        embryoIssuanceRequest_id:{ //lưu id của yêu cầu để biết được học viên này nằm trong DSHV kèm theo của yêu cầu cấp văn bằng nào
            type: Number,
            required: true
        },
        diploma_name_id:{ //lưu diploma_name_id để kiểm tra điều kiện 1 loại văn bằng thì ko dc trùng CCCD
            type: Number
        },
        fullname:{
            type: String,
            required: true
        },
        sex:{
            type: String
        },
        dateOfBirth: {
            type: String
        },
        address:{
            type: String
        },
        CCCD:{
            type: String
        },
        test_day:{
            type:String
        },
        council:{
            type: String
        },
        classification:{
            type: String
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("DSHV", DSSVSchema);
const mongoose = require("mongoose");

const requestForReissueSchema = new mongoose.Schema(
    {
        requestForReissue_id: { //mã phiếu của yc xin cấp lại phôi
            type:Number,
            unique: true,
            required: true
        },
        management_unit_id:{ //lưu id của đơn vị quản lý
            type: Number,
            required: true
        },
        diploma_name_id: { //lưu id của tên văn bằng
            type: Number,
            required: true
        },
        numberOfEmbryos: { //số lượng phôi
            type: Number,
            required: true
        },
        status:{ //Trạng thái của yêu cầu
            type: String,
            default: "Đã gửi yêu cầu"
        },
        mscb_create: {
            type: String,
        },
        time_create: {
            type: String
        },
        embryo_receipt_diary: { //nhật ký nhận phôi
            type: String,
            default: ""
        },
        mscb_diary_creator: {
            type: String,
            default: ""
        },
        time_diary_creator: {
            type: String,
            default: ""
        },
        comment: {
            type: String,
            default: ""
        },
        mscb_approve: {
            type: String,
            default: ""
        },
        time_approve: {
            type: String,
            default: ""
        },
        reason: {
            type: String,
            default: ""
        },
        seri_number_start: {
            type: Array
        },
        seri_number_end: {
            type: Array
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("RequestForReissue", requestForReissueSchema);
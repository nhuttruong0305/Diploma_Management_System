const mongoose = require("mongoose");

const embryoIssuanceRequestSchema = new mongoose.Schema(
    {
        embryoIssuanceRequest_id:{ //id của yêu cầu cấp phôi - có
            type: Number,
            unique: true,
            required: true
        },
        management_unit_id:{ //lưu id của đơn vị quản lý - có
            type: Number,
            required: true
        },
        diploma_name_id: { //lưu id của tên văn bằng - có
            type: Number,
            required: true
        },
        examination: { //đợt thi, đợt cấp (ngày tháng năm nào) - có
            type: String,
        },
        numberOfEmbryos: { //số lượng phôi - có
            type: Number,
            required: true
        },
        status:{ //Trạng thái của yêu cầu - có
            type: String,
            default: "Đã gửi yêu cầu"
        },
        mscb: { //Lưu mscb của người tạo yêu cầu cấp phôi
            type: String
        },
        time: { //Tạo vào thời gian nào
            type: String
        },
        embryo_receipt_diary: { //nhật ký nhận phôi (dành cho tài khoản có chức vụ Trưởng phòng/Giám đốc Trung tâm cập nhật nhật ký nhận phôi khi đã nhận phôi)
            type: String,
            default: ""
        },
        mscb_diary_creator: { //mscb của thư ký tại đơn vị quản lý cập nhật yêu cầu thành "Đã nhận phôi"
            type: String,
            default: ""
        },
        time_diary_creator: { //thời gian tạo nhật ký nhận phôi
            type: String, 
            default: ""
        },

        comment: { //phần diễn giải cho Tổ trưởng nhập khi duyệt/không duyệt yêu cầu
            type: String,
            default: ""
        },
        mscb_approve: { //mscb của tổ trưởng đã duyệt/không duyệt văn bằng
            type: String,
            default: ""
        },
        time_approve: { //ngày duyệt/không duyệt
            type: String,
            default: ""
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("EmbryoIssuanceRequest", embryoIssuanceRequestSchema);
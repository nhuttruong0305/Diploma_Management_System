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
        seri_number_start:{ //Số seri bắt đầu - có
            type: Number,
            required: true
        },
        seri_number_end:{ //Số seri kết thúc - có
            type:Number,
            required: true
        },
        mscb: { //Lưu mscb của người tạo yêu cầu cấp phôi
            type: String
        },
        time: { //Tạo vào thời gian nào
            type: String
        },
        Embryo_receipt_diary: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("EmbryoIssuanceRequest", embryoIssuanceRequestSchema);
const mongoose = require("mongoose");

const embryoIssuanceRequestSchema = new mongoose.Schema(
    {
        embryoIssuanceRequest_id:{ //id của yêu cầu cấp phôi
            type: Number,
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
        // diploma_name_name: { //Lưu tên của văn bằng, đề phòng trường hợp khi văn bằng ko còn do đơn vị này quản lý thì vẫn lấy được tên văn bằng
        //     type: String,
        //     required: true
        // },
        examination: { //đợt thi (ngày tháng năm nào)
            type: String,
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
        seri_number_start:{ //Số seri bắt đầu
            type: Number,
            required: true
        },
        seri_number_end:{ //Số seri kết thúc
            type:Number,
            required: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("EmbryoIssuanceRequest", embryoIssuanceRequestSchema);
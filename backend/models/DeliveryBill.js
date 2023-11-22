const mongoose = require("mongoose");

const deliveryBillSchema = new mongoose.Schema(
    {
        delivery_bill:{ // số phiếu xuất kho
            type: Number,
            unique: true,
            required: true
        },
        embryoIssuanceRequest_id:{ // id của yêu cầu cấp phôi, để phân biệt phiếu xuất kho này là của yêu cầu xin cấp phôi nào
            type: Number,
            default: null
        },
        requestForReissue_id:{
            type: Number,
            default: null
        },
        delivery_bill_creation_time:{ //thời gian tạo phiếu
            type: String
        },
        fullname_of_consignee:{//người nhận
            type: String
        },
        address_department:{//địa chỉ(bộ phận nhận sản phẩm), trường này lưu management_unit_id của yêu cầu xin cấp phôi
            type: Number
        },
        reason:{//lý do xuất kho
            type: String
        },
        export_warehouse:{//kho xuất
            type: String
        },
        address_export_warehouse:{//địa điểm kho xuất
            type: String
        },
        embryo_type:{//loại phôi, trường này lưu diploma_name_id của yêu cầu xin cấp phôi
            type: Number
        },
        numberOfEmbryos:{//số lượng phôi xuất
            type: Number
        },
        seri_number_start:{//số seri start
            type: Array
        },
        seri_number_end:{//số seri end
            type: Array
        },
        unit_price: { //đơn giá mỗi phôi
            type: Number
        },
        mscb: { //mscb người tạo phiếu xuất kho
            type: String
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("DeliveryBill", deliveryBillSchema);
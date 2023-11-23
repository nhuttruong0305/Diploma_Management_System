const mongoose = require("mongoose");

const damagedEmbryosSchema = new mongoose.Schema(
    {
        damagedEmbryos_id: { //mã phân biệt các document trong collection
            type: Number,
            unique: true,
            required: true
        },
        requestForReissue_id: { //mã để phân biệt phôi hư này là từ yc xin cấp lại phôi nào
            type:Number,
            default: null
        },
        diploma_name_id: { //lưu id của loại phôi bị hư hỏng
            type: Number,
            required: true
        },
        numberOfEmbryos:{
            type: Number
        },
        seri_number_start:{//số seri start
            type: Array
        },
        seri_number_end:{//số seri end
            type: Array
        },
        reason:{
            type: String,
            default: ""
        },
        time_create:{
            type: String,
            default: ""
        },
        mscb_create:{
            type: String,
            default: ""
        },
        status:{
            type: String,
            default: "Chưa hủy"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("DamagedEmbryos", damagedEmbryosSchema);
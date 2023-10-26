const mongoose = require("mongoose");

const diplomaNameSchema = new mongoose.Schema(
    {
        diploma_name_id:{
            type: Number,
            required: true
        },
        diploma_name_name:{
            type: String,
            required: true
        },
        diploma_type_id:{//id của loại văn bằng
            type: Number,
            required: true
        },
        management_unit_id:{ // do đơn vị nào quản lý
            type: Number,
            default: null
        },
        isEffective:{ //còn hiệu lực ko
            type: Boolean,
            default: false
        },
        from:{
            type: String,
            default: ""
        },
        to:{
            type:String,
            default: ""
        },
        options:{ //lưu các thông tin thêm cho mỗi tên văn bằng
            type: Array,
            default: []
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("DiplomaName", diplomaNameSchema);
const mongoose = require("mongoose");

const diplomaIssuanceSchema = new mongoose.Schema(
    {
        diploma_issuance_id: { //Id của đợt cấp văn bằng
            type: Number,
            required: true,
            unique: true
        },
        diploma_issuance_name: { //Tên đợt cấp văn bằng
            type: String,
            required: true
        },
        diploma_name_id: { //Id của tên của loại văn bằng
            type: Number,
            required: true
        },
    },
    {timestamps: true}
);

module.exports = mongoose.model("DiplomaIssuance", diplomaIssuanceSchema);
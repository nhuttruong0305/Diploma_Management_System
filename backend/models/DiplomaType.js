const mongoose = require("mongoose");

const diplomatypeSchema = new mongoose.Schema(
    {
        diploma_type_id:{
            type: Number,
            required: true,
            unique: true
        },
        diploma_type_name:{
            type: String,
            required: true,
            unique: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("DiplomaType", diplomatypeSchema);
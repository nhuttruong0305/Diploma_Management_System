const mongoose = require("mongoose");

const managementUnitSchema = new mongoose.Schema(
    {
        management_unit_id: {
            type:Number,
            required: true,
            unique: true
        },
        management_unit_name: {
            type: String,
            required: true,
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("ManagementUnit", managementUnitSchema);
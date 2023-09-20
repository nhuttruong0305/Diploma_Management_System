//Khoa

const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        faculty_id:{ //id khoa
            type: Number,
            required: true,
            unique: true
        },
        faculty_name:{ //tên khoa
            type: String,
            required: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Faculty", facultySchema);
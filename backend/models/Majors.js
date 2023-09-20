//Chuyên ngành

const mongoose = require("mongoose");

const majorsSchema = new mongoose.Schema(
    {
        majors_id:{ //id ngành
            type: Number,
            required: true,
            unique: true
        }, 
        faculty_id:{ //id khoa
            type: Number,
            required: true
        },
        majors_name: { //tên ngành
            type: String,
            required: true
        }       
    },
    {timestamps: true}
);

module.exports = mongoose.model("Majors", majorsSchema);
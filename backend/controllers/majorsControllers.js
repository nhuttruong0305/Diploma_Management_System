const MajorsModel = require("../models/Majors");

const majorsControllers = {
    //Add Majors
    addMajors: async(req, res) => {
        try{
            const newMajors = await new MajorsModel(req.body);

            //Save to DB
            const majorsSaved = await newMajors.save();
            return res.status(200).json(majorsSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Get major based on faculty
    getMajors: async(req, res) => {
        try{
            const majors_list = await MajorsModel.find({faculty_id: req.params.faculty_id});
            return res.status(200).json(majors_list);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = majorsControllers;
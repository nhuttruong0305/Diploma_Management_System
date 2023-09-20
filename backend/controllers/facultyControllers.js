const FacultyModel = require("../models/Faculty");

const facultyControllers = {
    addFaculty: async (req, res) => {
        try{
            const newFaculty = await new FacultyModel(req.body);

            const facultySaved = await newFaculty.save();
            return res.status(200).json(facultySaved);
        }catch(error){
            return res.status(500).json(error)
        }
    },
    getAllFaculty: async (req, res) => {
        try{
            const allFaculty = await FacultyModel.find();
            return res.status(200).json(allFaculty);
        }catch(error){
            return res.status(500).json(error)
        }
    }
}

module.exports = facultyControllers;
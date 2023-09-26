const DiplomaTypeModel = require("../models/DiplomaType");

const diplomaTypeControllers = {
    getAllDiplomaType: async (req, res) => {
        try{
            const allDiplomaType = await DiplomaTypeModel.find();
            return res.status(200).json(allDiplomaType);
        }catch(err){
            return res.status(500).json(err)
        }
    },
    addDiplomaType: async (req, res) => {
        try{
            const newDiplomaType = new DiplomaTypeModel(req.body);
            const diplomaTypeSaved = await newDiplomaType.save();
            return res.status(200).json(diplomaTypeSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = diplomaTypeControllers;
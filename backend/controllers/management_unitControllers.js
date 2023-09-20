const ManagementUnitModel = require("../models/ManagementUnit");

const managementUnitControllers = {
    //Add management unit
    addManagementUnit: async(req, res) => {
        try{
            const newManagementUnit = new ManagementUnitModel(req.body);

            //Save to DB
            const managementUnitSaved = await newManagementUnit.save();
            return res.status(200).json(managementUnitSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Get all management unit
    getAllManagementUnit: async(req, res) => {
        try{
            const allManagementUnit = await ManagementUnitModel.find();
            return res.status(200).json(allManagementUnit);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = managementUnitControllers;
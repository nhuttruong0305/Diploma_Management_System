const UserAccountModel = require("../models/User");

const userAccountControllers = {
    //Get all user account
    getAllUserAccount: async (req, res) => {
        try{
            let result = [];
            const allUsers = await UserAccountModel.find();
            allUsers.forEach((currentValue, index)=>{
                if(currentValue.role[0]!="System administrator"){
                    result = [...result, currentValue];
                }
            })
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(err);
        }
    }
}

module.exports = userAccountControllers;
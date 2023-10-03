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
            return res.status(500).json(error);
        }
    },
    searchUserAccountByName: async (req, res) => {
        try{
            const keyword = req.query.keyword;
            const mssv_cb = req.query.mssv_cb;
            const listOfUser = await UserAccountModel.find({fullname:{ $regex: `${keyword}`, $options: 'i'}});
            
            let result = [];
            listOfUser.forEach((currentValue)=>{
                if(currentValue.role[0]!="System administrator"){
                    result = [...result, currentValue];
                }
            })

            if(mssv_cb != ""){
                let result2 = [];
                result.forEach((currentValue)=>{
                    if(currentValue.mssv_cb.includes(mssv_cb)){
                        result2 = [...result2, currentValue];
                    }
                })
                return res.status(200).json(result2);                
            }

            return res.status(200).json(result);            
        }catch(error){
            return res.status(500).json(error);
        }
    },
}

module.exports = userAccountControllers;
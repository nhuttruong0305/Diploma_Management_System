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
    //Hàm lấy ra all user diploma importer thuộc 1 đơn vị quản lý
    getAllUserDiplomaImporterByMU: async (req, res) => {
        try{
            const MU_id = parseInt(req.params.management_unit_id);
            const listOfUser = await UserAccountModel.find({management_unit: MU_id, role: { $in: 'Diploma importer' }});
            return res.status(200).json(listOfUser);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Lấy danh sách các mssv_cb có quyền nhập 1 loại văn bằng nào đó ra
    getListOfMSCBDiplomaImporterByDiplomaNameID: async(req, res) => {
        try{
            const diplomaNameId = parseInt(req.params.diploma_name_id);
            const listOfMSCB = await UserAccountModel.find({listOfDiplomaNameImport: { $in: diplomaNameId }});

            //mảng chứa các mscb
            let result = [];
            listOfMSCB.forEach((currentValue) => {
                result = [...result, currentValue.mssv_cb];
            })

            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm thêm 1 tên(loại) văn bằng vào listOfDiplomaNameImport của 1 user
    addDiplomaNameIntoUser: async(req, res) => {
        try{
            //Lấy thông tin về user đó ra
            const _idUser = req.params._id_user;
            const user = await UserAccountModel.findById(_idUser);

            const diplomaNameId = parseInt(req.params.diploma_name_id);

            const isExist = user.listOfDiplomaNameImport.includes(diplomaNameId);

            if(!isExist){
                const options = {returnDocument: "after"};
                const updateDoc = {
                    listOfDiplomaNameImport: [...user.listOfDiplomaNameImport, diplomaNameId]
                }

                const updateUser = await UserAccountModel.findByIdAndUpdate(_idUser, updateDoc, options);
                return res.status(200).json(updateUser);
            }else{
                return res.status(200).json("Đã tồn tại loại văn bằng này trong danh sách được quyền import");
            }
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm xóa 1 loại văn bằng ra khỏi danh sách listOfDiplomaNameImport của 1 user
    deleteDiplomaNameFromUser: async (req, res) => {
        try{
            //Lấy thông tin về user đó ra
            const _idUser = req.params._id_user;
            const user = await UserAccountModel.findById(_idUser);

            const diplomaNameId = parseInt(req.params.diploma_name_id);
            const isExist = user.listOfDiplomaNameImport.includes(diplomaNameId);

            if(isExist){
                const indexOfDiplomaName = user.listOfDiplomaNameImport.indexOf(diplomaNameId);
                const removed = user.listOfDiplomaNameImport.splice(indexOfDiplomaName,1);

                const options = {returnDocument: "after"};
                const updateDoc = {
                    listOfDiplomaNameImport: user.listOfDiplomaNameImport
                }

                const updateUser = await UserAccountModel.findByIdAndUpdate(_idUser, updateDoc, options);
                return res.status(200).json(updateUser);
            }else{
                return res.status(200).json("Loại văn bằng này không tồn tại trong danh sách các loại văn bằng được quyền import");
            }
            // return res.status(200).json(indexOfDiplomaName);
        }catch(error){
            return res.status(500).json(error);
        }
    },

    //Hàm lấy ra all user diploma reviewer thuộc 1 đơn vị quản lý
    getAllUserDiplomaReviewerByMU: async (req, res) => {
        try{
            const MU_id = parseInt(req.params.management_unit_id);
            const listOfUser = await UserAccountModel.find({management_unit: MU_id, role: { $in: 'Diploma reviewer' }});
            return res.status(200).json(listOfUser);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm lấy ra danh sách mscb có quyền duyệt 1 loại văn bằng
    getListOfMSCBDiplomaReviewerByDiplomaNameID: async (req, res) => {
        try{
            const diplomaNameId = parseInt(req.params.diploma_name_id);
            const listOfMSCB = await UserAccountModel.find({listOfDiplomaNameReview: { $in: diplomaNameId }});
            
            //mảng chứa các mscb
            let result = [];
            listOfMSCB.forEach((currentValue) => {
                result = [...result, currentValue.mssv_cb];
            })
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm thêm 1 tên(loại) văn bằng vào listOfDiplomaNameReview của 1 user
    addDiplomaNameIntoUserReview: async (req, res) => {
        try{
            //Lấy thông tin về user đó ra
            const _idUser = req.params._id_user;
            const user = await UserAccountModel.findById(_idUser);

            const diplomaNameId = parseInt(req.params.diploma_name_id);
            const isExist = user.listOfDiplomaNameReview.includes(diplomaNameId);

            if(!isExist){
                const options = {returnDocument: "after"};
                const updateDoc = {
                    listOfDiplomaNameReview: [...user.listOfDiplomaNameReview, diplomaNameId]
                }

                const updateUser = await UserAccountModel.findByIdAndUpdate(_idUser, updateDoc, options);
                return res.status(200).json(updateUser);
            }else{
                return res.status(200).json("Đã tồn tại loại văn bằng này trong danh sách được quyền duyệt");
            }
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm xóa 1 tên(loại) văn bằng khỏi listOfDiplomaNameReview của 1 user
    deleteDiplomaNameFromUserReview: async (req, res) => {
        try{
            //Lấy thông tin về user đó ra
            const _idUser = req.params._id_user;
            const user = await UserAccountModel.findById(_idUser);

            const diplomaNameId = parseInt(req.params.diploma_name_id);
            const isExist = user.listOfDiplomaNameReview.includes(diplomaNameId);

            if(isExist){
                const indexOfDiplomaName = user.listOfDiplomaNameReview.indexOf(diplomaNameId);
                const removed = user.listOfDiplomaNameReview.splice(indexOfDiplomaName,1);

                const options = {returnDocument: "after"};
                const updateDoc = {
                    listOfDiplomaNameReview: user.listOfDiplomaNameReview
                }

                const updateUser = await UserAccountModel.findByIdAndUpdate(_idUser, updateDoc, options);
                return res.status(200).json(updateUser);
            }else{
                return res.status(200).json("Loại văn bằng này không tồn tại trong danh sách các loại văn bằng được quyền duyệt");    
            }
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = userAccountControllers;
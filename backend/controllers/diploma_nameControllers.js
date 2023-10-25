const DiplomaNameModel = require("../models/DiplomaName");
const UserAccountModel = require("../models/User");
const DiplomaModel = require("../models/Diploma");
const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");
const DiplomaIssuanceModel = require("../models/DiplomaIssuance");
const diplomaNameControllers = {
    addDiplomaName: async (req, res) => { //done
        try{
            const allDiplomaNameUnfiltered = await DiplomaNameModel.find();
            let allDiplomaName = []; //đây là mảng tất cả diploma name đã dc lọc các phần tử trùng nhau 

            allDiplomaNameUnfiltered.forEach((currentValue1)=>{
                let isExist = false;
                allDiplomaName.forEach((currentValue2) => {
                    if(currentValue2.diploma_name_id == currentValue1.diploma_name_id){
                        isExist = true;
                    }
                })
                if(!isExist){
                    allDiplomaName.push(currentValue1);
                }
            });


            let isFault = false; //dùng để check xem có trùng tên văn bằng không
            
            //dùng để kiểm tra xem có quyết định check lỗi trùng văn bằng hay không
            //true: dùng trong việc thêm văn bằng, false dùng trong việc "chuyển"
            let isCheckDuplicate = req.body.isCheckDuplicate;

            if(isCheckDuplicate){
                allDiplomaName.forEach((currentValue)=>{
                    if(currentValue.diploma_name_name == req.body.diploma_name_name){
                        isFault = true;
                    }
                });

                if(isFault){
                    return res.status(400).json("Tên văn bằng này đã tồn tại, hãy nhập tên mới");
                }

                const newDiplomaName = new DiplomaNameModel({
                    diploma_name_id: allDiplomaName[allDiplomaName.length-1].diploma_name_id + 1,
                    diploma_name_name:req.body.diploma_name_name,
                    diploma_type_id:req.body.diploma_type_id,
                });
                const diplomaNameSaved = await newDiplomaName.save();
                return res.status(200).json(diplomaNameSaved);   
            }else{
                //Lấy id cũ
                const diplomaNameNow = await DiplomaNameModel.findOne({diploma_name_name: req.body.diploma_name_name});
                const newDiplomaName = new DiplomaNameModel({
                    diploma_name_id: diplomaNameNow.diploma_name_id,
                    diploma_name_name: diplomaNameNow.diploma_name_name,
                    diploma_type_id: diplomaNameNow.diploma_type_id
                });
                const diplomaNameSaved = await newDiplomaName.save();
                return res.status(200).json(diplomaNameSaved);
            }
        }catch(error){
            return res.status(500).json(error);
        }
    },
    getAllDiplomaName: async (req, res) => {
        try{
            const allDiplomaName = await DiplomaNameModel.find();
            let result = [];
            allDiplomaName.forEach((currentValue1) => {
                let isExist = false; 
                result.forEach((currentValue2) => {
                    if(currentValue2.diploma_name_id == currentValue1.diploma_name_id){
                        isExist = true;
                    }
                })

                if(!isExist){
                    result.push(currentValue1);
                }
            });
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    editDiplomaName: async (req, res) => {
        try{
            //Lấy ra tất cả diploma name đã lọc ra các phần tử trùng
            const allDiplomaNameUnfiltered = await DiplomaNameModel.find();
            let allDiplomaName = []; //đây là mảng tất cả diploma name đã dc lọc các phần tử trùng nhau 

            allDiplomaNameUnfiltered.forEach((currentValue1)=>{
                let isExist = false;
                allDiplomaName.forEach((currentValue2) => {
                    if(currentValue2.diploma_name_id == currentValue1.diploma_name_id){
                        isExist = true;
                    }
                })
                if(!isExist){
                    allDiplomaName.push(currentValue1);
                }
            });

            let isFault = false; //dùng để check xem có trùng tên văn bằng không

            //Biến này dùng trong trường hợp chỉ cập nhật loại văn bằng
            const documentInDiplomaName = await DiplomaNameModel.findOne({diploma_name_id: parseInt(req.params.diploma_name_id)});

            if(req.body.diploma_name_name == documentInDiplomaName.diploma_name_name){
                isFault = false;
            }else{
                allDiplomaName.forEach((currentValue)=>{
                    if(currentValue.diploma_name_name == req.body.diploma_name_name){
                        isFault = true;
                    }
                });
            }

            if(isFault){
                return res.status(400).json("Tên văn bằng này đã tồn tại, hãy nhập tên mới");
            }

            //Nếu tên văn bằng không bị trùng, ta tiến hành cập nhật các document có diploma_name_id được truyền
            
            const filter = {diploma_name_id: parseInt(req.params.diploma_name_id)};
            const updateDoc = {
                diploma_name_name: req.body.diploma_name_name,    
                diploma_type_id: req.body.diploma_type_id
            };

            const diplomaNameUpdate = await DiplomaNameModel.updateMany(filter, updateDoc);
            return res.status(200).json(diplomaNameUpdate);

        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Tìm kiếm tên văn bằng theo keyword
    //Hàm này nếu nhập keyword rỗng thì sẽ trả về all diploma
    searchDiplomaName: async (req, res) => {
        try{
            const keyword = req.query.keyword;
            const listOfDiplomaName = await DiplomaNameModel.find({diploma_name_name:{ $regex: `${keyword}`, $options: 'i'}, to: ""});//chỗ này đã đúng  vì nếu 1 loại văn bằng mà trường to rỗng thì 1 là chưa phân quyền, 2 là đã phân quyền, nếu to có giá trị là đã bị chuyển
            return res.status(200).json(listOfDiplomaName);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    
    decentralizationDiplomaName: async (req, res) => {
        try{
            const updateDoc = {
                management_unit_id: req.body.management_unit_id,
                isEffective: true,
                from: req.body.from
            }
            // const filter = {diploma_name_id: parseInt(req.params.diploma_name_id)};

            // const diplomaNameUpdate = await DiplomaNameModel.updateMany(filter, updateDoc);
            const options = {returnDocument: "after"};

            const diplomaNameUpdate = await DiplomaNameModel.findByIdAndUpdate(req.params.diploma_name_id, updateDoc, options);
            return res.status(200).json(diplomaNameUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    transferDiplomaName: async (req, res) => {
        try{
            const currentDate = new Date();
            let day = currentDate.getDate(); // Lấy ngày
            let month = currentDate.getMonth() + 1; // Lấy tháng (chú ý: tháng bắt đầu từ 0)
            const year = currentDate.getFullYear(); // Lấy năm
            
            if(day<10){
                day = `0${day}`;
            }

            if(month<10){
                month = `0${month}`;
            }

            const updateDoc = {
                isEffective: false,
                to: `${year}-${month}-${day}`
            }
            // const filter = {diploma_name_id: parseInt(req.params.diploma_name_id)};
            
            // const diplomaNameUpdate = await DiplomaNameModel.updateMany(filter, updateDoc);
            //Tìm các user có quyền nhập và duyệt loại văn bằng này và xóa diploma_name_id trong 2 danh sách: listOfDiplomaNameImport & listOfDiplomaNameReview
            //1. Lấy ra all user có quyền nhập văn bằng đó
            const listOfUserNeedToDeletdImport = await UserAccountModel.find({listOfDiplomaNameImport: { $in: parseInt(req.params.diploma_name_id_to_delete_list) }});
            for(let i = 0; i < listOfUserNeedToDeletdImport.length; i++){
                const indexOfDiplomaName = listOfUserNeedToDeletdImport[i].listOfDiplomaNameImport.indexOf(parseInt(req.params.diploma_name_id_to_delete_list));
                const removed = listOfUserNeedToDeletdImport[i].listOfDiplomaNameImport.splice(indexOfDiplomaName,1);

                const options2 = {returnDocument: "after"};
                const updateDoc2 = {
                    listOfDiplomaNameImport: listOfUserNeedToDeletdImport[i].listOfDiplomaNameImport
                }
                const updateListImport = await UserAccountModel.findByIdAndUpdate(listOfUserNeedToDeletdImport[i]._id, updateDoc2, options2);
            }

            //2. Lấy ra all user có quyền duyệt văn bằng đó
            const listOfUserNeedToDeleteReview = await UserAccountModel.find({listOfDiplomaNameReview: { $in: parseInt(req.params.diploma_name_id_to_delete_list) }});
            for(let j = 0; j < listOfUserNeedToDeleteReview.length; j++){
                const indexOfDiplomaName2 = listOfUserNeedToDeleteReview[j].listOfDiplomaNameReview.indexOf(parseInt(req.params.diploma_name_id_to_delete_list));
                const removed2 = listOfUserNeedToDeleteReview[j].listOfDiplomaNameReview.splice(indexOfDiplomaName2,1);

                const options3 = {returnDocument: "after"};
                const updateDoc3 = {
                    listOfDiplomaNameReview: listOfUserNeedToDeleteReview[j].listOfDiplomaNameReview
                }
                const updateListReview = await UserAccountModel.findByIdAndUpdate(listOfUserNeedToDeleteReview[j]._id, updateDoc3, options3);
            }

            const options = {returnDocument: "after"};
            const diplomaNameUpdate = await DiplomaNameModel.findByIdAndUpdate(req.params.diploma_name_id, updateDoc, options);
            return res.status(200).json(diplomaNameUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaNameForDNMH: async (req,res) => {
        try{
            const keyword = req.query.keyword;
            const listOfDiplomaName = await DiplomaNameModel.find({diploma_name_name:{ $regex: `${keyword}`, $options: 'i'}, to: { $ne: null, $ne: '' }});
            return res.status(200).json(listOfDiplomaName);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    getAllDiplomaNameByMU: async (req, res) => {
        try{
            const result = await DiplomaNameModel.find({management_unit_id: parseInt(req.params.management_unit_id), isEffective: true});
            return res.status(200).json(result);
        }catch(error){  
            return res.status(500).json(error);
        }
    },
    //Hàm xóa tên văn bằng
    deleteDiplomaName: async (req, res) => {
        try{
            //Lấy ra các văn bằng trong collection diploma, nếu không có văn bằng nào thuộc loại cần xóa trong collection diploma mới xóa được
            const listOfDiplomaByDiplomaName = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});
            if(listOfDiplomaByDiplomaName.length>0){
                return res.status(400).json("Đã có văn bằng thuộc loại này tồn tại, không thể xóa được");
            }         
            
            //Lấy ra các document trong collection embryoissuancerequests, nếu ko có document nào mới dc xóa
            const listEIRByDiplomaName = await EmbryoIssuanceRequestModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});
            if(listEIRByDiplomaName.length>0){
                return res.status(400).json("Đã có yêu cầu cấp phôi văn bằng thuộc loại này tồn tại, không thể xóa được");
            }

            //Xóa đợt cấp văn bằng của tên văn bằng cần xóa
            const deleteDiplomaIssuance = await DiplomaIssuanceModel.deleteMany({diploma_name_id: parseInt(req.params.diploma_name_id)});
            //Xóa tên văn bằng trong diploma_names
            const deleteDiplomaName = await DiplomaNameModel.deleteMany({diploma_name_id: parseInt(req.params.diploma_name_id)});
            
            //Xóa diploname_id của loại văn bằng cần xóa trong các listOfDiplomaNameImport và listOfDiplomaNameReview
            //Đầu tiên lấy ra all user
            const allUser = await UserAccountModel.find();
            //Chạy vòng lặp
            for(let i = 0; i<allUser.length; i++){
                const isExistImport = allUser[i].listOfDiplomaNameImport.includes(parseInt(req.params.diploma_name_id));
                const isExistReview = allUser[i].listOfDiplomaNameReview.includes(parseInt(req.params.diploma_name_id));
                if(isExistImport){
                    const indexOfDiplomaName = allUser[i].listOfDiplomaNameImport.indexOf(parseInt(req.params.diploma_name_id));
                    const removed = allUser[i].listOfDiplomaNameImport.splice(indexOfDiplomaName,1);

                    const options = {returnDocument: "after"};
                    const updateDoc = {
                        listOfDiplomaNameImport: allUser[i].listOfDiplomaNameImport
                    }

                    const updateUser = await UserAccountModel.findByIdAndUpdate(allUser[i]._id, updateDoc, options);
                }

                if(isExistReview){
                    const indexOfDiplomaName = allUser[i].listOfDiplomaNameReview.indexOf(parseInt(req.params.diploma_name_id));
                    const removed = allUser[i].listOfDiplomaNameReview.splice(indexOfDiplomaName,1);

                    const options = {returnDocument: "after"};
                    const updateDoc = {
                        listOfDiplomaNameReview: allUser[i].listOfDiplomaNameReview
                    }

                    const updateUser = await UserAccountModel.findByIdAndUpdate(allUser[i]._id, updateDoc, options);
                }
            }
            return res.status(200).json("Xóa tên văn bằng thành công");
        }catch(error){
            return res.status(500).json(error); 
        }
    }
}

module.exports = diplomaNameControllers;
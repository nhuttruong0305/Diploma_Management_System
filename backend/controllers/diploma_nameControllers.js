const DiplomaNameModel = require("../models/DiplomaName");

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
    } 
}

module.exports = diplomaNameControllers;
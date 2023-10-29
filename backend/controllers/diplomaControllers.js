const DiplomaModel = require("../models/Diploma");

const diplomaControllers = {
    addNewDiploma: async (req, res) => {
        try{
            //Đầu tiên lấy ra danh sách các văn bằng của loại văn bằng được thêm để kiểm tra xem số hiệu và số vào sổ có trùng lặp không
            const listDiplomaByDiplomaNameID = await DiplomaModel.find({diploma_name_id: req.body.diploma_name_id});
            //Chạy qua vòng lặp của listDiplomaByDiplomaNameID để kiểm tra xem số hiệu có bị trùng không
            let isExist = false;
            listDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == req.body.diploma_number){
                    isExist = true;
                }
            });
            if(isExist){
                return res.status(400).json("Số hiệu văn bằng đã tồn tại");
            }

            //Tiếp theo kiểm tra xem số vào sổ văn bằng có bị trùng không
            let isExist2 = false;
            listDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.numbersIntoTheNotebook == req.body.numbersIntoTheNotebook){
                    isExist2 = true;
                }
            })
            if(isExist2){
                return res.status(400).json("Số vào sổ văn bằng đã tồn tại");
            }
            
            //Cuối cùng check xem có trùng CCCD không
            let isExist3 = false;
            listDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.cccd == req.body.cccdAdd){
                    isExist3 = true;
                }
            })
            if(isExist3){
                return res.status(400).json("Số CCCD đã tồn tại");
            }

            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            //Lấy văn bằng cuối cùng trong DB ra để lấy diploma_id + 1 làm id cho diploma tiếp theo
            const lastedDiploma = await DiplomaModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
            const newDiploma = new DiplomaModel({
                diploma_id: lastedDiploma.diploma_id + 1, //(1)
                management_unit_id: req.body.management_unit_id, //(2)
                diploma_name_id: req.body.diploma_name_id, //(3)
                diploma_issuance_id: req.body.diploma_issuance_id, //(4)
                fullname: req.body.fullname, //(5)  có
                sex: req.body.sex, //(6) có
                dateofbirth: req.body.dateofbirth, //(7) có
                address: req.body.address, //(8) có
                cccd: req.body.cccdAdd, //(9) có
                sign_day: req.body.sign_day, //(10) có
                diploma_number: req.body.diploma_number, //(11) có
                numbersIntoTheNotebook:req.body.numbersIntoTheNotebook, //(12) có

                diem_tn: req.body.diemTNAdd, //(13) có
                diem_th: req.body.diemTHAdd, //14 có
                nghe: req.body.ngheAdd,//15 
                noi: req.body.noiAdd,//16 
                doc: req.body.docAdd,//17 
                viet: req.body.vietAdd,//18 
                test_day: req.body.test_day,//19 
                graduationYear: req.body.graduationYear,//20 
                classification: req.body.classification,//21 

                nganh_dao_tao: req.body.majorAdd,//22 
                council: req.body.council,//23 
                
                mscb_import: req.body.mscb_import,
                officer_name_import: req.body.officer_name_import,
                time_import: `${year}-${month}-${day}`
            })

            const diplomaSaved = await newDiploma.save();
            return res.status(200).json(diplomaSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm này lấy ra all diploma của 1 đơn vị quản lý của tài khoản (HÀM NÀY KHÔNG XÀI NỮA)
    getAllDiplomaByMU: async (req, res) => {
        try{
            const result = await DiplomaModel.find({management_unit_id: parseInt(req.params.management_unit_id)});
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm search lấy ra các diploma của 1 đơn vị quản lý của tài khoản
    searchDiplomaWithMultiCondition: async (req, res) => {
        try{
            const name = req.query.name;
            const diplomaNumber = req.query.diplomaNumber;
            const numbersIntoTheNotebook = req.query.numbersIntoTheNotebook;
            const status = req.query.status;
            const result = await DiplomaModel.find({
                                                    // management_unit_id: parseInt(req.params.management_unit_id), 
                                                    fullname:{ $regex: `${name}`, $options: 'i'},
                                                    diploma_number: { $regex: `${diplomaNumber}`, $options: 'i'},
                                                    numbersIntoTheNotebook: { $regex: `${numbersIntoTheNotebook}`, $options: 'i'},
                                                    status: { $regex: `${status}`, $options: 'i'}
            });
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    editDiploma: async (req, res) => {
        try{
            //Đầu tiên lấy các văn bằng có cùng loại văn bằng ra trước
            const diplomasOfTheSameDiplomaNameID1 = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});  
            
            let diplomasOfTheSameDiplomaNameID = [];
            diplomasOfTheSameDiplomaNameID1.forEach((currentValue)=>{
                if(currentValue._id != req.params._id){
                    diplomasOfTheSameDiplomaNameID = [...diplomasOfTheSameDiplomaNameID, currentValue];
                }
            })
            //Biến kiểm tra trùng số hiệu văn bằng
            let isExistDiplomaNumber = false;
            //Biến kiểm tra trùng số vào sổ văn bằng
            let isExistNumberNoteBook = false;
            //Biến kiểm tra trùng số CCCD của người được cấp
            let isExistCCCD = false;
            
            diplomasOfTheSameDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == req.body.diploma_number){
                    isExistDiplomaNumber = true;
                }
                if(currentValue.numbersIntoTheNotebook == req.body.numbersIntoTheNotebook){
                    isExistNumberNoteBook = true;
                }
                if(currentValue.cccd == req.body.cccd){
                    isExistCCCD = true;
                }
            })
            if(isExistDiplomaNumber){
                return res.status(400).json("Số hiệu của văn bằng đã tồn tại");
            }
            if(isExistNumberNoteBook){
                return res.status(400).json("Số vào sổ của văn bằng đã tồn tại");
            }
            if(isExistCCCD){
                return res.status(400).json("Số CCCD đã tồn tại");
            }

            const options = {returnDocument: "after"};
            const updateDoc = req.body;

            const diplomaUpdate = await DiplomaModel.findByIdAndUpdate(req.params._id, updateDoc, options);

            return res.status(200).json(diplomaUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    deleteDiploma: async (req, res) => {
        try{
            const deleteDiploma = await DiplomaModel.findByIdAndDelete(req.params._id);
            return res.status(200).json(deleteDiploma);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    reviewDiploma: async (req,res) => {
        try{
            const options = {returnDocument: "after"};
            const updateDoc = {
                status: req.body.status, 
                mscb: req.body.mscb,
                officer_name: req.body.officer_name,
                time: req.body.time,
                explain: req.body.explain
            }

            const diplomaUpdate = await DiplomaModel.findByIdAndUpdate(req.params._id, updateDoc, options);
            return res.status(200).json(diplomaUpdate);            
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaForDiplomaDiary: async (req, res) => {
        try{
            const officer_name = req.query.officer_name ;
            const mscb = req.query.mscb;
            const status = req.query.status; 

            const result = await DiplomaModel.find({
                officer_name: { $regex: `${officer_name}`, $options: 'i'},
                mscb: { $regex: `${mscb}`, $options: 'i'},
                status: { $regex: `${status}`, $options: 'i'}
                // status: status
            });
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaTraCuu: async(req, res) => {
        try{
            const diploma_name_id = parseInt(req.query.diploma_name_id);
            const fullname = req.query.fullname;
            const diploma_number = req.query.diploma_number;
            const number_in_note = req.query.number_in_note;

            const result = await DiplomaModel.find({
                diploma_name_id: diploma_name_id,
                fullname: { $regex: `${fullname}`, $options: 'i'},
                diploma_number: { $regex: `${diploma_number}`, $options: 'i'},
                numbersIntoTheNotebook: { $regex: `${number_in_note}`, $options: 'i'},
                status: "Đã duyệt"
            });

            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    getAllDiplomaByDiplomaNameId: async (req,res) => {
        try{
            const result = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});  
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = diplomaControllers;
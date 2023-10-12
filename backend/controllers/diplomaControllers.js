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

            //Lấy văn bằng cuối cùng trong DB ra để lấy diploma_id + 1 làm id cho diploma tiếp theo
            const lastedDiploma = await DiplomaModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
            const newDiploma = new DiplomaModel({
                diploma_id: lastedDiploma.diploma_id + 1,
                management_unit_id: req.body.management_unit_id,
                diploma_name_id: req.body.diploma_name_id,
                diploma_issuance_id: req.body.diploma_issuance_id,
                fullname: req.body.fullname,
                sex: req.body.sex,
                dateofbirth: req.body.dateofbirth,
                address: req.body.address,
                test_day: req.body.test_day,
                classification: req.body.classification,
                graduationYear: req.body.graduationYear,
                sign_day: req.body.sign_day,
                diploma_number: req.body.diploma_number,
                numbersIntoTheNotebook:req.body.numbersIntoTheNotebook
            })

            const diplomaSaved = await newDiploma.save();
            return res.status(200).json(diplomaSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm này lấy ra all diploma của 1 đơn vị quản lý của tài khoản
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
            const diplomasOfTheSameDiplomaNameID = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});  
            //Biến kiểm tra trùng số hiệu văn bằng
            let isExistDiplomaNumber = false;
            //Biến kiểm tra trùng số vào sổ văn bằng
            let isExistNumberNoteBook = false;
            
            diplomasOfTheSameDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == req.body.diplomaNumberEdit){
                    isExistDiplomaNumber = true;
                }

                if(currentValue.numbersIntoTheNotebook == req.body.numberInNoteEdit){
                    isExistNumberNoteBook = true;
                }
            })
            if(isExistDiplomaNumber){
                return res.status(400).json("Số hiệu của văn bằng đã tồn tại");
            }
            if(isExistNumberNoteBook){
                return res.status(400).json("Số vào sổ của văn bằng đã tồn tại");
            }

            const options = {returnDocument: "after"};
            const updateDoc = {
                fullname: req.body.nameOfTheGranteeEdit,
                sex: req.body.sexEdit,
                dateofbirth: req.body.dateofbirthEdit,
                address: req.body.addressEdit,
                test_day: req.body.testDayEdit,
                classification: req.body.classificationEdit,
                graduationYear: req.body.graduationYearEdit,
                sign_day: req.body.signDayEdit,
                diploma_number: req.body.diplomaNumberEdit,
                numbersIntoTheNotebook: req.body.numberInNoteEdit
            }

            const diplomaUpdate = await DiplomaModel.findByIdAndUpdate(req.params._id, updateDoc, options);

            return res.status(200).json(diplomaUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = diplomaControllers;
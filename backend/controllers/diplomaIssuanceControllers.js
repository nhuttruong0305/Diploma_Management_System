const DiplomaIssuanceModel = require("../models/DiplomaIssuance");
const DiplomaNamesModel = require("../models/DiplomaName");

const diplomaIssuanceController = {
    getAllDiplomaIssuanceByMU: async (req, res) => {// Hàm này để lấy tất cả các đợt cấp văn bằng dựa theo đơn vị quản lý của tài khoản cán bộ
        try{
            //Đầu tiên lấy ra các tên(loại văn bằng) do đơn vị quản lý đó quản lý trước và đưa vào mảng
            let diplomasBelongingToTheMU = await DiplomaNamesModel.find({management_unit_id: parseInt(req.params.management_unit_id), isEffective: true});

            //Chạy vòng lặp các diploma_name_id từ diplomasBelongingToTheMU
            let finalResult = [];
            
            for(let i = 0; i < diplomasBelongingToTheMU.length; i++){
                const res = await DiplomaIssuanceModel.find({diploma_name_id: diplomasBelongingToTheMU[i].diploma_name_id});
                
                res.forEach((currentValue)=>{
                    finalResult = [...finalResult, currentValue]; 
                })
                // finalResult = [...finalResult, res];
            }
            return res.status(200).json(finalResult);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    addDiplomaIssuanceByMU: async (req, res) => {
        try{
            //Đầu tiên lấy thông tin về các đợt cấp văn bằng của tên(loại văn bằng) ra trước
            const allDiplomaIssuanceOfDiplomaName = await DiplomaIssuanceModel.find({diploma_name_id: req.body.diploma_name_id});

            //Chạy vòng lặp để kiểm tra xem tên đợt cấp văn bằng muốn thêm (dành cho tên(loại) văn bằng) có trùng với các tên đợt cấp 
            //văn bằng đã được thêm hay chưa
            let isDuplicate = false;

            allDiplomaIssuanceOfDiplomaName.forEach((currentValue)=>{
                if(currentValue.diploma_issuance_name == req.body.diploma_issuance_name){
                    isDuplicate = true;
                }
            })
            if(isDuplicate){
                return res.status(400).json("Tên đợt cấp văn bằng đã tồn tại, vui lòng nhập tên khác");
            }

            //Lấy đợt cấp văn bằng cuối cùng ra để lấy diploma_issuance_id + 1 làm id cho document mới
            const lastedDiplomaIssuance = await DiplomaIssuanceModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

            //Object để lưu vào DB
            const newDiplomaIssuance = new DiplomaIssuanceModel({
                diploma_issuance_id: lastedDiplomaIssuance.diploma_issuance_id+1,
                diploma_issuance_name: req.body.diploma_issuance_name,
                diploma_name_id: req.body.diploma_name_id
            })

            const diplomaIssuanceSaved = await newDiplomaIssuance.save();
            return res.status(200).json(diplomaIssuanceSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },  
}

module.exports = diplomaIssuanceController;
const DSHVModel = require("../models/DSHV");
const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");
const DSHVController = {
    addStudent: async (req, res) => {
        try{
            //Lấy yêu cầu cấp phôi cuối cùng trong DB ra để lấy embryoIssuanceRequest_id + 1 làm id cho yêu cầu cấp phôi tiếp theo
            const lastedEIR = await EmbryoIssuanceRequestModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

            const newHV = new DSHVModel({
                embryoIssuanceRequest_id: lastedEIR.embryoIssuanceRequest_id,
                fullname: req.body.fullname,
                sex: req.body.sex,
                dateOfBirth: req.body.dateOfBirth,
                address: req.body.address,
                CCCD: req.body.CCCD,
               
                diem_tn: req.body.diem_tn,
                diem_th: req.body.diem_th,
                nghe: req.body.nghe,
                noi: req.body.noi,
                doc: req.body.doc,
                viet: req.body.viet,
                test_day: req.body.test_day,
                graduationYear: req.body.graduationYear,
                classification: req.body.classification,
                nganh_dao_tao: req.body.nganh_dao_tao,
                council: req.body.council,
            })
            const HVSaved = await newHV.save();
            return res.status(200).json(HVSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    // getDSHVByDiplomaNameID: async (req, res) => {
    //     try{
    //         const result = await DSHVModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});
    //         return res.status(200).json(result);
    //     }catch(error){
    //         return res.status(500).json(error);
    //     }
    // }
}

module.exports = DSHVController;
const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");

//Sửa lại hàm này (đã sửa)
const embryoIssuanceRequestController = {
    getAllembryoIssuanceRequestByListDiplomaNameId: async (req, res) => {
        try{
            const result = await EmbryoIssuanceRequestModel.find({diploma_name_id: req.params.diploma_name_id});            
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Thêm yêu cầu cấp phôi mới
    addEmbryoIssuanceRequest: async (req, res) => {
        try{
            //Lấy yêu cầu cấp phôi cuối cùng trong DB ra để lấy embryoIssuanceRequest_id + 1 làm id cho yêu cầu cấp phôi tiếp theo
            const lastedEIR = await EmbryoIssuanceRequestModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
            
            //Lấy yêu cầu cấp phôi cuối cùng của loại văn bằng được thêm để quản lý số seri
            const lastedEIRByDiplomaNameID = await EmbryoIssuanceRequestModel.findOne({diploma_name_id: req.body.diploma_name_id}, {}, { sort: { 'createdAt': -1 } })
            
            //Lấy ngày hiện tại để điền time tạo yêu cầu
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            const year = today.getFullYear();

            if(day<10){
                day = `0${day}`;
            }

            if(month<10){
                month = `0${month}`;
            }

            if(lastedEIRByDiplomaNameID!=null){
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id:lastedEIR.embryoIssuanceRequest_id + 1, //
                    management_unit_id: req.body.management_unit_id, //có
                    diploma_name_id: req.body.diploma_name_id, //có
                    examination: req.body.examination, //có
                    numberOfEmbryos: req.body.numberOfEmbryos, //có
                    seri_number_start: lastedEIRByDiplomaNameID.seri_number_end+1,//
                    seri_number_end: parseInt(lastedEIRByDiplomaNameID.seri_number_end)+parseInt(req.body.numberOfEmbryos), //
                    mscb: req.body.mscb, //có
                    time: `${year}-${month}-${day}`
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }else{
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id:lastedEIR.embryoIssuanceRequest_id + 1, //có
                    management_unit_id: req.body.management_unit_id, //có
                    diploma_name_id: req.body.diploma_name_id, //có
                    examination: req.body.examination, // có
                    numberOfEmbryos: req.body.numberOfEmbryos, //có
                    seri_number_start: 1,
                    seri_number_end: req.body.numberOfEmbryos,
                    mscb: req.body.mscb,
                    time: `${year}-${month}-${day}`
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }                 
        }catch(error){
            return res.status(500).json(error);
        }
    }

}

module.exports = embryoIssuanceRequestController;
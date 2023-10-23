const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");

const embryoIssuanceRequestController = {
    getAllembryoIssuanceRequest: async (req, res) => {
        try{
            return res.status(200).json("Trả về all yêu cầu cấp phôi")
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
            
            if(lastedEIRByDiplomaNameID!=null){
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id: lastedEIR.embryoIssuanceRequest_id + 1,
                    management_unit_id: req.body.management_unit_id,
                    diploma_name_id: req.body.diploma_name_id,
                    diploma_name_name: req.body.diploma_name_name,
                    examination: req.body.examination,
                    numberOfEmbryos: req.body.numberOfEmbryos,
                    seri_number_start: lastedEIRByDiplomaNameID.seri_number_end+1,
                    seri_number_end: parseInt(lastedEIRByDiplomaNameID.seri_number_end)+parseInt(req.body.numberOfEmbryos) 
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }else{
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id: lastedEIR.embryoIssuanceRequest_id + 1,
                    management_unit_id: req.body.management_unit_id,
                    diploma_name_id: req.body.diploma_name_id,
                    diploma_name_name: req.body.diploma_name_name,
                    examination: req.body.examination,
                    numberOfEmbryos: req.body.numberOfEmbryos,
                    seri_number_start: 1,
                    seri_number_end: req.body.numberOfEmbryos
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }     
            // return res.status(200).json(lastedEIRByDiplomaNameID);
            
        }catch(error){
            return res.status(500).json(error);
        }
    }

}

module.exports = embryoIssuanceRequestController;
const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");
const DSHVModel = require("../models/DSHV");
const embryoIssuanceRequestController = {
    //Hàm này dùng để lấy yc cấp phôi theo từng diploma_name_id, dùng cho tài khoản có chức vụ: Giám đốc Trung tâm/Trưởng phòng, vì các loại văn bằng có thể thay đổi đơn vị quản lý nên cần lấy theo loại văn bằng, đơn vị nào quản lý loại văn bằng nào thì lấy theo loại đó
    getAllembryoIssuanceRequestByListDiplomaNameId: async (req, res) => {
        try{
            const result = await EmbryoIssuanceRequestModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});            
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

            if(lastedEIR == null){
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id: 1,
                    management_unit_id: req.body.management_unit_id, //có
                    diploma_name_id: req.body.diploma_name_id, //có
                    examination: req.body.examination, //có
                    numberOfEmbryos: req.body.numberOfEmbryos, //có
                    mscb: req.body.mscb, //có
                    time: `${year}-${month}-${day}`
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }else{
                const newEIR = new EmbryoIssuanceRequestModel({
                    embryoIssuanceRequest_id: lastedEIR.embryoIssuanceRequest_id + 1, //
                    management_unit_id: req.body.management_unit_id, //có
                    diploma_name_id: req.body.diploma_name_id, //có
                    examination: req.body.examination, //có
                    numberOfEmbryos: req.body.numberOfEmbryos, //có
                    mscb: req.body.mscb, //có
                    time: `${year}-${month}-${day}`
                });
                const EIRSaved = await newEIR.save();
                return res.status(200).json(EIRSaved);
            }                
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm lấy ra tất cả yêu cầu xin cấp phôi trong DB
    getAllembryoIssuanceRequest: async (req, res) => {
        try{
            const result = await EmbryoIssuanceRequestModel.find();
            return res.status(200).json(result);            
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm cập nhật trạng thái và comment hoặc embryo_receipt_diary cho yêu cầu xin cấp phôi
    updateStatusEmbryoIssuanceRequest: async (req, res) => {
        try{
            //_id của yêu cầu cấp phôi sẽ được cập nhật status
            const _id = req.params._id;

            const options = {returnDocument: "after"};
            const updateDoc = req.body;
            const resultUpdate = await EmbryoIssuanceRequestModel.findByIdAndUpdate(_id, updateDoc, options);
            return res.status(200).json(resultUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Xóa yccp
    deleteYCCP: async (req, res) => {
        try{
            //Step 1: Xóa yccp theo _id
            const deleteYCCP = await EmbryoIssuanceRequestModel.findByIdAndDelete(req.params._id);

            //Step 2: Xóa các học viên trong collection dshv
            const deleteDSHV = await DSHVModel.deleteMany({embryoIssuanceRequest_id: parseInt(req.params.embryoIssuanceRequest_id)});

            return res.status(200).json("Xóa thành công");

        }catch(error){  
            return res.status(500).json(error);
        }
    }
}

module.exports = embryoIssuanceRequestController;
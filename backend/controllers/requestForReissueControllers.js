const RequestForReissueModel = require("../models/RequestForReissue");

const requestForReissueControllers = {
    createRequestForReissue: async (req, res) =>{
        try{
            //Lấy yc xin cấp lại phôi cuối cùng để lấy id
            const lastedRequestForReissue = await RequestForReissueModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

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

            const newRequestForReissue = new RequestForReissueModel({
                requestForReissue_id: lastedRequestForReissue.requestForReissue_id + 1,
                management_unit_id: req.body.management_unit_id,
                diploma_name_id: req.body.diploma_name_id,
                numberOfEmbryos: req.body.numberOfEmbryos,
                mscb_create: req.body.mscb_create,
                time_create: `${year}-${month}-${day}`,
                reason: req.body.reason,
                seri_number_start: req.body.seri_number_start,
                seri_number_end: req.body.seri_number_end
            });

            const savedRequestForReissue = await newRequestForReissue.save();
            return res.status(200).json(savedRequestForReissue);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm lấy các yc cấp lại phôi theo loại văn bằng, mã phiếu, trạng thái. Vì các loại văn bằng có thể đổi đơn vị quản lý, đơn vị quản lý quản lý loại vb nào thì lấy của loại đó ra.
    getRequestForReissueByDiplomaName: async(req, res) => {
        try{
            const requestForReissue_id = req.query.requestForReissue_id;
            let result;
            if(requestForReissue_id == ""){
                result = await RequestForReissueModel.find({
                                                            diploma_name_id: parseInt(req.params.diploma_name_id),
                                                            status: { $regex: `${req.query.status}`, $options: 'i'}
                                                        });
            }else{
                result = await RequestForReissueModel.find({
                                                            diploma_name_id: parseInt(req.params.diploma_name_id),
                                                            requestForReissue_id: parseInt(req.query.requestForReissue_id),
                                                            status: { $regex: `${req.query.status}`, $options: 'i'}
                                                        });
            }
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },

    //Hàm lấy all yc cấp lại phôi theo mã phiếu, trạng thái
    getRequestForReissueByID_Status: async (req, res) => {
        try{
            const requestForReissue_id = req.query.requestForReissue_id;
            let result;
            if(requestForReissue_id == ""){
                result = await RequestForReissueModel.find({
                                                            status: { $regex: `${req.query.status}`, $options: 'i'}
                                                        });
            }else{
                result = await RequestForReissueModel.find({
                                                            requestForReissue_id: parseInt(requestForReissue_id),
                                                            status: { $regex: `${req.query.status}`, $options: 'i'}
                                                        });
            }
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm cập nhật request reissue theo req.body
    updateRequestReissueByReqBody: async (req,res) => {
        try{
            const _id = req.params._id;
            const options = {returnDocument: "after"};
            const updateDoc = req.body;
            const resultUpdate = await RequestForReissueModel.findByIdAndUpdate(_id, updateDoc, options);
            return res.status(200).json(resultUpdate)
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = requestForReissueControllers;
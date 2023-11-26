const EmbryoIssuanceRequestModel = require("../models/EmbryoIssuanceRequest");
const RequestForReissueModel = require("../models/RequestForReissue");
const ManagementUnitModel = require("../models/ManagementUnit");
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
    },
    //Thống kê các yêu cầu xin cấp mới phôi được tạo theo tháng trong 1 năm (đã chạy đúng)
    statisticalRequestIssuanceByMonth: async(req, res) => {
        try{
            const yearStatistical = parseInt(req.query.year);
            //Đầu tiên lấy all yêu cầu cấp mới phôi ra
            const allRequestIssuance = await EmbryoIssuanceRequestModel.find();

            //lọc của năm dc chọn ra
            let result = [];
            allRequestIssuance?.forEach((currentValue) => {
                const timeSplit = currentValue.time.split("-");
                if(parseInt(timeSplit[0]) == yearStatistical){
                    result =[... result, currentValue]
                }
            })
            
            let finalResultYC_Processed = [];
            for(let i = 1; i<=12; i++){
                let amount = 0;
                result.forEach((currentValue)=>{
                    const timeSplit = currentValue.time.split("-");
                    if(parseInt(timeSplit[1]) == i){
                        amount++;
                    }
                })
                finalResultYC_Processed = [...finalResultYC_Processed, amount];
            }
            return res.status(200).json(finalResultYC_Processed);

        }catch(error){  
            return res.status(500).json(error);
        }
    },
    //Thống kê các yêu cầu đã được xử lý theo tháng, và thống kê số phôi đã cấp theo tháng (đã đúng)
    statisticalYC_DC_XY_ByMonth: async (req, res) => {
        try{
            const yearStatistical = parseInt(req.query.year);

            let result = [];
            //Lấy tất cả yêu cầu cấp mới phôi có trạng thái là "Đã nhận phôi"
            const allRequestIssuanceProcessed = await EmbryoIssuanceRequestModel.find({status: 'Đã nhận phôi'});
            //Lấy tất cả yêu cầu cấp lại có trạng thái là "Đã nhận phôi"
            const allRequestReissueProcessed = await RequestForReissueModel.find({status: 'Đã nhận phôi'});
            result = [...result, ...allRequestIssuanceProcessed, ...allRequestReissueProcessed];
    
            //Đầu tiên lọc theo năm ra trước
            let resultFilterByYear = [];

            result.forEach((currentValue)=>{
                const timeSplit = currentValue.time_diary_creator.split("-");
                if(parseInt(timeSplit[0]) == yearStatistical){
                    resultFilterByYear = [...resultFilterByYear, currentValue]
                }
            })
            
            let finalResultYC_Processed = [];//lưu mảng số yc đã được xử lý
            let finalResult_SoPhoi_DaCap = [];
            for(let i = 1; i<=12; i++){
                let amount = 0;
                let so_phoi_da_cap = 0;
                resultFilterByYear.forEach((currentValue)=>{
                    const timeSplit = currentValue.time_diary_creator.split("-");
                    if(parseInt(timeSplit[1]) == i){
                        amount++;
                        so_phoi_da_cap+=currentValue.numberOfEmbryos;
                    }
                })
                finalResultYC_Processed = [...finalResultYC_Processed, amount];
                finalResult_SoPhoi_DaCap = [...finalResult_SoPhoi_DaCap, so_phoi_da_cap];
            }
            
            return res.status(200).json({finalResultYC_Processed, finalResult_SoPhoi_DaCap});
        }catch(error){  
            return res.status(500).json(error);
        }
    },

    //Thống kê số yc cấp mới được tạo theo DVQL từ ngày nào đến ngày nào (đã chạy đúng)
    thongKeYcCapMoiTheoDVQL: async (req, res) => {
        try{
            const fromDate = new Date(req.query.from).getTime();
            const toDate = new Date(req.query.to).getTime();

            //Đầu tiên lấy all yêu cầu xin cấp phôi ra trước
            const allRequestIssuance = await EmbryoIssuanceRequestModel.find();
            //sau đó lấy ra all management unit trừ "Tổ ql vbcc ra"
            const allManagementUnit = await ManagementUnitModel.find();
            
            let managementUnitHandle = [];
            allManagementUnit?.forEach((currentValue)=>{
                if(currentValue.management_unit_id != 13){
                    managementUnitHandle = [...managementUnitHandle, currentValue];
                }
            })

            let finalResult = [];
            
            for(let i = 0; i<managementUnitHandle.length; i++){
                let amount = 0;
                allRequestIssuance.forEach((currentValue)=>{
                    let time_create = new Date(currentValue.time).getTime();
                    if(currentValue.management_unit_id == managementUnitHandle[i].management_unit_id && time_create>=fromDate && time_create<=toDate){
                        amount++;
                    }
                })
                finalResult = [...finalResult, amount];
            }
            return res.status(200).json(finalResult);            
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Thống kê số yêu cầu đã dc xl và số phôi đã cấp theo DVQL (đã chạy dúng)
    TK_Yc_Da_XL_SoPhoi_Da_Cap: async (req, res) => {
        try{
            const fromDate = new Date(req.query.from).getTime();
            const toDate = new Date(req.query.to).getTime();

            let allRequestHandle = [];
            //Lấy tất cả yêu cầu cấp mới phôi có trạng thái là "Đã nhận phôi"
            const allRequestIssuanceProcessed = await EmbryoIssuanceRequestModel.find({status: 'Đã nhận phôi'});
            //Lấy tất cả yêu cầu cấp lại có trạng thái là "Đã nhận phôi"
            const allRequestReissueProcessed = await RequestForReissueModel.find({status: 'Đã nhận phôi'});
            allRequestHandle = [...allRequestHandle, ...allRequestIssuanceProcessed, ...allRequestReissueProcessed];

            //sau đó lấy ra all management unit trừ "Tổ ql vbcc ra"
            const allManagementUnit = await ManagementUnitModel.find();
            
            let managementUnitHandle = [];
            allManagementUnit?.forEach((currentValue)=>{
                if(currentValue.management_unit_id != 13){
                    managementUnitHandle = [...managementUnitHandle, currentValue];
                }
            })

            let finalResultYC_Processed = [];//lưu mảng số yc đã được xử lý
            let finalResult_SoPhoi_DaCap = [];

            for(let i = 0; i<managementUnitHandle.length; i++){
                let amount = 0;
                let so_phoi_da_cap = 0;
                
                allRequestHandle.forEach((currentValue)=>{
                    let time_diary_creator = new Date(currentValue.time_diary_creator).getTime();
                    if(currentValue.management_unit_id == managementUnitHandle[i].management_unit_id && time_diary_creator>=fromDate && time_diary_creator<=toDate){
                        amount++;
                        so_phoi_da_cap+=currentValue.numberOfEmbryos;
                    }
                })
                finalResultYC_Processed = [...finalResultYC_Processed, amount];
                finalResult_SoPhoi_DaCap = [...finalResult_SoPhoi_DaCap, so_phoi_da_cap];
            }
            return res.status(200).json({finalResultYC_Processed, finalResult_SoPhoi_DaCap});
        }catch(error){
            return res.status(500).json(error);
        }
    }   
}

module.exports = embryoIssuanceRequestController;
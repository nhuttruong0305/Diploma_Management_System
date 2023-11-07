const DeliveryBillModel = require("../models/DeliveryBill");

const deliveryBillControllers = {
    createDeliveryBill: async (req, res) => {
        try{
            //Lấy phiếu xuất kho cuối cùng trong DB ra để lấy delivery_bill 
            const lastedDeliveryBill = await DeliveryBillModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

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

            const newDeliveryBill = new DeliveryBillModel({
                delivery_bill: lastedDeliveryBill.delivery_bill + 1,
                embryoIssuanceRequest_id: req.body.embryoIssuanceRequest_id,
                delivery_bill_creation_time: `${year}-${month}-${day}`,
                fullname_of_consignee: req.body.fullname_of_consignee,
                address_department: req.body.address_department,
                reason: req.body.reason,
                export_warehouse: req.body.export_warehouse,
                address_export_warehouse: req.body.address_export_warehouse,
                embryo_type: req.body.embryo_type,
                numberOfEmbryos: req.body.numberOfEmbryos,
                seri_number_start: req.body.seri_number_start,
                seri_number_end: req.body.seri_number_end,
                unit_price: req.body.unit_price,
                mscb: req.body.mscb
            })
            const deliverySaved = await newDeliveryBill.save();
            return res.status(200).json(deliverySaved);
            
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm lấy chi tiết phiếu xuất kho theo embryoIssuanceRequest_id
    getDetailDeliveryBill: async(req, res) => {
        try{
            const embryoIssuanceRequest_id = parseInt(req.params.embryoIssuanceRequest_id);
            const result = await DeliveryBillModel.find({embryoIssuanceRequest_id: embryoIssuanceRequest_id});
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = deliveryBillControllers;
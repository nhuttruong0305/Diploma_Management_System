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

            //Lấy phiếu xuất kho cuối cùng theo embryo_type để lấy số seri
            const lastedDeliveryBillByEmbryo_type = await DeliveryBillModel.findOne({embryo_type: req.body.embryo_type}, {}, { sort: { 'createdAt': -1 } });

            if(lastedDeliveryBillByEmbryo_type!=null){
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
                    seri_number_start: lastedDeliveryBillByEmbryo_type.seri_number_end + 1,
                    seri_number_end: lastedDeliveryBillByEmbryo_type.seri_number_end + req.body.numberOfEmbryos,
                    unit_price: req.body.unit_price,
                    mscb: req.body.mscb
                })
                const deliverySaved = await newDeliveryBill.save();
                return res.status(200).json(deliverySaved);
            }else{
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
                    seri_number_start: 1,
                    seri_number_end: req.body.numberOfEmbryos,
                    unit_price: req.body.unit_price,
                    mscb: req.body.mscb
                })
                const deliverySaved = await newDeliveryBill.save();
                return res.status(200).json(deliverySaved);
            }
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = deliveryBillControllers;
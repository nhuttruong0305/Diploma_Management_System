const router = require("express").Router();
const deliveryBillControllers = require("../controllers/deliveryBillControllers");

router.post("/create_delivery_bill", deliveryBillControllers.createDeliveryBill);
router.get("/get_detail_delivery_bill/:embryoIssuanceRequest_id", deliveryBillControllers.getDetailDeliveryBill);
module.exports = router;
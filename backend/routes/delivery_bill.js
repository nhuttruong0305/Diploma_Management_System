const router = require("express").Router();
const deliveryBillControllers = require("../controllers/deliveryBillControllers");

router.post("/create_delivery_bill", deliveryBillControllers.createDeliveryBill);

module.exports = router;
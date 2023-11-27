const router = require("express").Router();
const deliveryBillControllers = require("../controllers/deliveryBillControllers");

router.post("/create_delivery_bill", deliveryBillControllers.createDeliveryBill);
router.get("/get_detail_delivery_bill/:embryoIssuanceRequest_id", deliveryBillControllers.getDetailDeliveryBill);

//Lấy phiếu xuất kho cuối cùng của 1 loại phôi nào đó, hàm này nếu chưa có phiếu xuất kho nào của loại phôi đó thì trả về null
router.get("/get_lasted_delivery_bill_based_on_embryo_type/:embryo_type", deliveryBillControllers.getLastedDeliveryBillBasedOnembryo_type);

//Tạo phiếu xuất kho cho yc cấp lại phôi
router.post("/create_delivery_bill_for_request_reissue", deliveryBillControllers.createDeliveryBillForRequestReissue);

//Lấy chi tiết phiếu xuất kho của yc cấp lại phôi
router.get("/get_detail_delivery_bill_request_reissue/:requestForReissue_id", deliveryBillControllers.getDetailDeliveryBillRequestReissue);


//Hàm tìm phiếu xuất kho theo nhiều điều kiện
router.get("/tim_phieu_xk_theo_nhieu_dk", deliveryBillControllers.timPhieuXKTheoNhieuDK);
module.exports = router;
const router = require("express").Router();
const requestForReissueControllers = require("../controllers/requestForReissueControllers");

router.post("/create_request_for_reissue", requestForReissueControllers.createRequestForReissue);
router.get("/get_all_request_for_reissue_by_list_diploma_name_id/:diploma_name_id", requestForReissueControllers.getRequestForReissueByDiplomaName);

//Hàm lấy các yc cấp lại phôi theo mã phiếu, trạng thái
router.get("/get_all_request_for_reissue", requestForReissueControllers.getRequestForReissueByID_Status);

//Hàm cập nhật yêu cầu xin cấp lại phôi theo req.body
router.put("/update_request_reissue_by_req_body/:_id", requestForReissueControllers.updateRequestReissueByReqBody);
module.exports = router;
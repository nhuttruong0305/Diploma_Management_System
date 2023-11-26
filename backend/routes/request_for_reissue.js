const router = require("express").Router();
const requestForReissueControllers = require("../controllers/requestForReissueControllers");

router.post("/create_request_for_reissue", requestForReissueControllers.createRequestForReissue);
router.get("/get_all_request_for_reissue_by_list_diploma_name_id/:diploma_name_id", requestForReissueControllers.getRequestForReissueByDiplomaName);

//Hàm lấy các yc cấp lại phôi theo mã phiếu, trạng thái
router.get("/get_all_request_for_reissue", requestForReissueControllers.getRequestForReissueByID_Status);

//Hàm cập nhật yêu cầu xin cấp lại phôi theo req.body
router.put("/update_request_reissue_by_req_body/:_id", requestForReissueControllers.updateRequestReissueByReqBody);

//Hàm xóa yc cấp lại phôi nếu chưa duyệt
router.delete("/delete_request_reissue/:_id/:requestForReissue_id", requestForReissueControllers.deleteRequestReissue);
//Thống kê theo tháng các yêu cầu xin cấp lại phôi được tạo
router.get("/statistical_request_reissue_by_month", requestForReissueControllers.statisticalRequestReissueByMonth);

//Thống kê theo DVQL số yêu cầu cấp lại dc tạo trong 1 khoảng time
router.get("/thongke_so_yc_cap_lai_dc_tao_theo_dvql", requestForReissueControllers.thongKe_YC_caplai_dc_tao_theo_DVQL);
module.exports = router;
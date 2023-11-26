const router = require("express").Router();
const embryoIssuanceRequestController = require("../controllers/embryoIssuanceRequestControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_new_embryoIssuanceRequest", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, embryoIssuanceRequestController.addEmbryoIssuanceRequest);
router.get("/get_yccp_by_list_diploma_name_id/:diploma_name_id", embryoIssuanceRequestController.getAllembryoIssuanceRequestByListDiplomaNameId);
router.get("/get_all_yccp", embryoIssuanceRequestController.getAllembryoIssuanceRequest);
router.put("/update_status_yccp/:_id", embryoIssuanceRequestController.updateStatusEmbryoIssuanceRequest);
//Xóa yccp khi chưa dc duyệt
router.delete("/delete_yccp/:_id/:embryoIssuanceRequest_id", embryoIssuanceRequestController.deleteYCCP);

//Thống kê các yêu cầu xin cấp mới phôi được tạo theo tháng trong 1 năm
router.get("/statistical_request_issuance", embryoIssuanceRequestController.statisticalRequestIssuanceByMonth);
//Thống kê các yêu cầu đã được xử lý theo tháng, và thống kê số phôi đã cấp theo tháng
router.get("/statistical_yc_dc_xl_by_month", embryoIssuanceRequestController.statisticalYC_DC_XY_ByMonth);

//Thống kê số yêu cầu tạo mới theo DVQL từ ngày nào đến ngày nào
router.get("/thong_ke_so_yc_tao_moi_theo_dvql", embryoIssuanceRequestController.thongKeYcCapMoiTheoDVQL);

//Thống kê các yêu cầu đã dc xử lý theo DVQL, và thống kê số phôi đã cấp theo DVQL
router.get("/tk_yc_dc_xl_so_phoi_da_cap_theo_dvql", embryoIssuanceRequestController.TK_Yc_Da_XL_SoPhoi_Da_Cap);


//Tìm kiếm yêu cầu xin cấp phôi theo: trạng thái
router.get("/search_YCCP_theo_nhieu_dk", embryoIssuanceRequestController.searchYCCPTheoNhieuDK);

module.exports = router;
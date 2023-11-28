const router = require("express").Router();
const diplomaControllers = require("../controllers/diplomaControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_new_diploma", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.addNewDiploma);
router.get("/get_all_diploma_byMU/:management_unit_id", diplomaControllers.getAllDiplomaByMU);//routes này ko xài nữa
router.get("/search_diploma/:management_unit_id", diplomaControllers.searchDiplomaWithMultiCondition);
router.put("/edit_diploma/:_id/:diploma_name_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.editDiploma);
router.delete("/delete_diploma/:_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.deleteDiploma);
router.put("/review_diploma/:_id", middlewareController.verifyTokenAndDiplomaReviewer, diplomaControllers.reviewDiploma);
router.get("/search_diploma_for_diploma_diary", diplomaControllers.searchDiplomaForDiplomaDiary);
router.get("/search_diploma_tracuu", diplomaControllers.searchDiplomaTraCuu);//route này dùng cho trang chủ tra cứu với quyền người dùng != người dùng khách và student
router.get("/search_diploma_tracuu_for_student_and_client_user", diplomaControllers.searchDiplomaTraCuuForStudentAndClientUser);//route này dùng cho trang chủ tra cứu với loại tài khoản cán bộ

router.get("/get_all_diploma_by_diploma_name_id/:diploma_name_id", diplomaControllers.getAllDiplomaByDiplomaNameId);

router.get("/get_all_diploma_in_DB", diplomaControllers.getAllDiploma);

//Lấy số văn bằng được nhập, dc duyệt, ko duyệt theo tháng
router.get("/tk_vb_theo_thang", diplomaControllers.tk_vanbang_theo_thang);
//Lấy số văn bằng dc nhập, ddc duyệt, ko duyệt theo dvql
router.get("/tk_vb_theo_dvql", diplomaControllers.thongke_VB_theo_DVQL);

//Tìm kiếm tổng hợp văn bằng
router.get("/tkth_vb",diplomaControllers.TKTH_VB);
module.exports = router;

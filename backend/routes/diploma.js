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
module.exports = router;

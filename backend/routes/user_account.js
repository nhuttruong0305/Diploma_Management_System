const router = require("express").Router();
const userAccountControllers = require("../controllers/userAccountControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.get("/get_all_useraccount", userAccountControllers.getAllUserAccount);
router.get("/search_useraccount_byname", userAccountControllers.searchUserAccountByName);
router.get("/get_all_useraccount_import/:management_unit_id", userAccountControllers.getAllUserDiplomaImporterByMU);
router.get("/get_list_mscb_import_by_diploma_name_id/:diploma_name_id", userAccountControllers.getListOfMSCBDiplomaImporterByDiplomaNameID);
router.put("/add_diploma_name_id_into_user/:diploma_name_id/:_id_user", middlewareController.verifyTokenAndSystemAdministratorRole, userAccountControllers.addDiplomaNameIntoUser)
router.put("/delete_diploma_name_id_from_user/:diploma_name_id/:_id_user", middlewareController.verifyTokenAndSystemAdministratorRole, userAccountControllers.deleteDiplomaNameFromUser);
router.get("/get_all_useraccount_review/:management_unit_id", userAccountControllers.getAllUserDiplomaReviewerByMU);
router.get("/get_list_mscb_review_by_diploma_name_id/:diploma_name_id", userAccountControllers.getListOfMSCBDiplomaReviewerByDiplomaNameID);
router.put("/add_diploma_name_id_into_user_review/:diploma_name_id/:_id_user", middlewareController.verifyTokenAndSystemAdministratorRole, userAccountControllers.addDiplomaNameIntoUserReview);
router.put("/delete_diploma_name_id_from_user_review/:diploma_name_id/:_id_user", middlewareController.verifyTokenAndSystemAdministratorRole, userAccountControllers.deleteDiplomaNameFromUserReview);
router.put("/edit_user_account_info/:_id", userAccountControllers.editUserAccountInfo);
router.put("/change_password/:_id", userAccountControllers.changePassword);
//Lấy tất cả các tài khoản có chức vụ Tổ trưởng
router.get("/get_all_user_leader", userAccountControllers.getAllUserLeader);
router.put("/vo_hieu_hoa/:_id", userAccountControllers.voHieuHoaTaiKhoan);
module.exports = router;
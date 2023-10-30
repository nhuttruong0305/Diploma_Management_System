const router = require("express").Router();
const middlewareController = require("../controllers/middlewareControllers");
const DSHVController = require("../controllers/DSHVControllers");
router.post("/add_student", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, DSHVController.addStudent);
// router.get("/get_DSHV_by_diplomaNameId/:diploma_name_id", DSHVController.getDSHVByDiplomaNameID);
module.exports = router;
const router = require("express").Router();
const middlewareController = require("../controllers/middlewareControllers");
const DSHVController = require("../controllers/DSHVControllers");
router.post("/add_student", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, DSHVController.addStudent);
router.get("/get_DSHV/:embryoIssuanceRequest_id", DSHVController.getDSHV);
module.exports = router;
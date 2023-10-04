const router = require("express").Router();
const diplomaIssuanceController = require('../controllers/diplomaIssuanceControllers');
const middlewareController = require("../controllers/middlewareControllers"); 

router.get("/get_all_diploma_issuance/:management_unit_id", diplomaIssuanceController.getAllDiplomaIssuanceByMU);
router.post("/add_diploma_issuance", middlewareController.verifyTokenAndDiplomaImporter, diplomaIssuanceController.addDiplomaIssuanceByMU)

module.exports = router;
const router = require("express").Router();
const diplomaIssuanceController = require('../controllers/diplomaIssuanceControllers');
const middlewareController = require("../controllers/middlewareControllers"); 

router.get("/get_all_diploma_issuance/:management_unit_id", diplomaIssuanceController.getAllDiplomaIssuanceByMU);
router.post("/add_diploma_issuance", middlewareController.verifyTokenAndDiplomaImporter, diplomaIssuanceController.addDiplomaIssuanceByMU)
router.put("/edit_diploma_issuance/:_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaIssuanceController.editDiplomaIssuanceByMU);
router.delete("/delete_diploma_issuance/:_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaIssuanceController.deleteDiplomaIssuance);

router.get("/lay_all_dcvb", diplomaIssuanceController.getAll_dcvb);
module.exports = router;
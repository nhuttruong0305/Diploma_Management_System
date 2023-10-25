const router = require("express").Router();
const diplomaNameControllers = require("../controllers/diploma_nameControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_diploma_name", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.addDiplomaName);
router.get("/get_all_diploma_name", diplomaNameControllers.getAllDiplomaName);
router.put("/edit_diploma_name/:diploma_name_id", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.editDiplomaName)
router.get("/search_diplomaName/bykeyword", diplomaNameControllers.searchDiplomaName);
router.put("/decentralization/:diploma_name_id", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.decentralizationDiplomaName);
router.put("/transfer/:diploma_name_id/:diploma_name_id_to_delete_list", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.transferDiplomaName);
router.get("/search_diplomaNameForDNMH", diplomaNameControllers.searchDiplomaNameForDNMH);
router.get("/get_all_diplomaNameByMU/:management_unit_id", diplomaNameControllers.getAllDiplomaNameByMU);
router.delete("/delete_diploma_name/:diploma_name_id", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.deleteDiplomaName);
module.exports = router;
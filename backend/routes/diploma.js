const router = require("express").Router();
const diplomaControllers = require("../controllers/diplomaControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_new_diploma", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.addNewDiploma);
router.get("/get_all_diploma_byMU/:management_unit_id", diplomaControllers.getAllDiplomaByMU);
router.get("/search_diploma/:management_unit_id", diplomaControllers.searchDiplomaWithMultiCondition);
router.put("/edit_diploma/:_id/:diploma_name_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.editDiploma);
router.delete("/delete_diploma/:_id", middlewareController.verifyTokenAndDiplomaImporter, diplomaControllers.deleteDiploma);
module.exports = router;

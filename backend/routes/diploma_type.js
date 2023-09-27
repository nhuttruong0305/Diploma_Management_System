const router = require("express").Router();
const diplomaTypeControllers = require("../controllers/diploma_typeControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.get("/get_all_diploma_type", diplomaTypeControllers.getAllDiplomaType);
router.post("/add_diploma_type", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaTypeControllers.addDiplomaType);
router.put("/edit_diploma_type/:id", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaTypeControllers.editDiplomaType);

module.exports = router;
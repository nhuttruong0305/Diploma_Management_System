const router = require("express").Router();
const diplomaTypeControllers = require("../controllers/diploma_typeControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.get("/get_all_diploma_type", diplomaTypeControllers.getAllDiplomaType);
router.post("/add_diploma_type", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaTypeControllers.addDiplomaType);

module.exports = router;
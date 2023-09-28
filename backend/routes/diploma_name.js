const router = require("express").Router();
const diplomaNameControllers = require("../controllers/diploma_nameControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_diploma_name", middlewareController.verifyTokenAndSystemAdministratorRole, diplomaNameControllers.addDiplomaName);
router.get("/get_all_diploma_name", diplomaNameControllers.getAllDiplomaName);
module.exports = router;
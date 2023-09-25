const router = require("express").Router();
const authControllers = require('../controllers/authControllers');
const middlewareController = require("../controllers/middlewareControllers");

router.post("/register",middlewareController.verifyTokenAndSystemAdministratorRole , authControllers.registerUserAccount); //done
router.post("/login", authControllers.loginUserAccount);

module.exports = router;
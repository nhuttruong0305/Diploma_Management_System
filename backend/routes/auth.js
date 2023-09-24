const router = require("express").Router();
const authControllers = require('../controllers/authControllers');

router.post("/register", authControllers.registerUserAccount); //done
router.post("/login", authControllers.loginUserAccount);

module.exports = router;
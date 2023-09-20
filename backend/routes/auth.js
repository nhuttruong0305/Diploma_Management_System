const router = require("express").Router();
const authControllers = require('../controllers/authControllers');

router.post("/register", authControllers.registerUserAccount); //done

module.exports = router;
const router = require("express").Router();
const sendEmailController = require("../controllers/sendEmail");

router.post("/sendEmail", sendEmailController.sendEmail);

module.exports = router;
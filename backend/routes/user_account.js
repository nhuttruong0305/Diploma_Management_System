const router = require("express").Router();
const userAccountControllers = require("../controllers/userAccountControllers");

router.get("/get_all_useraccount", userAccountControllers.getAllUserAccount);

module.exports = router;
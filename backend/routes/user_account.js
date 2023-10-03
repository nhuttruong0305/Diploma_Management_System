const router = require("express").Router();
const userAccountControllers = require("../controllers/userAccountControllers");

router.get("/get_all_useraccount", userAccountControllers.getAllUserAccount);
router.get("/search_useraccount_byname", userAccountControllers.searchUserAccountByName);

module.exports = router;
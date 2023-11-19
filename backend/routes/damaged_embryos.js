const router = require("express").Router();
const damagedEmbryosControllers = require("../controllers/damagedEmbryosControllers");

router.post("/create_new_damaged_embryos", damagedEmbryosControllers.createNewDamagedEmbryos);

module.exports = router;
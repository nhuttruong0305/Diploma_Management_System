const router = require("express").Router();
const managementUnitControllers = require("../controllers/management_unitControllers");

router.post("/add_management_unit", managementUnitControllers.addManagementUnit); //done
router.get("/get_all_management_unit", managementUnitControllers.getAllManagementUnit); //done

module.exports = router;
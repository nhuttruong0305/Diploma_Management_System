const router = require("express").Router();
const embryoIssuanceRequestController = require("../controllers/embryoIssuanceRequestControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.get("/get_all_embryoIssuanceRequest", embryoIssuanceRequestController.getAllembryoIssuanceRequest)
router.post("/add_new_embryoIssuanceRequest", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, embryoIssuanceRequestController.addEmbryoIssuanceRequest);

module.exports = router;
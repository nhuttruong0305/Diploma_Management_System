const router = require("express").Router();
const embryoIssuanceRequestController = require("../controllers/embryoIssuanceRequestControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_new_embryoIssuanceRequest", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, embryoIssuanceRequestController.addEmbryoIssuanceRequest);
router.get("/get_yccp_by_list_diploma_name_id/:diploma_name_id", embryoIssuanceRequestController.getAllembryoIssuanceRequestByListDiplomaNameId);
module.exports = router;
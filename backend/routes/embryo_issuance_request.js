const router = require("express").Router();
const embryoIssuanceRequestController = require("../controllers/embryoIssuanceRequestControllers");
const middlewareController = require("../controllers/middlewareControllers");

router.post("/add_new_embryoIssuanceRequest", middlewareController.verifyTokenAndCenterDirectorHeadofDepartment, embryoIssuanceRequestController.addEmbryoIssuanceRequest);
router.get("/get_yccp_by_list_diploma_name_id/:diploma_name_id", embryoIssuanceRequestController.getAllembryoIssuanceRequestByListDiplomaNameId);
router.get("/get_all_yccp", embryoIssuanceRequestController.getAllembryoIssuanceRequest);
router.put("/update_status_yccp/:_id", embryoIssuanceRequestController.updateStatusEmbryoIssuanceRequest);
module.exports = router;
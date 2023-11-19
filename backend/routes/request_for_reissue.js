const router = require("express").Router();
const requestForReissueControllers = require("../controllers/requestForReissueControllers");

router.post("/create_request_for_reissue", requestForReissueControllers.createRequestForReissue);
router.get("/get_all_request_for_reissue_by_list_diploma_name_id/:diploma_name_id", requestForReissueControllers.getRequestForReissueByDiplomaName);

module.exports = router;
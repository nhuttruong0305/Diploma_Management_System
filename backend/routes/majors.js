const router = require("express").Router();
const majorsControllers = require("../controllers/majorsControllers");

router.post("/add_majors", majorsControllers.addMajors); //done
router.get("/get_majors/:faculty_id", majorsControllers.getMajors); //done

module.exports = router;
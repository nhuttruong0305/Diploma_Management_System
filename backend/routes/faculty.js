const router = require("express").Router();
const facultyControllers = require("../controllers/facultyControllers") ;

router.post("/add_faculty", facultyControllers.addFaculty); //done
router.get("/get_all_faculty", facultyControllers.getAllFaculty); //done

module.exports = router;
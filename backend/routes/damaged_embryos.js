const router = require("express").Router();
const damagedEmbryosControllers = require("../controllers/damagedEmbryosControllers");

router.post("/create_new_damaged_embryos", damagedEmbryosControllers.createNewDamagedEmbryos);
//Hàm lấy ra các số seri bị hư của 1 loại phôi (loại văn bằng)
router.get("/get_the_damaged_serial_number/:diploma_name_id", damagedEmbryosControllers.GetTheDamagedSerialNumber);
module.exports = router;
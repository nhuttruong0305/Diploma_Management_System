const router = require("express").Router();
const damagedEmbryosControllers = require("../controllers/damagedEmbryosControllers");

router.post("/create_new_damaged_embryos", damagedEmbryosControllers.createNewDamagedEmbryos);
//Hàm lấy ra các số seri bị hư của 1 loại phôi (loại văn bằng)
router.get("/get_the_damaged_serial_number/:diploma_name_id", damagedEmbryosControllers.GetTheDamagedSerialNumber);

//Hàm lấy danh sách số seri hư theo tên văn bằng
router.get("/get_all_damaged_serial_number_for_managed", damagedEmbryosControllers.GetTheDamagedSerialNumberForManaged);
router.post("/add_list_seri_number_damaged", damagedEmbryosControllers.addListSeriNumberDamaged);
router.delete("/delete_seri_damaged/:_id", damagedEmbryosControllers.deleteSeriDamaged);
module.exports = router;
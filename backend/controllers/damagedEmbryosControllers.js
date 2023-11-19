const DamagedEmbryosModel = require("../models/DamagedEmbryos");

const damagedEmbryosControllers = {
    createNewDamagedEmbryos: async (req, res) => {
        try{
            //Lấy yc xin cấp lại phôi cuối cùng để lấy id
            const lastedDamagedEmbryos = await DamagedEmbryosModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

            //Lấy ngày hiện tại để điền time tạo yêu cầu
            const today = new Date();
            let day = today.getDate();
            let month = today.getMonth() + 1;
            const year = today.getFullYear();

            if(day<10){
                day = `0${day}`;
            }

            if(month<10){
                month = `0${month}`;
            }

            const newDamagedEmbryos = new DamagedEmbryosModel({
                damagedEmbryos_id: lastedDamagedEmbryos.damagedEmbryos_id + 1,
                diploma_name_id: req.body.diploma_name_id,
                numberOfEmbryos: req.body.numberOfEmbryos,
                seri_number_start: req.body.seri_number_start,
                seri_number_end: req.body.seri_number_end,
                reason: req.body.reason,
                time_create: `${year}-${month}-${day}`,
                mscb_create: req.body.mscb_create
            })
            const saved = await newDamagedEmbryos.save();
            return res.status(200).json(saved);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = damagedEmbryosControllers;
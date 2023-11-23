const DamagedEmbryosModel = require("../models/DamagedEmbryos");
const RequestForReissueModel = require("../models/RequestForReissue");
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

            //Lấy yêu cầu xin cấp lại phôi mới nhất vừa dc tạo để lấy làm id cho trường requestForReissue_id
            const lastedRequestReissue = await RequestForReissueModel.findOne({}, {}, { sort: { 'createdAt': -1 } });

            if(lastedDamagedEmbryos == null){
                const newDamagedEmbryos = new DamagedEmbryosModel({
                    damagedEmbryos_id: 1,
                    requestForReissue_id: lastedRequestReissue.requestForReissue_id,
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
            }else{
                const newDamagedEmbryos = new DamagedEmbryosModel({
                    damagedEmbryos_id: lastedDamagedEmbryos.damagedEmbryos_id + 1,
                    requestForReissue_id: lastedRequestReissue.requestForReissue_id,
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
            }
        }catch(error){
            return res.status(500).json(error);
        }
    },
    GetTheDamagedSerialNumber: async(req, res) => {
        try{
            const diploma_name_id = parseInt(req.params.diploma_name_id);
            const damagedList = await DamagedEmbryosModel.find({diploma_name_id: diploma_name_id});
            
            let finalResult = [];
            for(let i = 0; i < damagedList.length; i++){
                for(let j = 0; j < damagedList[i].seri_number_start.length; j++){
                    let index =  damagedList[i].seri_number_start[j];
                    do{
                        if(!finalResult.includes(index)){
                            finalResult = [...finalResult, index];
                        }
                        index++;
                    }while(index <= damagedList[i].seri_number_end[j])

                }
            }
            
            console.log(finalResult.length);
            return res.status(200).json(finalResult);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = damagedEmbryosControllers;
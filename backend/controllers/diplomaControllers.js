const DiplomaModel = require("../models/Diploma");
const ManagementUnitModel = require("../models/ManagementUnit");
const diplomaControllers = {
    addNewDiploma: async (req, res) => {
        try{
            //Đầu tiên lấy ra danh sách các văn bằng của loại văn bằng được thêm để kiểm tra xem số hiệu và số vào sổ có trùng lặp không
            const listDiplomaByDiplomaNameID = await DiplomaModel.find({diploma_name_id: req.body.diploma_name_id});
            //Chạy qua vòng lặp của listDiplomaByDiplomaNameID để kiểm tra xem số hiệu có bị trùng không
            let isExist = false;
            listDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == req.body.diploma_number){
                    isExist = true;
                }
            });
            if(isExist){
                return res.status(400).json("Số hiệu văn bằng đã tồn tại");
            }

            //Tiếp theo kiểm tra xem số vào sổ văn bằng có bị trùng không
            let isExist2 = false;
            listDiplomaByDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.numbersIntoTheNotebook == req.body.numbersIntoTheNotebook){
                    isExist2 = true;
                }
            })
            if(isExist2){
                return res.status(400).json("Số vào sổ văn bằng đã tồn tại");
            }
            
            //Cuối cùng check xem có trùng CCCD không
            // let isExist3 = false;
            // listDiplomaByDiplomaNameID.forEach((currentValue)=>{
            //     if(currentValue.cccd == req.body.cccdAdd){
            //         isExist3 = true;
            //     }
            // })
            // if(isExist3){
            //     return res.status(400).json("Số CCCD đã tồn tại");
            // }

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

            //Lấy văn bằng cuối cùng trong DB ra để lấy diploma_id + 1 làm id cho diploma tiếp theo
            const lastedDiploma = await DiplomaModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
            const newDiploma = new DiplomaModel({
                diploma_id: lastedDiploma.diploma_id + 1, //(1)
                management_unit_id: req.body.management_unit_id, //(2)
                diploma_name_id: req.body.diploma_name_id, //(3)
                diploma_issuance_id: req.body.diploma_issuance_id, //(4)
                fullname: req.body.fullname, //(5)  có
                sex: req.body.sex, //(6) có
                dateofbirth: req.body.dateofbirth, //(7) có
                address: req.body.address, //(8) có
                cccd: req.body.cccdAdd, //(9) có
                sign_day: req.body.sign_day, //(10) có
                diploma_number: req.body.diploma_number, //(11) có
                numbersIntoTheNotebook:req.body.numbersIntoTheNotebook, //(12) có

                diem_tn: req.body.diemTNAdd, //(13) có
                diem_th: req.body.diemTHAdd, //14 có
                nghe: req.body.ngheAdd,//15 
                noi: req.body.noiAdd,//16 
                doc: req.body.docAdd,//17 
                viet: req.body.vietAdd,//18 
                test_day: req.body.test_day,//19 
                graduationYear: req.body.graduationYear,//20 
                classification: req.body.classification,//21 

                nganh_dao_tao: req.body.majorAdd,//22 
                council: req.body.council,//23 
                
                mscb_import: req.body.mscb_import,
                officer_name_import: req.body.officer_name_import,
                time_import: `${year}-${month}-${day}`
            })

            const diplomaSaved = await newDiploma.save();
            return res.status(200).json(diplomaSaved);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm này lấy ra all diploma của 1 đơn vị quản lý của tài khoản (HÀM NÀY KHÔNG XÀI NỮA)
    getAllDiplomaByMU: async (req, res) => {
        try{
            const result = await DiplomaModel.find({management_unit_id: parseInt(req.params.management_unit_id)});
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    //Hàm search lấy ra các diploma của 1 đơn vị quản lý của tài khoản
    searchDiplomaWithMultiCondition: async (req, res) => {
        try{
            const name = req.query.name;
            const diplomaNumber = req.query.diplomaNumber;
            const numbersIntoTheNotebook = req.query.numbersIntoTheNotebook;
            const status = req.query.status;
            const result = await DiplomaModel.find({
                                                    // management_unit_id: parseInt(req.params.management_unit_id), 
                                                    fullname:{ $regex: `${name}`, $options: 'i'},
                                                    diploma_number: { $regex: `${diplomaNumber}`, $options: 'i'},
                                                    numbersIntoTheNotebook: { $regex: `${numbersIntoTheNotebook}`, $options: 'i'},
                                                    status: { $regex: `${status}`, $options: 'i'}
            });
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    editDiploma: async (req, res) => {
        try{
            //Đầu tiên lấy các văn bằng có cùng loại văn bằng ra trước
            const diplomasOfTheSameDiplomaNameID1 = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});  
            
            let diplomasOfTheSameDiplomaNameID = [];
            diplomasOfTheSameDiplomaNameID1.forEach((currentValue)=>{
                if(currentValue._id != req.params._id){
                    diplomasOfTheSameDiplomaNameID = [...diplomasOfTheSameDiplomaNameID, currentValue];
                }
            })
            //Biến kiểm tra trùng số hiệu văn bằng
            let isExistDiplomaNumber = false;
            //Biến kiểm tra trùng số vào sổ văn bằng
            let isExistNumberNoteBook = false;
            //Biến kiểm tra trùng số CCCD của người được cấp
            // let isExistCCCD = false;
            
            diplomasOfTheSameDiplomaNameID.forEach((currentValue)=>{
                if(currentValue.diploma_number == req.body.diploma_number){
                    isExistDiplomaNumber = true;
                }
                if(currentValue.numbersIntoTheNotebook == req.body.numbersIntoTheNotebook){
                    isExistNumberNoteBook = true;
                }
                // if(currentValue.cccd == req.body.cccd){
                //     isExistCCCD = true;
                // }
            })
            if(isExistDiplomaNumber){
                return res.status(400).json("Số hiệu của văn bằng đã tồn tại");
            }
            if(isExistNumberNoteBook){
                return res.status(400).json("Số vào sổ của văn bằng đã tồn tại");
            }
            // if(isExistCCCD){
            //     return res.status(400).json("Số CCCD đã tồn tại");
            // }

            const options = {returnDocument: "after"};
            const updateDoc = req.body;

            const diplomaUpdate = await DiplomaModel.findByIdAndUpdate(req.params._id, updateDoc, options);

            return res.status(200).json(diplomaUpdate);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    deleteDiploma: async (req, res) => {
        try{
            const deleteDiploma = await DiplomaModel.findByIdAndDelete(req.params._id);
            return res.status(200).json(deleteDiploma);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    reviewDiploma: async (req,res) => {
        try{
            const options = {returnDocument: "after"};
            const updateDoc = {
                status: req.body.status, 
                mscb: req.body.mscb,
                officer_name: req.body.officer_name,
                time: req.body.time,
                explain: req.body.explain
            }

            const diplomaUpdate = await DiplomaModel.findByIdAndUpdate(req.params._id, updateDoc, options);
            return res.status(200).json(diplomaUpdate);            
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaForDiplomaDiary: async (req, res) => {
        try{
            const officer_name = req.query.officer_name ;
            const mscb = req.query.mscb;
            const status = req.query.status; 

            const result = await DiplomaModel.find({
                officer_name: { $regex: `${officer_name}`, $options: 'i'},
                mscb: { $regex: `${mscb}`, $options: 'i'},
                status: { $regex: `${status}`, $options: 'i'}
                // status: status
            });
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaTraCuu: async(req, res) => { //controller này dùng cho trang chủ tra cứu với quyền người dùng != người dùng khách và student
        try{
            const diploma_name_id = parseInt(req.query.diploma_name_id);
            const fullname = req.query.fullname;
            const diploma_number = req.query.diploma_number;
            const number_in_note = req.query.number_in_note;

            const result = await DiplomaModel.find({
                diploma_name_id: diploma_name_id,
                fullname: { $regex: `${fullname}`, $options: 'i'},
                diploma_number: { $regex: `${diploma_number}`, $options: 'i'},
                numbersIntoTheNotebook: { $regex: `${number_in_note}`, $options: 'i'},
                status: "Đã duyệt"
            });

            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },
    searchDiplomaTraCuuForStudentAndClientUser: async (req, res) => { //controller này dùng cho trang chủ tra cứu với loại tài khoản student và người dùng khách
        try{
            const diploma_name_id = parseInt(req.query.diploma_name_id);
            const fullname = req.query.fullname;
            const diploma_number = req.query.diploma_number;
            const number_in_note = req.query.number_in_note;

            const result = await DiplomaModel.find({
                diploma_name_id: diploma_name_id,
                fullname: { $regex: `${fullname}`, $options: 'i'},
                diploma_number: diploma_number,
                numbersIntoTheNotebook: number_in_note,
                status: "Đã duyệt"
            })

            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },


    getAllDiplomaByDiplomaNameId: async (req,res) => {
        try{
            const result = await DiplomaModel.find({diploma_name_id: parseInt(req.params.diploma_name_id)});  
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },

    //Lấy tất cả diploma
    getAllDiploma: async (req, res) => {
        try{
            const result = await DiplomaModel.find();  
            return res.status(200).json(result);
        }catch(error){
            return res.status(500).json(error);
        }
    },

    //Thống kê số văn bằng dc nhập theo tháng (đã chạy đúng)
    tk_vanbang_theo_thang: async(req, res) => {
        try{
            const yearStatistical = parseInt(req.query.year);
            //Đầu tiên lấy ra all văn bằng trước
            const allDiploma = await DiplomaModel.find();

            //lọc của năm dc chọn ra
            //result1 dùng để lọc ra các vb dc nhập
            //result2 dùng để lọc ra các vb dc duyệt
            //result3 dùng để lọc ra các vb ko dc duyệt
            let result1 = [];
            let result2 = [];
            let result3 = [];
            allDiploma?.forEach((currentValue) => {
                //-----------
                const timeSplit1 = currentValue.time_import.split("-");
                if(parseInt(timeSplit1[0]) == yearStatistical){
                    result1 =[... result1, currentValue]
                }

                if(currentValue.status != "Chờ duyệt"){
                    const timeSplit2 = currentValue.time.split("-");
                    if(parseInt(timeSplit2[0]) == yearStatistical && currentValue.status == "Đã duyệt"){
                        result2 =[... result2, currentValue]
                    }

                    if(parseInt(timeSplit2[0]) == yearStatistical && currentValue.status == "Không duyệt"){
                        result3 =[... result3, currentValue]
                    }
                }
            })

            let finalResult1 = [];
            let finalResult2 = [];
            let finalResult3 = [];

            for(let i = 1; i<=12; i++){
                let amount1 = 0;
                let amount2 = 0;
                let amount3 = 0;

                result1.forEach((currentValue)=>{
                    const timeSplit1 = currentValue.time_import.split("-");
                    if(parseInt(timeSplit1[1]) == i){
                        amount1++;
                    }
                })
                finalResult1 = [...finalResult1, amount1];

                result2.forEach((currentValue)=>{
                    const timeSplit2 = currentValue.time.split("-");
                    if(parseInt(timeSplit2[1]) == i){
                        amount2++;
                    }
                })
                finalResult2 = [...finalResult2, amount2];

                result3.forEach((currentValue)=>{
                    const timeSplit3 = currentValue.time.split("-");
                    if(parseInt(timeSplit3[1]) == i){
                        amount3++;
                    }
                })
                finalResult3 = [...finalResult3, amount3];
            }

            return res.status(200).json({
                finalResult1,
                finalResult2,
                finalResult3
            });
        }catch(err){
            return res.status(500).json(err);
        }
    },
    //Thống kê văn bằng theo DVQL (đã chạy đúng)
    thongke_VB_theo_DVQL: async (req, res) => {
        try{
            const fromDate = new Date(req.query.from).getTime();
            const toDate = new Date(req.query.to).getTime();

            //Đầu tiên lấy all Diploma ra
            const allDiploma = await DiplomaModel.find({});

            //sau đó lấy ra all management unit trừ "Tổ ql vbcc ra"
            const allManagementUnit = await ManagementUnitModel.find();
            
            let managementUnitHandle = [];
            allManagementUnit?.forEach((currentValue)=>{
                if(currentValue.management_unit_id != 13){
                    managementUnitHandle = [...managementUnitHandle, currentValue];
                }
            })

            let resultHandle1 = [...allDiploma];
            let resultHandle2 = [];
            let resultHandle3 = [];

            allDiploma.forEach((currentValue)=>{
                if(currentValue.status == "Đã duyệt"){
                    resultHandle2 = [...resultHandle2, currentValue];
                }else if(currentValue.status == "Không duyệt"){
                    resultHandle3 = [...resultHandle3, currentValue];
                }
            })

            let finalResult1 = [];
            let finalResult2 = [];
            let finalResult3 = [];

            for(let i = 0; i<managementUnitHandle.length; i++){
                let amount1 = 0;
                let amount2 = 0;
                let amount3 = 0;
                
                resultHandle1.forEach((currentValue) => {
                    const time_import = new Date(currentValue.time_import).getTime();
                    if(time_import>=fromDate && time_import<=toDate && currentValue.management_unit_id == managementUnitHandle[i].management_unit_id){
                        amount1++;
                    }
                })
                finalResult1 = [...finalResult1, amount1];

                resultHandle2.forEach((currentValue) => {
                    const time = new Date(currentValue.time).getTime();
                    if(time>=fromDate && time<=toDate && currentValue.management_unit_id == managementUnitHandle[i].management_unit_id){
                        amount2++;
                    }
                })
                finalResult2 = [...finalResult2, amount2];

                resultHandle3.forEach((currentValue)=>{
                    const time = new Date(currentValue.time).getTime();
                    if(time>=fromDate && time<=toDate && currentValue.management_unit_id == managementUnitHandle[i].management_unit_id){
                        amount3++;
                    }
                })
                finalResult3 = [...finalResult3, amount3];
            }
            return res.status(200).json({finalResult1, finalResult2, finalResult3});
        }catch(err){
            return res.status(500).json(err);
        }
    }
    //Hàm tìm kiếm tổng hợp văn bằng (đã chạy đúng)
    ,TKTH_VB: async (req, res)=>{
        try{
            //đầu tiên lấy vb theo tên người nhận, trạng thái, số hiệu, số vào sổ trước
            const result1 = await DiplomaModel.find({
                fullname: { $regex: `${req.query.fullname}`, $options: 'i'},
                status: { $regex: `${req.query.status}`, $options: 'i'},
                diploma_number: { $regex: `${req.query.diploma_number}`, $options: 'i'},
                numbersIntoTheNotebook: { $regex: `${req.query.numbersIntoTheNotebook}`, $options: 'i'}
            })

            //Tiếp theo lọc theo diploma_name
            let resultFilterDiplomaName = [];
            if(req.query.diploma_name_id != ""){
                const diploma_name_id = parseInt(req.query.diploma_name_id);
                result1.forEach((currentValue)=>{
                    if(currentValue.diploma_name_id == diploma_name_id){
                        resultFilterDiplomaName = [...resultFilterDiplomaName, currentValue];
                    }
                })
            }else{
                resultFilterDiplomaName = [...resultFilterDiplomaName, ...result1];
            }

            //Tiếp theo lọc theo DCVB
            let resultFilterIssuance = [];
            if(req.query.diploma_issuance_id != ""){
                const diploma_issuance_id = parseInt(req.query.diploma_issuance_id);
                resultFilterDiplomaName.forEach((currentValue) => {
                    if(currentValue.diploma_issuance_id == diploma_issuance_id){
                        resultFilterIssuance = [...resultFilterIssuance, currentValue];
                    }
                })
            }else{
                resultFilterIssuance = [...resultFilterIssuance, ...resultFilterDiplomaName];
            }

            //Tiếp theo lọc theo ngày tạo
            let finalResult = [];
            if(req.query.from != "" && req.query.to != ""){
                const fromDate = new Date(req.query.from).getTime();
                const toDate = new Date(req.query.to).getTime();

                resultFilterIssuance.forEach((currentValue)=>{
                    const time_create = new Date(currentValue.time_import).getTime()
                    if(time_create>=fromDate && time_create<=toDate){
                        finalResult = [...finalResult, currentValue];
                    }
                })

            }else{
                finalResult = [...finalResult, ...resultFilterIssuance];
            }

            return res.status(200).json(finalResult);
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = diplomaControllers;
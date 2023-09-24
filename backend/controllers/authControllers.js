const bcrypt = require("bcrypt");
const UserAccountModel = require("../models/User");
const jwt = require("jsonwebtoken");

const authControllers = {
    //Add user account
    registerUserAccount: async (req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Lấy tất cả user có trong DB lưu vào mảng để kiểm tra các điều kiện
            const allUsers = await UserAccountModel.find();
            let isFault;

            //Check xem MSSV_CB có trùng không
            allUsers.forEach((currentValue)=>{
                if(req.body.mssv_cb == currentValue.mssv_cb){
                    isFault = 1;
                }
            })

            //Check xem email có trùng không
            allUsers.forEach((currentValue)=>{
                if(req.body.email == currentValue.email){
                    isFault = 2;
                }
            })

            //Check xem CCCD có bị trùng không
            allUsers.forEach((currentValue)=>{
                if(req.body.cccd == currentValue.cccd){
                    isFault = 3;
                }
            })

            if(isFault == 1){
                return res.status(400).json("MSSV/CB đã tồn tại");
            }else if(isFault == 2){
                return res.status(400).json("Email đã tồn tại");                                    
            }else if(isFault == 3){
                return res.status(400).json("Số CCCD đã tồn tại");                                    
            }else{
                //Create new user
                const newUser = await new UserAccountModel({
                    fullname: req.body.fullname,
                    mssv_cb: req.body.mssv_cb,
                    email: req.body.email,
                    password: hashed,
                    dateofbirth: req.body.dateofbirth,
                    address: req.body.address,
                    cccd: req.body.cccd,
                    sex: req.body.sex,
                    phonenumber: req.body.phonenumber,
                    position: req.body.position,
                    class: req.body.class,
                    faculty: req.body.faculty,
                    majors: req.body.majors,
                    course: req.body.course,
                    management_unit: req.body.management_unit,
                    role: req.body.role
                });

                const userAccountSaved = await newUser.save();
                return res.status(200).json(userAccountSaved);
            }
        }catch(error){
            return res.status(500).json(error)
        }
    },
    //Login
    loginUserAccount: async (req, res) => {
        try{
            const user = await UserAccountModel.findOne({mssv_cb: req.body.mssv_cb});
            if(!user){
                return res.status(404).json("Sai MSSV/CB");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPassword){
                return res.status(404).json("Sai mật khẩu");
            }

            if(user && validPassword){
                const accessToken = jwt.sign(
                    {
                        mssv_cb: user.mssv_cb,
                        position: user.position,
                        role: user.role
                    },
                    process.env.JWT_ACCESS_KEY,
                    {expiresIn: "10d"}
                );
                
                const {password, ...others} = user._doc;
                return res.status(200).json({...others, accessToken});
            }
        }catch(error){
            return res.status(500).json(error);
        }
    }
}

module.exports = authControllers;
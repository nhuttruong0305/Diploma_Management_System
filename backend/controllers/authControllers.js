const bcrypt = require("bcrypt");
const UserAccountModel = require("../models/User");
const jwt = require("jsonwebtoken");

const authControllers = {
    registerUserAccount: async (req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create new user
            const newUser = await new UserAccountModel({
                fullname: req.body.fullname,
                mssv_cb: req.bdy.mssv_cb,
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
        }catch(error){
            return res.status(500).json(error)
        }
    }
}

module.exports = authControllers;
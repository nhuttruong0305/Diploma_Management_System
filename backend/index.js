const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const facultyRoute = require("./routes/faculty");
const majorsRoute = require("./routes/majors")
const managementUnitRoute = require("./routes/management_unit");
const userAccountRoute = require("./routes/user_account");
const diplomaTypeRoute = require("./routes/diploma_type");
const diplomaNameRoute = require('./routes/diploma_name');
const diolomaIssuance = require('./routes/diploma_issuance');
const diplomaRoute = require("./routes/diploma");

const app = express();

dotenv.config();

app.use(cors());//cors này để ngăn chặn CORS Origin
app.use(cookieParser());//để tạo và gắn cookie
app.use(express.json());//những request và response sẽ ở dạng json

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log("Kết nối thành công đến mongo");
    }).catch((error) => {
        console.log("Kết nối thất bại")
    })

//Routes
app.use("/v1/auth", authRoute); 
app.use("/v1/faculty", facultyRoute);   
app.use("/v1/majors", majorsRoute);
app.use("/v1/management_unit", managementUnitRoute);
app.use("/v1/user_account", userAccountRoute);
app.use("/v1/diploma_type", diplomaTypeRoute);
app.use("/v1/diploma_name", diplomaNameRoute);
app.use("/v1/diploma_issuance", diolomaIssuance);
app.use("/v1/diploma", diplomaRoute);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running...`);
})
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
const embryoIssuanceRequest = require("./routes/embryo_issuance_request");
const DSHVRoute = require("./routes/DSHV");
const deliveryBillRoute = require("./routes/delivery_bill");
const sendEmailRoute = require("./routes/sendEmail");
const requestForReissueRoute = require("./routes/request_for_reissue");
const damagedEmbryosRoute = require("./routes/damaged_embryos");

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
app.use("/v1/embryo_issuance_request", embryoIssuanceRequest);
app.use("/v1/DSHV", DSHVRoute);
app.use("/v1/delivery_bill", deliveryBillRoute);
app.use("/v1/send_email", sendEmailRoute);
app.use("/v1/request_for_reissue", requestForReissueRoute);
app.use("/v1/damaged_embryos",damagedEmbryosRoute);

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running...`);
})
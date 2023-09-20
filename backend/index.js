const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const facultyRoute = require("./routes/faculty");
const majorsRoute = require("./routes/majors")
const managementUnitRoute = require("./routes/management_unit");

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

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running...`);
})
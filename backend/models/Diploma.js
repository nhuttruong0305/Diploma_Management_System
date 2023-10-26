const mongoose = require("mongoose");

const diplomaSchema = new mongoose.Schema(
    {
        diploma_id: { //id để phân biệt giữa tất cả các văn bằng
            type: Number,
            required: true,
            unique: true
        },
        management_unit_id: {  //id của đơn vị quản lý
            type: Number,
            required: true
        },
        diploma_name_id:{ // id của tên văn bằng
            type: Number,
            required: true
        },
        diploma_issuance_id:{ // id của đợt cấp văn bằng
            type: Number,
            required: true
        },
        fullname: { // họ tên người được cấp
            type: String,
            required: true
        },
        sex: { //giới tính
            type: Boolean
        },
        dateofbirth: { //ngày sinh
            type: String,
        },
        address: { //nơi sinh
            type: String
        },
        cccd: {
            type: String
        },
        sign_day:{//ngày ký
            type: String
        },
        diploma_number:{//số hiệu
            type: String,
            required: true
        },
        numbersIntoTheNotebook:{//số vào sổ
            type: String,
            required: true
        },

        //Các thông tin ở dưới là thông tin thêm
        diem_tn: {
            type: Number,
            default: null
        },
        diem_th: {
            type: Number,
            default: null
        },
        nghe: {
            type: Number,
            default: null
        },
        noi: {
            type: Number,
            default: null
        },
        doc: {
            type: Number,
            default: null
        },
        viet: {
            type: Number,
            default: null
        },
        test_day:{ //ngày thi
            type: String,
            default: ""
        },
        graduationYear:{//năm tốt nghiệp
            type: Number,
            default: null
        },
        classification:{ //xếp loại
            type: String,
            default: ""
        },
        nganh_dao_tao:{ //Lưu ngành, dựa trên majors_id
            type: Number,
            default: null
        },
        council: { //Hội đồng thi
            type: String,
            default: ""
        },
        status:{ //trạng thái
            type: String,
            default: 'Chờ duyệt'
        },
        mscb:{//mã cán bộ duyệt văn bằng nếu văn bằng ở trạng thái duyệt hoặc không duyệt thì phải thêm ai là người xử lý
            type: String,
            default: ""
        },
        officer_name: {//tên cán bộ duyệt văn bằng nếu văn bằng ở trạng thái duyệt hoặc không duyệt thì phải thêm ai là người xử lý
            type: String,
            default: ""
        },
        time: { //thời điểm duyệt hoặc không duyệt văn bằng
            type: String,
            default: ""
        },
        explain: { //diễn giải
            type: String,
            default: ""
        },
        //Các trường bên dưới lưu thông tin người nhập
        mscb_import: {
            type: String,
            default: ""
        },
        officer_name_import: {
            type: String,
            default: ""
        },
        time_import: {
            type: String,
            default: ""
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Diploma", diplomaSchema);
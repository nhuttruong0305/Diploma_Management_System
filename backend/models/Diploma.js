const mongoose = require("mongoose");

const diplomaSchema = new mongoose.Schema(
    {
        diploma_id: { //id để phân biệt giữa tất cả các văn bằng (1)
            type: Number,
            required: true,
            unique: true
        },
        management_unit_id: {  //id của đơn vị quản lý (có) (2)
            type: Number,
            required: true
        },
        diploma_name_id:{ // id của tên văn bằng (có) (3)
            type: Number,
            required: true
        },
        diploma_issuance_id:{ // id của đợt cấp văn bằng (có) (4)
            type: Number,
            required: true
        },
        fullname: { // họ tên người được cấp (có) (5)
            type: String,
            required: true
        },
        sex: { //giới tính (có) (6)
            type: Boolean
        },
        dateofbirth: { //ngày sinh (có) (7)
            type: String,
        },
        address: { //nơi sinh (có) (8)
            type: String
        },
        cccd: { //cccd (có) (9)
            type: String
        },
        sign_day:{//ngày ký (có) (10)
            type: String
        },
        diploma_number:{//số hiệu (có) (11)
            type: String,
            required: true
        },
        numbersIntoTheNotebook:{//số vào sổ (có) (12)
            type: String,
            required: true
        },

        //Các thông tin ở dưới là thông tin thêm
        diem_tn: { //13
            type: Number,
            default: null
        },
        diem_th: { //14
            type: Number,
            default: null
        },
        nghe: { //15
            type: Number,
            default: null
        },
        noi: { //16
            type: Number,
            default: null
        },
        doc: { //17
            type: Number,
            default: null
        },
        viet: { //18
            type: Number,
            default: null
        },
        test_day:{ //19. ngày thi
            type: String,
            default: ""
        },
        graduationYear:{//20. năm tốt nghiệp
            type: Number,
            default: null
        },
        classification:{ //21. xếp loại
            type: String,
            default: ""
        },
        nganh_dao_tao:{ //22. Lưu ngành, dựa trên majors_id
            type: Number,
            default: null
        },
        council: { //23. Hội đồng thi
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
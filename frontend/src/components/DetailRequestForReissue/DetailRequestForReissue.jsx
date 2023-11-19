import './DetailRequestForReissue.css';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default function DetailRequestForReissue({
                                                management_unit_detail_request_reissue,
                                                requestForReissue_id_detail_request_reissue,
                                                diploma_name_detail_request_reissue,
                                                numberOfEmbryos_detail_request_reissue,
                                                reason_detail_request_reissue,
                                                result_seri_detail_request_reissue
                                                }){

    //Hàm tạo file pdf yêu cầu cấp phôi
    const convertToImage = async () => {
        const element = document.getElementById("file-name-request-reissue"); // Thay "your-element-id" bằng ID của phần muốn chuyển đổi
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        // Bây giờ bạn có một hình ảnh dưới dạng dữ liệu chuỗi, có thể lưu nó hoặc sử dụng nó dựa trên nhu cầu.
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 210); // Chèn hình ảnh vào PDF
    
        pdf.save("yc_cap_lai_phoi.pdf");
    };

    const handleDateToDMY = (date) => {
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    const handleManagementUnit = (management_unit) => {
        const resultSplit = management_unit.split(" ");
        let finalResult = "";
        resultSplit.forEach((currentValue) => {
          if (currentValue == "&") {
            finalResult += ` ${currentValue[0].toUpperCase()} `;
          } else {
            finalResult += currentValue[0].toUpperCase();
          }
        });
        return finalResult;
    };

    return(
        <>
            <div className="row">
                <p style={{ textAlign: 'center', fontSize: '27px', color: "#1b95a2", fontWeight: 'bold' }}>CHI TIẾT CÔNG VĂN XIN CẤP LẠI PHÔI</p>
                <div className="d-flex justify-content-center">
                    <div id="show-file-name-request-reissue">
                        <div id="file-name-request-reissue">
                            <div className="d-flex justify-content-between">
                                <p style={{ fontSize: '21px' }}>TRƯỜNG ĐẠI HỌC CẦN THƠ</p><p style={{ fontSize: '21px', fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            </div>
                            <div className="d-flex" style={{ marginTop: '-10px' }}>
                                <p style={{ fontSize: '21px', fontWeight: 'bold' }}>{management_unit_detail_request_reissue.toUpperCase()}</p>
                                <p style={{ textDecoration: 'underline', marginLeft: '270px', fontWeight: 'bold', fontSize: '21px' }}>Độc lập - Tự do- Hạnh phúc</p>
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '-10px', marginLeft: '20px' }}>
                                Số: {requestForReissue_id_detail_request_reissue} /{handleManagementUnit(management_unit_detail_request_reissue)}-BPĐT
                            </div>
                            <div className="d-flex justify-content-between" style={{ marginTop: '45px' }}>
                                <div className="col-5" style={{ fontSize: '21px', fontStyle: 'italic' }}></div>
                                <div className="col-1"></div>
                                <div className="col-5" style={{ fontSize: '21px', fontStyle: 'italic' }}>
                                    Cần Thơ, ngày … tháng … năm 2023
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', fontSize: '28px', marginTop: '70px', fontWeight: 'bold' }}>
                                CÔNG VĂN ĐỀ NGHỊ CẤP LẠI PHÔI
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '21px', marginTop: '35px' }}>
                                <span style={{ fontStyle: 'italic' }}>Kính gửi: 	</span><span style={{ fontWeight: 'bold' }}>TỔ QUẢN LÝ CẤP PHÁT PHÔI VBCC</span>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '21px', fontWeight: 'bold' }}>
                                TRƯỜNG ĐẠI HỌC CẦN THƠ
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '50px', textAlign: 'justify' }}>
                                Căn cứ vào tình hình sử dụng phôi <strong>{diploma_name_detail_request_reissue}</strong> của {management_unit_detail_request_reissue}. 
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '20px', textAlign: 'justify' }}>
                                Đề nghị Tổ Quản lý VBCC - Trường Đại học Cần Thơ cấp lại <strong>{numberOfEmbryos_detail_request_reissue} phôi {diploma_name_detail_request_reissue}</strong> để đảm bảo đủ số lượng phôi văn bằng phục vụ cho việc cấp bằng.
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '20px', textAlign: 'justify' }}>
                                Lý do: {reason_detail_request_reissue}
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '20px', textAlign: 'justify' }}>
                                Số seri của các phôi cần cấp lại: {result_seri_detail_request_reissue}
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '20px', textAlign: 'justify' }}>
                                Vì những lý do trên, {management_unit_detail_request_reissue} xin gửi công văn này tới Tổ Quản lý VBCC - Trường Đại học Cần Thơ để được xem xét và thực hiện cấp lại phôi văn bằng cho đơn vị trong thời gian sớm nhất.
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '40px', textAlign: 'justify' }}>
                                Trân trọng kính chào.
                            </div>
                            <div style={{ marginTop: '40px', fontSize: '21px', marginLeft: '700px' }}>GIÁM ĐỐC</div>
                            <div style={{ marginTop: '30px', textIndent: '40px', fontSize: '21px', fontWeight: 'bold', fontStyle: 'italic' }}>Nơi nhận</div>
                            <div style={{ fontSize: '21px', textIndent: '25px' }}>- Như trên;</div>
                            <div style={{ fontSize: '21px', textIndent: '25px' }}>- Lưu VP.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex mt-4 justify-content-end"> 
                <button
                    className="btn"
                    onClick={(e) => {
                        convertToImage();
                    }}
                    style={{ width: '100px', backgroundColor: '#1b95a2', marginRight: '90px', color: 'white'}}
                >
                    Xuất file
                </button>
            </div>
        </>
    )
}
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useState } from "react";
import './EmbryoGrantApplicationForm.css';
export default function EmbryoGrantApplicationForm(){
    const [showFileNameEGAF, setShowFileNameEGAF] =useState(false);

    const convertToImage = async () => {
        const element = document.getElementById("file-name-EGAF"); // Thay "your-element-id" bằng ID của phần muốn chuyển đổi
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        // Bây giờ bạn có một hình ảnh dưới dạng dữ liệu chuỗi, có thể lưu nó hoặc sử dụng nó dựa trên nhu cầu.
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 277); // Chèn hình ảnh vào PDF
    
        pdf.save("your-file-name.pdf");
      };

    return(
        <>
        <button className="btn btn-primary mb-5" onClick={(e)=>setShowFileNameEGAF(!showFileNameEGAF)}>Click show</button>
        {
            showFileNameEGAF ? (
                <>
                <div className="d-flex justify-content-center">                
                    <div id="show-file-name-EGAF">
                        <div id="file-name-EGAF">
                            <div className="d-flex justify-content-between">
                                <p style={{fontSize:'21px'}}>TRƯỜNG ĐẠI HỌC CẦN THƠ</p><p style={{fontSize:'21px', fontWeight: 'bold'}}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            </div>
                            <div className="d-flex" style={{marginTop:'-10px'}}>  
                                <p style={{fontSize:'21px', fontWeight: 'bold'}}>TRUNG TÂM ĐIỆN TỬ TIN HỌC</p>
                                <p style={{textDecoration: 'underline',marginLeft: '270px', fontWeight: 'bold', fontSize:'21px'}}>Độc lập - Tự do- Hạnh phúc</p>
                            </div>
                            <div style={{fontSize: '21px', marginTop:'-10px', marginLeft: '20px'}}>
                                Số:        /TTĐT&TH-BPĐT
                            </div>
                            <div className="d-flex justify-content-between" style={{marginTop: '45px'}}>
                                <div className="col-5" style={{fontSize: '21px', fontStyle:'italic'}}>
                                    V/v xin mua phôi <span style={{fontWeight:'bold'}}>chứng chỉ ứng dụng CNTT cơ bản</span> đợt thi 05/06/20….
                                </div>
                                <div className="col-1"></div>
                                <div className="col-4" style={{fontSize: '21px', fontStyle:'italic'}}>
                                    Cần Thơ, ngày  tháng … năm 2023
                                </div>
                            </div>
                            <div style={{textAlign:'center', fontSize: '21px', marginTop:'65px'}}>
                                <span style={{fontStyle:'italic'}}>Kính gửi: 	</span><span style={{fontWeight:'bold'}}>TỔ QUẢN LÝ CẤP PHÁT PHÔI VBCC</span>
                            </div>
                            <div style={{textAlign:'center', fontSize:'21px', fontWeight:'bold'}}>
                                TRƯỜNG ĐẠI HỌC CẦN THƠ
                            </div>
                            <div style={{fontSize: '21px', textIndent:'40px', marginTop: '50px', textAlign:'justify'}}>
                                Trung tâm Điện tử và Tin học xin báo tình hình sử dụng phôi và xin cấp phôi cho đợt thi chứng chỉ UD CNTT cơ bản đợt thi tháng …../……
                            </div>
                            <div style={{fontSize:'21px', textIndent: '40px', marginTop: '40px', textAlign:'justify'}}>
                                Đề nghị Tổ Quản lý VBCC - Trường Đại học Cần Thơ cấp <span style={{fontStyle:'italic'}}>433</span> <span style={{fontWeight:'bold'}}>phôi chứng chỉ ứng dụng công nghệ thông tin cơ bản</span> để in chứng chỉ cho các thí sinh thi đạt vào đợt thi như sau:
                            </div>
                            <div>
                                <table id="table-file-name-EGAF">
                                    <tr>
                                        <th style={{textAlign: 'center'}}>Chứng chỉ</th>
                                        <th style={{textAlign: 'center'}}>Đợt thi</th>
                                        <th style={{textAlign: 'center'}}>Số lượng thí sinh thi đạt</th>
                                        <th style={{textAlign: 'center'}}>Số seri</th>
                                        <th style={{textAlign: 'center'}}>Số cần cấp</th>
                                    </tr>
                                    <tr>
                                        <td>UD CNTT Cơ bản</td>
                                        <td>29/03/2020</td>
                                        <td>443</td>
                                        <td>000001-000443</td>
                                        <td>443</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: 'bold'}} colSpan={4}>Tổng cộng</td>
                                        <td style={{fontWeight: 'bold'}}>443</td>
                                    </tr>
                                </table>
                            </div>
                            <div style={{textIndent: '30px', fontSize: '21px', marginTop:'35px'}}>Trân trọng kính chào.</div>
                            <div style={{marginTop: '40px', fontSize: '21px', marginLeft: '700px'}}>GIÁM ĐỐC</div>
                            <div style={{marginTop: '30px', textIndent: '40px', fontSize: '21px', fontWeight: 'bold', fontStyle: 'italic'}}>Nơi nhận</div>
                            <div style={{fontSize: '21px', textIndent: '25px'}}>- Như trên;</div>
                            <div style={{fontSize: '21px', textIndent: '25px'}}>- Lưu VP.</div>
                        </div>            
                    </div>
                </div>
                <button
                        className="btn btn-primary mt-4"
                            onClick={(e) => {
                            convertToImage();
                            }}
                        >
                            Click
                    </button> 
                </>
            ) : (
                ""
            )
        }
        
        </>
    )
}
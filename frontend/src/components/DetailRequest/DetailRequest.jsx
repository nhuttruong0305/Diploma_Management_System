import "./DetailRequest.css"
import { useEffect, useRef, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from 'xlsx';
export default function DetailRequest({ embryoIssuanceRequest_id, managementUnitPhieuYC, diplomaNameInPhieuYC, examinationsInPhieuYC, numberOfEmbryosInPhieuYC, diplomaType, optionsOfDiplomaName, allDSHVByEIR }) {

    //Hàm tạo file pdf yêu cầu cấp phôi
    const convertToImage = async () => {
        const element = document.getElementById("file-name-EGAF"); // Thay "your-element-id" bằng ID của phần muốn chuyển đổi
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");
        // Bây giờ bạn có một hình ảnh dưới dạng dữ liệu chuỗi, có thể lưu nó hoặc sử dụng nó dựa trên nhu cầu.
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "PNG", 10, 10, 190, 230); // Chèn hình ảnh vào PDF
    
        pdf.save("yc_cap_phoi.pdf");
    };

    const handleDateToDMY = (date) => {//xóa
        let splitDate = date.split("-");
        const result = `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
        return result;
    }

    //Phân trang danh sách học viên kèm theo
    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    //state lưu danh sách học viên kèm theo được hiện lên màn hình khi phân trang
    const [allDSHVByEIRShow, setAllDSHVByEIRShow] = useState([]);

    useEffect(()=>{
        if(page!=undefined && allDSHVByEIR!=undefined){
            if(allDSHVByEIR.length>5){
                const numberOfPage = Math.ceil(allDSHVByEIR?.length/5);
                const startElement = (page - 1) * 5;
                let endElement = 0;
                if(page == numberOfPage){
                    endElement = allDSHVByEIR.length-1;
                }else{
                    endElement = page * 5-1;
                }

                let result = [];
                for(let i = startElement; i <= endElement; i++){
                    result = [...result, allDSHVByEIR[i]];
                }
                setAllDSHVByEIRShow(result);
            }else{
                setAllDSHVByEIRShow(allDSHVByEIR);
            }         
        }
    }, [page, allDSHVByEIR])

    //Hàm xuất file DSHV kèm theo
    const downloadDSHV = () => { 
        // Tạo dữ liệu bạn muốn đưa vào tệp Excel
        const alphabet = ["G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1"];
        const ascending = optionsOfDiplomaName.slice().sort((a, b) => a - b);
       
        const options1 = [
            'Điểm trắc nghiệm',
            'Điểm thực hành', 
            'Điểm kỹ năng nghe',
            'Điểm kỹ năng nói',
            'Điểm kỹ năng đọc', 
            'Điểm kỹ năng viết',
            'Ngày thi',
            'Năm tốt nghiệp',
            'Xếp loại',
            'Ngành đào tạo',
            'Hội đồng thi',
        ]
        
        // Tạo một Workbook và một Worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(allDSHVByEIR);

        worksheet['A1'] = { v: 'STT', t: 's' };
        worksheet['B1'] = { v: 'Họ tên người được cấp', t: 's' };
        worksheet['C1'] = { v: 'Giới tính', t: 's' };
        worksheet['D1'] = { v: 'Ngày sinh', t: 's' };
        worksheet['E1'] = { v: 'Nơi sinh', t: 's' };
        worksheet['F1'] = { v: 'CCCD', t: 's' };

        for(let i = 0; i<ascending?.length; i++){
            worksheet[alphabet[i]] = { v: options1[ascending[i]-1], t: 's' }; 
        }
        
        // Thêm Worksheet vào Workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Chuyển đổi Workbook thành dạng binary
        var wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
        // Chuyển đổi dạng binary thành ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i < s.length; i++) {
                view[i] = s.charCodeAt(i) & 0xff;
            }
            return buf;
        }
        // Tạo một Blob từ ArrayBuffer
        var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

        // Tạo một URL cho Blob
        var url = URL.createObjectURL(blob);

        // Tạo một đường link tải xuống
        var link = document.createElement('a');
        link.href = url;
        link.download = 'dshv.xlsx';

        // Thêm đường link vào DOM và tự động kích hoạt sự kiện click để tải xuống
        // export_excel_btn.append(link);
        link.click();
        // document.body.removeChild(link);
    }

    //
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

    return (
        <>
            <div className="row">
                <p style={{ textAlign: 'center', fontSize: '27px', color: "#1b95a2", fontWeight: 'bold' }}>CHI TIẾT YÊU CẦU</p>
                <div className="d-flex justify-content-center">
                    <div id="show-file-name-EGAF">
                        <div id="file-name-EGAF">
                            <div className="d-flex justify-content-between">
                                <p style={{ fontSize: '21px' }}>TRƯỜNG ĐẠI HỌC CẦN THƠ</p><p style={{ fontSize: '21px', fontWeight: 'bold' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                            </div>
                            <div className="d-flex" style={{ marginTop: '-10px' }}>
                                <p style={{ fontSize: '21px', fontWeight: 'bold' }}>{managementUnitPhieuYC.toUpperCase()}</p>
                                <p style={{ textDecoration: 'underline', marginLeft: '270px', fontWeight: 'bold', fontSize: '21px' }}>Độc lập - Tự do- Hạnh phúc</p>
                            </div>
                            <div style={{ fontSize: '21px', marginTop: '-10px', marginLeft: '20px' }}>
                                Số: {embryoIssuanceRequest_id} /{handleManagementUnit(managementUnitPhieuYC)}-BPĐT
                            </div>
                            <div className="d-flex justify-content-between" style={{ marginTop: '45px' }}>
                                <div className="col-5" style={{ fontSize: '21px', fontStyle: 'italic' }}>
                                    V/v xin mua phôi <span style={{ fontWeight: 'bold' }}>{diplomaNameInPhieuYC}</span> đợt thi/đợt cấp bằng {handleDateToDMY(examinationsInPhieuYC)}
                                </div>
                                <div className="col-1"></div>
                                <div className="col-5" style={{ fontSize: '21px', fontStyle: 'italic' }}>
                                    Cần Thơ, ngày … tháng … năm 2023
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '21px', marginTop: '65px' }}>
                                <span style={{ fontStyle: 'italic' }}>Kính gửi: 	</span><span style={{ fontWeight: 'bold' }}>TỔ QUẢN LÝ CẤP PHÁT PHÔI VBCC</span>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '21px', fontWeight: 'bold' }}>
                                TRƯỜNG ĐẠI HỌC CẦN THƠ
                            </div>
                            <div style={{ fontSize: '21px', textIndent: '40px', marginTop: '50px', textAlign: 'justify' }}>
                                {managementUnitPhieuYC} xin báo cáo tình hình sử dụng phôi và xin cấp phôi {diplomaNameInPhieuYC} đợt thi/đợt cấp bằng {handleDateToDMY(examinationsInPhieuYC)}
                            </div>
                            <div style={{ fontSize: '21px', textIndent: '40px', marginTop: '40px', textAlign: 'justify' }}>
                                Đề nghị Tổ Quản lý VBCC - Trường Đại học Cần Thơ cấp <span style={{ fontStyle: 'italic' }}>{numberOfEmbryosInPhieuYC}</span> <span style={{ fontWeight: 'bold' }}>phôi {diplomaNameInPhieuYC}</span> để in {diplomaType.toLowerCase()} cho các thí sinh vào đợt thi/đợt cấp văn bằng như sau:
                            </div>
                            <div>
                                <table id="table-file-name-EGAF">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>{diplomaType}</th>
                                            <th style={{ textAlign: 'center' }}>Đợt thi/Đợt cấp bằng</th>
                                            <th style={{ textAlign: 'center' }}>Số lượng thí sinh</th>
                                            <th style={{ textAlign: 'center' }}>Số cần cấp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{diplomaNameInPhieuYC}</td>
                                            <td>{handleDateToDMY(examinationsInPhieuYC)}</td>
                                            <td>{numberOfEmbryosInPhieuYC}</td>
                                            <td>{numberOfEmbryosInPhieuYC}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: 'bold' }} colSpan={3}>Tổng cộng</td>
                                            <td style={{ fontWeight: 'bold' }}>{numberOfEmbryosInPhieuYC}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ textIndent: '30px', fontSize: '21px', marginTop: '35px' }}>Trân trọng kính chào.</div>
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
            <div className='title-list-yc-xin-cap-phoi'>
                DANH SÁCH HỌC VIÊN KÈM THEO
            </div>
            <div className="row p-5">
                <div id='contain-table-show-dshv'>
                    <table className="table table-bordered" id='table-show-dshv'>
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Họ tên người được cấp</th>
                                <th scope="col">Giới tính</th>
                                <th scope="col">Ngày sinh (M/D/Y)</th>
                                <th scope="col">Nơi sinh</th>
                                <th scope="col">CCCD</th>
                                {
                                    optionsOfDiplomaName?.includes(1) ? (
                                        <th scope="col">Điểm trắc nghiệm</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(2) ? (
                                        <th scope="col">Điểm thực hành</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(3) ? (
                                        <th scope="col">Điểm kỹ năng nghe</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(4) ? (
                                        <th scope="col">Điểm kỹ năng nói</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(5) ? (
                                        <th scope="col">Điểm kỹ năng đọc</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(6) ? (
                                        <th scope="col">Điểm kỹ năng viết</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(7) ? (
                                        <th scope="col">Ngày thi (M/D/Y)</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(8) ? (
                                        <th scope="col">Năm tốt nghiệp</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(9) ? (
                                        <th scope="col">Xếp loại</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(10) ? (
                                        <th scope="col">Ngành đào tạo</th>
                                    ) : (
                                        ""
                                    )
                                }
                                {
                                    optionsOfDiplomaName?.includes(11) ? (
                                        <th scope="col">Hội đồng thi</th>
                                    ) : (
                                        ""
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allDSHVByEIRShow?.map((currentValue, index) => {
                                    return (
                                        <tr key={index}>
                                            <th style={{ textAlign: 'center' }} scope="row">{index + 1}</th>
                                            <td>{currentValue.fullname}</td>
                                            <td>{currentValue.sex}</td>
                                            <td>{currentValue.dateOfBirth}</td>
                                            <td>{currentValue.address}</td>
                                            <td>{currentValue.CCCD}</td>
                                            {
                                                optionsOfDiplomaName?.includes(1) ? (
                                                    <td>{currentValue.diem_tn}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(2) ? (
                                                    <td>{currentValue.diem_th}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(3) ? (
                                                    <td>{currentValue.nghe}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(4) ? (
                                                    <td>{currentValue.noi}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(5) ? (
                                                    <td>{currentValue.doc}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(6) ? (
                                                    <td>{currentValue.viet}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(7) ? (
                                                    <td>{currentValue.test_day}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(8) ? (
                                                    <td>{currentValue.graduationYear}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(9) ? (
                                                    <td>{currentValue.classification}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(10) ? (
                                                    <td>{currentValue.nganh_dao_tao}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                            {
                                                optionsOfDiplomaName?.includes(11) ? (
                                                    <td>{currentValue.council}</td>
                                                ) : (
                                                    ""
                                                )
                                            }
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <Stack spacing={2}>
                        <Pagination
                            count={Math.ceil(allDSHVByEIR?.length / 5)}
                            variant="outlined"
                            page={page}
                            onChange={handleChange}
                            color="info"
                        />
                    </Stack>
                </div>

                <div className='d-flex justify-content-end'>
                    <button
                        onClick={(e) => {
                            downloadDSHV()
                        }}
                        className='btn'
                        style={{ width: '100px', backgroundColor: '#fed25c', marginRight: '40px', color: 'white'}}
                    >Xuất file</button>
                </div>
            </div>
        </>
    )
}
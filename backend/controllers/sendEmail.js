const nodemailer = require('nodemailer');

const sendEmailController = {
    sendEmail: async (req, res) => {

        // Tạo một transporter để gửi email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'certificatemanagementsystem@gmail.com',
                pass: process.env.MY_PASS_GMAIL
            }
        });

        // Thông tin người nhận và nội dung email
        const mailOptions = {
            from: 'certificatemanagementsystem@gmail.com',
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.html
        };

        // Gửi email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
                return res.status(400).json("Có lỗi xảy ra");
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json("Gửi email thành công");
            }
        });
    }
}

module.exports = sendEmailController;




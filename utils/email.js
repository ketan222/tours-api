const nodemailer = require('nodemailer');
const sendEmail = async options =>{
    // 1) Create a Transporter.
    // console.log(options);
    const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
            user: "400a8477ed8e58",
            pass: "1694977d537c8f"
        }

        // Activate in gmail "less secure app" option
    })
    // 2) Define the email options.
    const mailOptions = {
        from: "noreply@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    };
    console.log(mailOptions);
    // 3) Actually send the email.
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
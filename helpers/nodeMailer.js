import nodemailer from "nodemailer";

const nodeMailerSendingEmails = async (email, otp , email_type) => {
    try {
        const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 465,
                secure: false, // true for port 465, false for other ports
                auth: {
                user: process.env.GMAIL_ADDRESS,
                pass: process.env.GMAIL_PASSCODE,
            },
        });
    
        // send mail with defined transport object
        const info = await transporter.sendMail({
        from: "whatsapp_usman@gmail.com", // sender address
        to: email, // list of receivers
        subject: "Checking Nodemailer", // Subject line
        // text: "Hello world?", // plain text body
        html: `<p>This is to verify your account you just have created at WhatsUp. Enter this OTP:<span>${otp + ' '}</span>to verify your account</p>`, // html body
        });

        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        if(info && Object.keys(info).length > 0){
            return true;
        }
    } catch (error) {
        console.log("SENDING EMAIL THROUGH NODEMAILER: ", error.message);
        return false;
    }
};


export default nodeMailerSendingEmails;
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()

const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
        
})



// const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     secure: false, // Use TLS (if you are using 587)
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
//     tls: {
//         rejectUnauthorized: false, // Optional: if you want to bypass certificate issues
//     },
//     connectionTimeout: 10000, // 10 seconds for connection
//     socketTimeout: 10000, // 10 seconds for socket timeout
// });

export default transporter;
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const sendMail=async({to, subject, text, html})=>{
    const transporter= nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        },
    })
    await transporter.sendMail({
        from: '"CampusGuard" <no-reply@CampusGuard.com>', 
        to,
        subject,
        text,
        html
    })
}

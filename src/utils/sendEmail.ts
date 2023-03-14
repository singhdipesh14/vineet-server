import nodemailer from "nodemailer"

export type EmailMessage = {
    to: string
    from: string
    subject: string
    text: string
}

const sendEmail = async (message: EmailMessage) => {
    let transporter = nodemailer.createTransport({
        service: "outlook",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    })
    return await transporter.sendMail(message)
}

export default sendEmail

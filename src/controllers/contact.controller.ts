import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import sendEmail, { EmailMessage } from "../utils/sendEmail"
import nodemailer from "nodemailer"

const controller = async (req: Request, res: Response) => {
    const { firstName, lastName, email, subject, message } = req.body
    if (!email || !message || !firstName || !subject || !lastName)
        throw new CustomError.BadRequestError(
            "Please provide all the necessary details"
        )
    const msg = {
        to: process.env.EMAIL_TO || "", // Change to your recipient
        from: process.env.EMAIL_FROM || "", // Change to your verified sender
        subject: `${firstName} ${lastName} wants to connect with you.`,
        text: `Subject : ${subject}\nMessage : \n${message}\nEmail : ${email}`,
    }
    await sendEmail(msg)
    res.status(StatusCodes.OK).json({ msg: "Thanks for getting in touch!" })
}

export default controller

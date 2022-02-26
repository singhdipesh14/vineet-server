import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import sgMail from "@sendgrid/mail"

const controller = async (req: Request, res: Response) => {
	const { firstName, lastName, email, subject, message } = req.body
	if (!email || !message || !firstName || !subject || !lastName)
		throw new CustomError.BadRequestError(
			"Please provide all the necessary details"
		)
	// email and sms functionality
	sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")
	const msg = {
		to: process.env.EMAIL_TO || "", // Change to your recipient
		from: process.env.EMAIL_FROM || "", // Change to your verified sender
		subject: `${firstName} ${lastName} wants to connect with you.`,
		text: `Subject : ${subject}\nMessage : \n${message}\nEmail : ${email}`,
	}
	const info = await sgMail.send(msg)
	res.status(StatusCodes.OK).json({ msg: "Thanks for getting in touch!" })
}

export default controller

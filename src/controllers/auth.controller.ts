import { Request, Response } from "express"
import User from "../models/user.model"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { jwt, createTokenUser } from "../utils"
import { randomString as generateString } from "../utils"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import sgMail from "@sendgrid/mail"

const { attachCookiesToResponse } = jwt

type userType = {
	email: string
	name: string
	password: string
}

const register = async (req: Request, res: Response) => {
	const { email, name, password }: userType = req.body
	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists) {
		throw new CustomError.BadRequestError("Email Already exists")
	}

	// first registered user is an admin
	const isFirstAccount = (await User.countDocuments({})) === 0

	const role = isFirstAccount ? "admin" : "user"
	console.log({ email, password, name, role })
	const user = await User.create({ email, password, name, role })
	const tokenUser = createTokenUser(user)
	console.log(tokenUser)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req: Request, res: Response) => {
	const { email, password } = req.body
	if (!email || !password)
		throw new CustomError.BadRequestError("Please provide email and password")
	const user = await User.findOne({ email })
	if (!user) throw new CustomError.UnauthenticatedError("Invalid Credentials")

	const isPasswordCorrect = await user.comparePassword(password)
	if (!isPasswordCorrect)
		throw new CustomError.UnauthenticatedError("Invalid Credentials")
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ user: tokenUser })
}
const logout = async (req: Request, res: Response) => {
	res.cookie("token", "logout", {
		httpOnly: true,
		expires: new Date(Date.now() + 1000),
	})
	res.status(StatusCodes.OK).json({ msg: "user logged out!" })
}

const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body
	const user = await User.findOne({ email })
	if (!user) throw new CustomError.NotFoundError(`No user with email ${email}`)
	const newPassword = generateString(10)
	user.password = newPassword
	await user.save()
	sgMail.setApiKey(process.env.SENDGRID_API_KEY || "")
	const msg = {
		to: email, // Change to your recipient
		from: process.env.EMAIL_FROM || "", // Change to your verified sender
		subject: `Your new password for Vineet Singh's Blog is here.`,
		text: `Email : ${email}\nPassword : ${newPassword}\nPlease change your password after logging in.`,
	}
	const info = await sgMail.send(msg)
	res
		.status(StatusCodes.OK)
		.json({ msg: "Check your email for the new password" })
}

export const uploadImage = async (req: Request, res: Response) => {
	if (!req.files) throw new CustomError.BadRequestError("No file Uploaded")
	const productImage = req.files.image
	if (Array.isArray(productImage)) {
		throw new CustomError.BadRequestError("Please Upload only one file")
	}
	if (!productImage.mimetype.startsWith("image")) {
		throw new CustomError.BadRequestError("Please only upload images")
	}
	const maxSize = 1024 * 1024
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError("Image size must be less than 1MB")
	}
	const result = await cloudinary.uploader.upload(productImage.tempFilePath, {
		use_filename: true,
		folder: "vineet-portfolio-users",
	})
	fs.unlinkSync(productImage.tempFilePath)
	return res.status(StatusCodes.OK).json({ image: result.secure_url })
}

const exportVar = { login, logout, register, forgotPassword, uploadImage }

export default exportVar

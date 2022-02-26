import { Request, Response } from "express"
import User, { UserSchemaType } from "../models/user.model"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import { createTokenUser, jwt, checkPermissions } from "../utils"
import { HydratedDocument } from "mongoose"

const { attachCookiesToResponse } = jwt

export const getAllUsers = async (req: Request, res: Response) => {
	const users: HydratedDocument<UserSchemaType>[] | null = await User.find(
		{}
	).select("-password")
	res.status(StatusCodes.OK).json({ users })
}

export const createUser = async (req: Request, res: Response) => {
	const { name, email, password, image, role } = req.body
	if (!name || !email || !password || !role) {
		throw new CustomError.BadRequestError(
			"Please provide all the required details"
		)
	}
	const isAlreadyUser = await User.findOne({ email })
	if (isAlreadyUser) {
		throw new CustomError.BadRequestError(
			`User already exists with email ${email}`
		)
	}
	const user = await User.create({ email, password, name, role, image })
	const tokenUser = createTokenUser(user)
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params

	const user = await User.findOne({ _id: id })
	if (!user) {
		throw new CustomError.BadRequestError(`No user found with id ${id}`)
	}
	await user.remove()
	res.status(StatusCodes.OK).json({ msg: `User ${id} removed successfully` })
}

export const getSingleUser = async (req: Request, res: Response) => {
	const user: HydratedDocument<UserSchemaType> | null = await User.findOne({
		_id: req.params.id,
	}).select("-password")
	if (!user) {
		throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`)
	}
	checkPermissions(req.user, user._id)
	res.status(StatusCodes.OK).json({ user })
}

export const showCurrentUser = async (req: Request, res: Response) => {
	res.status(StatusCodes.OK).json({ user: req.user })
}

export const updateUser = async (req: Request, res: Response) => {
	const { email, name, image } = req.body
	const emailAlreadyExists = await User.findOne({ email })
	if (emailAlreadyExists)
		throw new CustomError.BadRequestError(
			`Account already exists for email ${email}`
		)
	const user: HydratedDocument<UserSchemaType> | null = await User.findOne({
		_id: req.user.userId,
	})
	if (!user) {
		throw new CustomError.NotFoundError(
			`No user found with id ${req.user.userId}`
		)
	}
	user.name = name || user.name
	user.email = email || user.email
	user.image = image || user.image
	await user.save()
	const tokenUser = createTokenUser(user)
	attachCookiesToResponse({ res, user: tokenUser })
	res.status(StatusCodes.OK).json({ user: tokenUser })
}

export const updateUserPassword = async (req: Request, res: Response) => {
	const { oldPassword, newPassword } = req.body
	if (!oldPassword || !newPassword)
		throw new CustomError.BadRequestError("Please provide both values")
	const user: HydratedDocument<UserSchemaType> | null = await User.findOne({
		_id: req.user.userId,
	})
	if (!user) {
		throw new CustomError.NotFoundError(
			`No user found with id : ${req.user.userId}`
		)
	}
	const isPasswordCorrect = await user.comparePassword(oldPassword)
	if (!isPasswordCorrect)
		throw new CustomError.UnauthenticatedError("Invalid Credentials")
	user.password = newPassword
	await user.save()
	res.status(StatusCodes.OK).json({ msg: "Success! Password updated." })
}

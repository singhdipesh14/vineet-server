import Position from "../models/position.model"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"

export const getAllPositions = async (req: Request, res: Response) => {
	const positions = await Position.find({})
	res.status(StatusCodes.OK).json({ positions, count: positions.length })
}
export const getSinglePosition = async (req: Request, res: Response) => {
	const { id } = req.params
	const position = await Position.findOne({ _id: id })
	if (!position) throw new CustomError.NotFoundError(`No position found with id ${id}`)
	res.status(StatusCodes.OK).json({ position })
}
export const createPosition = async (req: Request, res: Response) => {
	const { title, description, apply } = req.body
	if (!title || !description || !apply)
		throw new CustomError.BadRequestError(`Please provide all the details`)
	const position = await Position.create({
		title,
		description,
		apply
	})
	res.status(StatusCodes.CREATED).json({ position })
}
export const deletePosition = async (req: Request, res: Response) => {
	const { id } = req.params
	const position = await Position.findOne({ _id: id })
	if (!position) throw new CustomError.NotFoundError(`No position found with id ${id}`)
	await position.remove()
	res.status(StatusCodes.OK).json({ msg: "position deleted successfully!" })
}
export const updatePosition = async (req: Request, res: Response) => {
	const { id } = req.params
	const position = await Position.findOne({ _id: id })
	if (!position) throw new CustomError.NotFoundError(`No position found with id ${id}`)
	const { title, description, apply } = req.body
	position.title = title || position.title
	position.description = description || position.description
	position.apply = apply || position.apply
	await position.save()
	res.status(StatusCodes.OK).json({ position })
}

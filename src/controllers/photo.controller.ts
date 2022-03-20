import Photo from "../models/photo.model"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import CustomError from "../errors"

export const getAllPhotos = async (req: Request, res: Response) => {
	const photos = await Photo.find({})
	res.status(StatusCodes.OK).json({ photos, count: photos.length })
}
export const getSinglePhoto = async (req: Request, res: Response) => {
	const { id } = req.params
	const photo = await Photo.findOne({ _id: id })
	if (!photo) throw new CustomError.NotFoundError(`No photo found with id ${id}`)
	res.status(StatusCodes.OK).json({ photo })
}

export const createPhoto = async (req: Request, res: Response) => {
	const { title, description, url, public_id } = req.body
	if (!title || !description || !url)
		throw new CustomError.BadRequestError(`Please provide all the details`)
	const photo = await Photo.create({
		title,
		description,
		url,
		public_id,
	})
	res.status(StatusCodes.CREATED).json({ photo })
}
export const uploadPhoto = async (req: Request, res: Response) => {
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
	return res
		.status(StatusCodes.OK)
		.json({ image: result.secure_url, public_id: result.public_id })
}
export const deletePhoto = async (req: Request, res: Response) => {
	const { id } = req.params
	const photo = await Photo.findOne({ _id: id })
	if (!photo) throw new CustomError.NotFoundError(`No photo found with id ${id}`)
	await cloudinary.uploader.destroy(photo.public_id)
	await photo.remove()
	res.status(StatusCodes.OK).json({ msg: "photo deleted successfully!" })
}
export const updatePhoto = async (req: Request, res: Response) => {
	const { id } = req.params
	const photo = await Photo.findOne({ _id: id })
	if (!photo)
		throw new CustomError.NotFoundError(`No position found with id ${id}`)
	const { title, description, url, public_id } = req.body
	photo.title = title || photo.title
	photo.description = description || photo.description
	photo.url = url || photo.url
	photo.public_id = public_id || photo.public_id
	await photo.save()
	res.status(StatusCodes.OK).json({ photo })
}

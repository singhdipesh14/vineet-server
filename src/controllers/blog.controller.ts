import Blog from "../models/blog.model"
import { Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import CustomError from "../errors"
import checkPermissions from "../utils/checkPermissions"

export const getAllBlogs = async (req: Request, res: Response) => {
	const blogs = await Blog.find({}).populate({
		path: "user",
		select: "name email image",
	})

	res.status(StatusCodes.OK).json({ blogs, count: blogs.length })
}
export const getSingleBlog = async (req: Request, res: Response) => {
	const { id } = req.params
	const blog = await Blog.findOne({ _id: id }).populate({
		path: "user",
		select: "name email image",
	})
	if (!blog) throw new CustomError.NotFoundError(`No blog found with id ${id}`)
	res.status(StatusCodes.OK).json({ blog })
}
export const createBlog = async (req: Request, res: Response) => {
	const user = req.user
	console.log(user)
	const { title, description, categories, tags, readTime, markdown } = req.body
	if (!title || !description || !readTime || !markdown)
		throw new CustomError.BadRequestError(`Please provide all the details`)
	const blog = await Blog.create({
		title,
		description,
		categories,
		tags,
		readTime,
		markdown,
		user: user.userId,
	})
	res.status(StatusCodes.CREATED).json({ blog })
}
export const deleteBlog = async (req: Request, res: Response) => {
	const { id } = req.params
	const user = req.user
	checkPermissions(user, id)
	const blog = await Blog.findOne({ _id: id })
	if (!blog) throw new CustomError.NotFoundError(`No blog found with id ${id}`)
	await blog.remove()
	res.status(StatusCodes.OK).json({ msg: "Blog deleted successfully!" })
}
export const updateBlog = async (req: Request, res: Response) => {
	const { id } = req.params
	const user = req.user
	checkPermissions(user, id)
	const blog = await Blog.findOne({ _id: id })
	if (!blog) throw new CustomError.NotFoundError(`No blog found with id ${id}`)
	const { title, description, categories, tags, readTime, markdown } = req.body
	blog.title = title || blog.title
	blog.description = description || blog.description
	blog.categories = categories || blog.categories
	blog.tags = tags || blog.tags
	blog.readTime = readTime || blog.readTime
	blog.markdown = markdown || blog.markdown
	await blog.save()
	res.status(StatusCodes.OK).json({ blog })
}

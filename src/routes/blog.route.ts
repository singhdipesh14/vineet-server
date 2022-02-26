import express from "express"
import {
	getAllBlogs,
	createBlog,
	getSingleBlog,
	updateBlog,
	deleteBlog,
} from "../controllers/blog.controller"
import { authenticateUser } from "../middleware/authentication"
const router = express.Router()

router.route("/").get(getAllBlogs).post(authenticateUser, createBlog)

router
	.route("/:id")
	.get(getSingleBlog)
	.patch(authenticateUser, updateBlog)
	.delete(authenticateUser, deleteBlog)

export default router

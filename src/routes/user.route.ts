import express from "express"
import {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword,
	createUser,
	deleteUser,
} from "../controllers/user.controller"

import {
	authorizePermissions,
	authenticateUser,
} from "../middleware/authentication"

const router = express.Router()

router
	.route("/")
	.get(authenticateUser, authorizePermissions("admin"), getAllUsers)
	.post(authenticateUser, authorizePermissions("admin"), createUser)

router.route("/showMe").get(authenticateUser, showCurrentUser)

// router.route("/showAllMyBlogs").get(authenticateUser, getCurrentUserBlogs)

router.route("/updateUser").patch(authenticateUser, updateUser)

router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword)

router
	.route("/:id")
	.get(authenticateUser, getSingleUser)
	.delete(authenticateUser, authorizePermissions("admin"), deleteUser)

export default router

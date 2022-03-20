import express from "express"
import {
	getAllPhotos,
	uploadPhoto,
	createPhoto,
	getSinglePhoto,
	updatePhoto,
	deletePhoto,
} from "../controllers/photo.controller"
import {
	authenticateUser,
	authorizePermissions,
} from "../middleware/authentication"
const router = express.Router()

router
	.route("/")
	.get(getAllPhotos)
	.post(authenticateUser, createPhoto)

router.route("/uploadPhoto").post(authenticateUser, uploadPhoto)

router
	.route("/:id")
	.get(getSinglePhoto)
	.patch(authenticateUser, authorizePermissions("admin"), updatePhoto)
	.delete(authenticateUser, authorizePermissions("admin"), deletePhoto)

export default router

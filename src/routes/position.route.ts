import express from "express"
import {
	getAllPositions,
	createPosition,
	getSinglePosition,
	updatePosition,
	deletePosition,
} from "../controllers/position.controller"
import {
	authenticateUser,
	authorizePermissions,
} from "../middleware/authentication"
const router = express.Router()

router
	.route("/")
	.get(getAllPositions)
	.post(authenticateUser, authorizePermissions("admin"), createPosition)

router
	.route("/:id")
	.get(getSinglePosition)
	.patch(authenticateUser, authorizePermissions("admin"), updatePosition)
	.delete(authenticateUser, authorizePermissions("admin"), deletePosition)

export default router

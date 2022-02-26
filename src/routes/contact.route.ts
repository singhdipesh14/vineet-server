import express from "express"
import contactController from "../controllers/contact.controller"
const router = express.Router()

router.route("/").post(contactController)

export default router

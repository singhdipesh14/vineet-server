import express from "express"
import authRoutes from "../controllers/auth.controller"
import { uploadImage } from "../controllers/auth.controller"

const router = express.Router()

const { login, logout, register, forgotPassword } = authRoutes

router.post("/register", register)
router.post("/login", login)
router.get("/logout", logout)
router.post("/forgotPassword", forgotPassword)
router.route("/uploadImage").post(uploadImage)

export default router

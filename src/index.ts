import express, { Request, Response, Application, NextFunction } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"

// middlewares
import notFoundMiddleware from "./middleware/not-found"
import errorHandlerMiddleware from "./middleware/error-handler"

// routers
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import contactRouter from "./routes/contact.route"
import blogRouter from "./routes/blog.route"

// configurations
dotenv.config()
const app: Application = express()
const port = process.env.PORT || 3080
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})

// applying middlewares
app.use(cors())
app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload({ useTempFiles: true }))

app.get("/api/v1", (req: Request, res: Response) => {
	res.send("hello world")
})

// methods
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/v1/blogs", blogRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
	try {
		await connectDB(process.env.MONGO_DB_URI || "")
		app.listen(port, () => console.log(`Server is listening on port ${port}...`))
	} catch (error) {
		console.log(error)
	}
}

start()

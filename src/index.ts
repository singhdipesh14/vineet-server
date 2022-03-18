import express, { Application } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"
import { v2 as cloudinary } from "cloudinary"
import cors from "cors"
import rateLimiter from "express-rate-limit"
import helmet from "helmet"
import xss from "xss-clean"
import ExpressMongoSanitize from "express-mongo-sanitize"

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

//security
app.set("trust proxy", 1)
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000,
		max: 500,
	})
)
app.use(helmet())
app.use(cors({ credentials: true, origin: "https://vineet-singh.netlify.app/" }))
app.use(xss())
app.use(ExpressMongoSanitize())

// applying middlewares
if (process.env.NODE_ENV === "development") app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload({ useTempFiles: true }))

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

import express, { Request, Response, Application, NextFunction } from "express" // express
import dotenv from "dotenv" // env variables
import connectDB from "./db/connect" // database
import "express-async-errors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"

// middlewares
import notFoundMiddleware from "./middleware/not-found"
import errorHandlerMiddleware from "./middleware/error-handler"

// routers

// configurations
dotenv.config()
const app: Application = express()
const port = process.env.PORT || 3000

// applying middlewares
app.use(morgan("tiny"))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static("./public"))
app.use(fileUpload())

app.get("/", (req: Request, res: Response) => {
	res.send("hello world")
})

// methods

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

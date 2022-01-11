import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api"

interface BadRequestErrorType {
	statusCode: Number
}

class BadRequestError extends CustomAPIError implements BadRequestErrorType {
	statusCode: Number
	constructor(message: string) {
		super(message)
		this.statusCode = StatusCodes.BAD_REQUEST
	}
}
export default BadRequestError

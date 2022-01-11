import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api"

interface NotFoundErrorType {
	statusCode: Number
}

class NotFoundError extends CustomAPIError implements NotFoundErrorType {
	statusCode: Number
	constructor(message: string) {
		super(message)
		this.statusCode = StatusCodes.NOT_FOUND
	}
}

export default NotFoundError

import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api"

interface UnauthorizedErrorType {
	statusCode: Number
}

class UnauthorizedError
	extends CustomAPIError
	implements UnauthorizedErrorType
{
	statusCode: Number
	constructor(message: string) {
		super(message)
		this.statusCode = StatusCodes.FORBIDDEN
	}
}

export default UnauthorizedError

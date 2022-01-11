import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api"

interface UnathenticatedErrorType {
	statusCode: Number
}

class UnauthenticatedError
	extends CustomAPIError
	implements UnathenticatedErrorType
{
	statusCode: Number
	constructor(message: string) {
		super(message)
		this.statusCode = StatusCodes.UNAUTHORIZED
	}
}

export default UnauthenticatedError

import CustomError from "../errors"
import { isTokenValid } from "../utils/jwt"
import { Request, Response, NextFunction } from "express"

const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let token
	// check header
	const authHeader = req.headers.authorization
	if (authHeader && authHeader.startsWith("Bearer")) {
		token = authHeader.split(" ")[1]
	}
	// check cookies
	else if (req.cookies.token) {
		token = req.cookies.token
	}

	if (!token) {
		throw new CustomError.UnauthenticatedError("Authentication invalid")
	}
	try {
		const payload = isTokenValid(token)

		// Attach the user and his permissions to the req object
		req.user = {
			userId: payload.user.userId,
			role: payload.user.role,
		}

		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Authentication invalid")
	}
}

const authorizeRoles = (...roles: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthenticatedError(
				"Unauthorized to access this route"
			)
		}
		next()
	}
}

module.exports = { authenticateUser, authorizeRoles }

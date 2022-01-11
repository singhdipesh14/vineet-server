import { NextFunction, Request, Response } from "express"
import CustomError from "../errors"
import { jwt } from "../utils"

const { isTokenValid } = jwt

export const authenticateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.signedCookies.token
	if (!token)
		throw new CustomError.UnauthenticatedError("Authentication Invalid")
	try {
		const user = isTokenValid(token)
		if (typeof user !== "string")
			req.user = { name: user.name, userId: user.userId, role: user.role }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError("Authentication Invalid")
	}
}

export const authorizePermissions = (...roles: string[]) =>
	function (req: Request, res: Response, next: NextFunction) {
		if (!roles.includes(req.user.role)) {
			throw new CustomError.UnauthorizedError("Unauthorized to access this route")
		}
		next()
	}

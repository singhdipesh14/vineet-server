import { Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import CustomError from "../errors"

export const createJWT = (payload: JwtPayload) => {
	let token: string
	if (process.env.JWT_SECRET)
		token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_LIFETIME,
		})
	else throw new CustomError.CustomAPIError("No JWT_SECRET available")
	return token
}

export const isTokenValid = (token: string) => {
	if (process.env.JWT_SECRET) return jwt.verify(token, process.env.JWT_SECRET)
	else throw new CustomError.CustomAPIError("No JWT_SECRET available")
}

type cookiesPayload = {
	res: Response
	user: JwtPayload
}
export const attachCookiesToResponse = ({ res, user }: cookiesPayload) => {
	const token = createJWT(user)
	const oneDay = 1000 * 60 * 60 * 24
	res.cookie("token", token, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
		signed: true,
	})
}

import { JwtPayload } from "jsonwebtoken"
import CustomError from "../errors"

const checkPermissions = (requestUser: JwtPayload, resourceId: Object) => {
	if (requestUser.role === "admin") return
	else if (requestUser.userId === resourceId.toString()) return
	throw new CustomError.UnauthorizedError("Not authorized to access this route")
}

export default checkPermissions

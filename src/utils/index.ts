import { createJWT, isTokenValid, attachCookiesToResponse } from "./jwt"
import createTokenUserFn from "./createTokenUser"
import checkPermissionsFn from "./checkPermissions"
export const jwt = { createJWT, isTokenValid, attachCookiesToResponse }
export const createTokenUser = createTokenUserFn
export const checkPermissions = checkPermissionsFn

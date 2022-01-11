const createTokenUser = (user: any) => {
	return { name: user.name, userId: user._id, role: user.role } as {
		name: string
		userId: string
		role: string
	}
}

export default createTokenUser

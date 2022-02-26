import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

export type UserSchemaType = {
	name: string
	email: string
	password: string
	role: "admin" | "user"
	image: string
	comparePassword: (candidatePassword: string) => boolean
}

const UserSchema = new mongoose.Schema<UserSchemaType>({
	name: {
		type: String,
		required: [true, "Please provide name"],
		maxlength: 50,
		trim: true,
	},
	email: {
		type: String,
		required: [true, "Please provide email"],
		validate: {
			validator: validator.isEmail,
			message: "Please provide valid email",
		},
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide password"],
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		required: [true, "Please provide role"],
	},
	image: {
		type: String,
	},
})

UserSchema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10)
	this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password)
	return isMatch
}

const UserModel = mongoose.model<UserSchemaType>("users", UserSchema)

export default UserModel

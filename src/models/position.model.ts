import mongoose from "mongoose"

type PositionSchemaType = {
	title: string
	description: string
	apply: string
}

const PositionSchema = new mongoose.Schema<PositionSchemaType>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title"],
		},
		description: {
			type: String,
			required: [true, "Please provide a description"],
			trim: true,
		},
		apply: {
			type: String,
			required: [true, "Please provide a way to apply"],
		},
	},
	{ timestamps: true }
)

export default mongoose.model<PositionSchemaType>("positions", PositionSchema)

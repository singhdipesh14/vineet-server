import mongoose from "mongoose"

type PhotoSchemaType = {
	title: string
	description: string
	url: string
	public_id: string
}

const PhotoSchema = new mongoose.Schema<PhotoSchemaType>(
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
		url: {
			type: String,
			required: [true, "Please provide a url"],
		},
		public_id: {
			type: String,
			required: [true, "Please provide a public_id"],
		},
	},
	{ timestamps: true }
)

export default mongoose.model<PhotoSchemaType>("photos", PhotoSchema)

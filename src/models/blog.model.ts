import mongoose, { Schema, Types } from "mongoose"

type BlogSchemaType = {
	title: string
	description: string
	user: Types.ObjectId
	categories: string[]
	tags: string[]
	readTime: number
	markdown: string
}

const BlogSchema = new mongoose.Schema<BlogSchemaType>(
	{
		title: {
			type: String,
			required: [true, "Please provide a title"],
		},
		categories: {
			type: [String],
		},
		tags: {
			type: [String],
		},
		readTime: {
			type: Number,
			required: [true, "Please provide a read time"],
		},
		markdown: {
			type: String,
			required: [true, "Please provide markdown content"],
		},
		description: {
			type: String,
			required: [true, "Please provide a description"],
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
	},
	{ timestamps: true }
)

export default mongoose.model<BlogSchemaType>("blogs", BlogSchema)

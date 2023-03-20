import mongoose, { Schema } from "mongoose";

const image = new Schema({
	category: {
		type: String,
		required: true,
		index: true,
	},
	link: {
		type: String,
		required: true,
	},
	format: {
		type: String,
		required: true,
		index: true,
	},
	fanbox: {
		type: Boolean,
		required: true,
		index: true,
	},
});

export = mongoose.model("image", image);

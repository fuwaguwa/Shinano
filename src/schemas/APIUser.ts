import mongoose, { Schema } from "mongoose";

const apiUser = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	apiKey: {
		type: String,
		required: true,
		unique: true,
	},
});

export = mongoose.model("api-user", apiUser);

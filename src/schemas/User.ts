import mongoose from "mongoose";

const user = new mongoose.Schema({
	userId: {
		type: Number,
		required: true,
		unique: true,
	},
	commandsExecuted: {
		type: Number,
		required: true,
	},
	blacklisted: {
		type: Boolean,
	},
	lastVoteTimestamp: {
		type: Number,
	},
});

export = mongoose.model("user", user);

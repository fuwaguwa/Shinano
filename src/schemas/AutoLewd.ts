import mongoose from "mongoose";

const NSFW = new mongoose.Schema({
	guildId: {
		type: String,
		unique: true,
		required: true,
	},
	channelId: {
		type: String,
		unique: true,
		required: true,
	},
	commandUserId: {
		type: String,
		unique: true,
		required: true,
	},
	paused: {
		type: Boolean,
	},
});

export = mongoose.model("autohentai", NSFW);
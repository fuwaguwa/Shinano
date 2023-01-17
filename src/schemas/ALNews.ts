import mongoose from "mongoose";

const ALNews = new mongoose.Schema({
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
});

export = mongoose.model("news", ALNews);

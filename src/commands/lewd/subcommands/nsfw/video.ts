import { ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

async function videoFetch(category) {
	const response = await fetch(
		`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/private/${category}?type=mp4`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);

	const responseJson = await response.json();
	if (!responseJson.body) return videoFetch(category);
	return responseJson.body.link;
}

export = async (interaction: ChatInputCommandInteraction) => {
	const videoCategory: string =
		interaction.options.getString("video-category") || "random";

	await interaction.editReply({ content: await videoFetch(videoCategory) });
};

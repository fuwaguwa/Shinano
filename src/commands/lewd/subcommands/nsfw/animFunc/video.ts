import { ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

async function videoFetch(category) 
{
	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/private/${category}?type=mp4`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.AmagiKey,
			},
		}
	);

	const responseJson = await response.json();
	if (!responseJson.body) return videoFetch(category);
	return responseJson.body.link;
}

export = async (interaction: ChatInputCommandInteraction, category: string) => 
{
	await interaction.editReply({ content: await videoFetch(category), });
};

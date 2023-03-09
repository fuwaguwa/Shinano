import { ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let category = interaction.options.getString("category") || "random";
	let type = interaction.options.getString("type");

	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/bomb?category=${category}&type=${type}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);
	const waifu = await response.json();

	return interaction.editReply({
		content: waifu.body.links.map(item => item.link).join("\n"),
	});
};

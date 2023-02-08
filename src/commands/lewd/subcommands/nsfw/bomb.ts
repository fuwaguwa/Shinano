import { ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let category = interaction.options.getString("category") || "random";
	if (category === "gif") category = "random&type=gif";

	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/bomb?category=${category}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.AmagiKey,
			},
		}
	);
	const waifu = await response.json();

	return interaction.editReply({
		content: waifu.links.map(item => item.link).join("\n"),
	});
};

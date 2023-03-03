import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export = async (
	interaction: ChatInputCommandInteraction,
	lewdEmbed: EmbedBuilder
) => 
{
	const response = await fetch("https://Amagi.fuwafuwa08.repl.co/nsfw/private/random", {
		method: "GET",
		headers: {
			Authorization: process.env.amagiApiKey,
		},
	});
	const waifu = await response.json();

	if (!(waifu.body.link as string).endsWith("mp4")) 
	{
		lewdEmbed.setImage(waifu.body.link);
		return interaction.editReply({ embeds: [lewdEmbed], });
	}
	return interaction.editReply({ content: waifu.body.link, });
};

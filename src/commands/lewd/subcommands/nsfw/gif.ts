import fetch from "node-fetch";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (
	interaction: ChatInputCommandInteraction,
	lewdEmbed: EmbedBuilder
) => 
{
	const gifTag: string = interaction.options.getString("gif-category");

	if (!gifTag) 
	{
		const response = await fetch(
			"https://AmagiAPI.fuwafuwa08.repl.co/nsfw/public/gif",
			{
				method: "GET",
				headers: {
					Authorization: process.env.amagiApiKey,
				},
			}
		);

		const waifu = await response.json();

		lewdEmbed.setImage(waifu.link);

		return interaction.editReply({ embeds: [lewdEmbed], });
	}

	const response = await fetch(
		`https://AmagiAPI.fuwafuwa08.repl.co/nsfw/private/${gifTag}?type=gif`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);

	const waifu = await response.json();

	lewdEmbed.setImage(waifu.link);

	return interaction.editReply({ embeds: [lewdEmbed], });
};

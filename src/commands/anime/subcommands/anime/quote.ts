import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const response = await fetch("https://some-random-api.ml/animu/quote", {
		method: "GET",
	});
	const quote = await response.json();

	const quoteEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setDescription(
			`> *${quote.sentence}*\n\n` + `**${quote.character}** - *${quote.anime}*`
		);

	await interaction.editReply({ embeds: [quoteEmbed], });
};

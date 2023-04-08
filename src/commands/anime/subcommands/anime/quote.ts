import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import SRA from "somerandomapi.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const quote = await SRA.animu.quote();

	const quoteEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setDescription(
			`> *${quote.sentence}*\n\n` + `**${quote.character}** - *${quote.anime}*`
		);

	await interaction.editReply({ embeds: [quoteEmbed], });
};

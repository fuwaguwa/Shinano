import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import SRA from "somerandomapi.js";

export default new ChatInputCommand({
	name: "joke",
	description: "Tell you a joke, may not be funny.",
	cooldown: 4500,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) interaction.deferReply();

		const jk = await SRA.others.joke();

		const jokeEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2b2d31")
			.setDescription(jk.joke);

		await interaction.editReply({ embeds: [jokeEmbed], });
	},
});

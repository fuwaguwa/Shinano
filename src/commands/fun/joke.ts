import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "joke",
	description: "Tell you a joke, may not be funny.",
	cooldown: 4500,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://some-random-api.ml/others/joke", {
			method: "GET",
		});
		const jk = await response.json();

		const jokeEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(jk.joke);

		await interaction.editReply({ embeds: [jokeEmbed], });
	},
});

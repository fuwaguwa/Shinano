import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "dadjoke",
	description: "Make a dadjoke.",
	cooldown: 4500,
	category: "Fun",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch(
			`https://dad-jokes.p.rapidapi.com/random/joke`,
			{
				method: "GET",
				headers: {
					"X-RapidAPI-Host": "dad-jokes.p.rapidapi.com",
					"X-RapidAPI-Key": process.env.rapidApiKey,
				},
			}
		);
		const dadjoke = await response.json();

		const dadjokeEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setDescription(
				`**${dadjoke.body[0].setup}**\n${dadjoke.body[0].punchline}`
			);

		await interaction.editReply({ embeds: [dadjokeEmbed] });
	},
});

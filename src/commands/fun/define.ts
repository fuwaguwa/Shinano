import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "define",
	description: "Get a word's definition from Urban Dictionary.",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "word",
			description: "The word you want to define.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		await interaction.deferReply();

		const word = interaction.options.getString("word");
		const response = await fetch(
			`https://api.urbandictionary.com/v0/define?term=${word}`,
			{
				method: "GET",
			}
		);
		const definition = await response.json();

		if (definition.list.length == 0) {
			const noResult: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(
					`❌ | No definition for the word \`${word}\` can be found!`
				);
			return interaction.editReply({ embeds: [noResult] });
		}

		const wordInfo = definition.list[0];
		const definitionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setTitle(`"${wordInfo.word}"`)
			.setDescription(wordInfo.definition)
			.setFooter({
				text: `Defintion by ${wordInfo.author} | ${wordInfo.thumbs_up} 👍 /  ${wordInfo.thumbs_down} 👎`,
			});
		if (word.toLowerCase() === "shinano")
			definitionEmbed.setImage(
				"https://cdn.donmai.us/sample/c0/37/__shinano_azur_lane_drawn_by_waa_okami__sample-c037f94c2287a60578bef71acf163865.jpg"
			);

		await interaction.editReply({ embeds: [definitionEmbed] });
	},
});

import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "owoify",
	description: "Owoify your text (WARNING: CRINGE)",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "text",
			description: "The text you want to owoify (Limit: 200 chars)",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		if (!interaction.deferred) await interaction.deferReply();

		const text: string = interaction.options.getString("text");
		if (text.length > 200) {
			const invalid: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("❌ | The text limit is 200 characters!");
			return interaction.editReply({ embeds: [invalid] });
		}

		const response = await fetch(
			`https://nekos.life/api/v2/owoify?text=${text.split(" ").join("%20")}`
		);
		const owo = (await response.json()).owo;

		const owoEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`> ${owo}\n\n` + `- ${interaction.user}`);

		await interaction.editReply({ embeds: [owoEmbed] });
	},
});

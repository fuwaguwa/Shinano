import { ChatInputCommand } from "../../structures/Command";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "pick",
	description: "Let Shinano pick for you!",
	cooldown: 3000,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "choice-1",
			description: "Choice 1.",
		},
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "choice-2",
			description: "Choice 2.",
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "choice-3",
			description: "Choice 3.",
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "choice-4",
			description: "Choice 4.",
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "choice-5",
			description: "Choice 5.",
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		const choices: string[] = [];
		for (let i = 0; i < 5; i++) 
		{
			if (interaction.options.getString(`choice-${i + 1}`))
				choices.push(interaction.options.getString(`choice-${i + 1}`));
		}

		const pickEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(
				`> **${choices.join(", ")}**\n` +
					`I pick...**${choices[Math.floor(Math.random() * choices.length)]}**!`
			);

		await interaction.reply({ embeds: [pickEmbed], });
	},
});

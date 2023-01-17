import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "roll",
	description: "Roll a random number with the set range.",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.Integer,
			required: true,
			name: "range",
			description: "Number range.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		const range = interaction.options.getInteger("range");
		const dice = Math.floor(Math.random() * range);
		await interaction.reply({ content: `You rolled: ${dice}` });
	},
});

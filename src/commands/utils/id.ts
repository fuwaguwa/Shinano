import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "id",
	description: "Get your own ID or someone else ID.",
	cooldown: 3000,
	category: "Utilities",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user that you want the ID from.",
		},
	],
	run: async ({ interaction }) => {
		const user: User = interaction.options.getUser("user") || interaction.user;

		const idEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`${user} ID: **${user.id}**`);

		await interaction.reply({ embeds: [idEmbed] });
	},
});

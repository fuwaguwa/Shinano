import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "avatar",
	description: "Get user's avatar.",
	cooldown: 3000,
	category: "Utilities",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user you want the avatar from.",
		},
	],
	run: async ({ interaction }) => {
		const user: User = interaction.options.getUser("user") || interaction.user;

		const avatarEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`${user}'s avatar`)
			.setImage(user.displayAvatarURL({ forceStatic: false, size: 1024 }))
			.setFooter({ text: `UID: ${user.id}` });

		await interaction.reply({ embeds: [avatarEmbed] });
	},
});

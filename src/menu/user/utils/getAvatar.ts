import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
import { UserCommand } from "../../../structures/Command";

export default new UserCommand({
	name: "Get Avatar",
	type: ApplicationCommandType.User,
	cooldown: 3000,
	run: async ({ interaction }) => {
		const user: GuildMember = interaction.options.data[0].member as GuildMember;

		const avatarEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`${user}'s avatar`)
			.setImage(user.displayAvatarURL({ forceStatic: false, size: 1024 }))
			.setFooter({ text: `UID: ${user.id}` });

		await interaction.reply({ embeds: [avatarEmbed] });
	},
});

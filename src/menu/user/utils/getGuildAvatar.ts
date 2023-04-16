import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
import { UserCommand } from "../../../structures/Command";

export default new UserCommand({
	name: "Get Guild Avatar",
	type: ApplicationCommandType.User,
	cooldown: 3000,
	run: async ({ interaction, client, }) => 
	{
		const user: GuildMember = interaction.options.data[0].member as GuildMember;

		const avatarEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2b2d31")
			.setDescription(`${user}'s avatar`)
			.setImage(user.displayAvatarURL({ forceStatic: false, size: 1024, }))
			.setFooter({ text: `UID: ${user.id}`, });

		await interaction.reply({ embeds: [avatarEmbed], });
	},
});

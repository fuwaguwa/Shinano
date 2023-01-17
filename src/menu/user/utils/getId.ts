import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
import { UserCommand } from "../../../structures/Command";

export default new UserCommand({
	name: "Get ID",
	cooldown: 3000,
	type: ApplicationCommandType.User,
	run: async ({ interaction }) => {
		const user: GuildMember = interaction.options.data[0].member as GuildMember;

		const idEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`${user} ID: **${user.id}**`);

		await interaction.reply({ embeds: [idEmbed] });
	},
});

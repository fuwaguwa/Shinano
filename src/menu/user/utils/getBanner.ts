import { ApplicationCommandType, EmbedBuilder, GuildMember } from "discord.js";
import { UserCommand } from "../../../structures/Command";
import fetch from "node-fetch";

export default new UserCommand({
	name: "Get Banner",
	cooldown: 3000,
	type: ApplicationCommandType.User,
	run: async ({ interaction, }) => 
	{
		const user: GuildMember = interaction.options.data[0].member as GuildMember;

		if (!interaction.deferred) await interaction.deferReply();
		const response = await fetch(
			`https://discord.com/api/v8/users/${user.id}`,
			{
				method: "GET",
				headers: {
					Authorization: `Bot ${process.env.botToken}`,
				},
			}
		);

		const received = await response.json();
		if (!received.banner) 
		{
			const failed: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("❌ | User does not have a banner.");
			return interaction.editReply({ embeds: [failed], });
		}

		let format = "png";
		if (received.banner.substring(0, 2) === "a_") format = "gif";

		const banner: EmbedBuilder = new EmbedBuilder()
			.setColor("#2b2d31")
			.setDescription(`${user}'s Banner`)
			.setImage(
				`https://cdn.discordapp.com/banners/${user.id}/${received.banner}.${format}?size=512`
			);

		await interaction.editReply({ embeds: [banner], });
	},
});

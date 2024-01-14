import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import fetch from "node-fetch";

export default new ChatInputCommand({
	name: "banner",
	description: "Get an user's banner.",
	cooldown: 3000,
	category: "Utilities",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user's you want the banner from",
		}
	],
	run: async ({ interaction, }) => 
	{
		const user: User = interaction.options.getUser("user") || interaction.user;

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

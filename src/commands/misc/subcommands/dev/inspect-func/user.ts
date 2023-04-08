import User from "../../../../../schemas/User";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const user = interaction.options.getUser("user") || interaction.user;
	const userDB = await User.findOne({ userId: user.id, });

	if (!userDB) 
	{
		const noUser: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | User does not exist in the database!");
		return interaction.editReply({ embeds: [noUser], });
	}

	const infoEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle(`${user.username}'s Info`)
		.setDescription(
			`User ID: **${userDB.userId}**\n` +
				`Blacklisted: **${userDB.blacklisted || false}**\n` +
				`Commands Executed: **${userDB.commandsExecuted}**`
		);

	await interaction.editReply({ embeds: [infoEmbed], });
};

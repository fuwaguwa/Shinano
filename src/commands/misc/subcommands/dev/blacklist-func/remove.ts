import User from "../../../../../schemas/User";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const user = await User.findOne({
		userId: interaction.options.getUser("user").id,
	});

	if (!user) 
	{
		const noOne: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("User is not blacklisted!");
		return interaction.editReply({ embeds: [noOne], });
	}
	else if (user.blacklisted) 
	{
		await user.updateOne({ blacklisted: false, });
	}
	else 
	{
		const noOne: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("User is not blacklisted!");
		return interaction.editReply({ embeds: [noOne], });
	}

	const success: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			`${interaction.options.getUser(
				"user"
			)} has been removed from the blacklist!`
		)
		.setTimestamp();

	await interaction.editReply({ embeds: [success], });
};

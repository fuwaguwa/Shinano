import User from "../../../../../schemas/User";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const user = await User.findOne({
		userId: interaction.options.getUser("user").id,
	});

	if (!user) 
	{
		await User.create({
			userId: interaction.options.getUser("user").id,
			commandsExecuted: 0,
			blacklisted: true,
		});
	}
	else if (user.blacklisted) 
	{
		const noOne: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				`${interaction.options.getUser("user")} has already been blacklisted!`
			);
		return interaction.editReply({ embeds: [noOne], });
	}
	else 
	{
		await user.updateOne({ blacklisted: true, });
	}

	const success: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			`${interaction.options.getUser("user")} has been added to blacklist!`
		)
		.addFields({
			name: "User ID",
			value: interaction.options.getUser("user").id,
		})
		.setTimestamp();

	await interaction.editReply({ embeds: [success], });
};

import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import User from "../../../../../schemas/User";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const user = await User.findOne({
		userId: interaction.options.getUser("user").id,
	});

	if (user.blacklisted) 
	{
		const blacklisted: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("Uh oh, user is blacklisted!")
			.addFields({
				name: "User:",
				value: `${interaction.options.getUser("user")}`,
			});
		await interaction.editReply({ embeds: [blacklisted], });
	}
	else 
	{
		const noOne: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("User is not blacklisted!");
		await interaction.editReply({ embeds: [noOne], });
	}
};

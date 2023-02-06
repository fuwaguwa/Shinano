import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let count = 0;
	client.guilds.cache.forEach((guild) => 
	{
		count += guild.memberCount;
	});

	const countEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setDescription(`Total Guild Members: **${count.toLocaleString()}**`);

	await interaction.editReply({ embeds: [countEmbed], });
};

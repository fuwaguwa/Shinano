import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let count = 0;
	let allGuilds = [];
	client.guilds.cache.forEach((guild) => 
	{
		count += guild.memberCount;

		allGuilds.push({
			name: guild.name,
			id: guild.id,
			memberCount: guild.memberCount,
		});
	});

	allGuilds.sort((a, b) => b.memberCount - a.memberCount);

	const countEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setDescription(`Total Guild Members: **${count.toLocaleString()}**`)
		.addFields({
			name: "Top Guild:",
			value:
				`Guild Name: **${allGuilds[0].name}**\n` +
				`Guild ID: **${allGuilds[0].id}**\n` +
				`Guild Member Count: **${allGuilds[0].memberCount}**`,
		});

	await interaction.editReply({ embeds: [countEmbed], });
};

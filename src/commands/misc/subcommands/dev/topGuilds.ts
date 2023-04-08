import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";
import { ShinanoPaginator } from "../../../../lib/Pages";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const guildNum: number = interaction.options.getInteger("guild-num") || 10;
	const allGuilds = [];
	const topGuildEmbeds: EmbedBuilder[] = [];

	if (guildNum > client.guilds.cache.size) 
	{
		const error: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				`❌ | Shinano is only in **${client.guilds.cache.size}** guilds!`
			);
		return interaction.editReply({ embeds: [error], });
	}

	client.guilds.cache.forEach((guild) => 
	{
		allGuilds.push({
			name: guild.name,
			id: guild.id,
			memberCount: guild.memberCount,
		});
	});

	allGuilds.sort((a, b) => b.memberCount - a.memberCount);

	for (let i = 0; i < guildNum; i++) 
	{
		const guild = allGuilds[i];

		topGuildEmbeds.push(
			new EmbedBuilder()
				.setColor("#2b2d31")
				.setTitle("Top Shinano Guild")
				.addFields({
					name: guild.name,
					value:
						`ID: **${guild.id}**\n` + `Member Count: **${guild.memberCount}**`,
				})
		);
	}

	ShinanoPaginator({
		interaction: interaction,
		interactorOnly: true,
		pages: topGuildEmbeds,
		time: 60000,
	});
};

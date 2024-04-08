import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Enemy } from "genshin-db";
import { toTitleCase } from "../../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction, enemy: Enemy) => 
{
	/**
	 * Drops
	 */
	const possibleDrops: string[] = [];
	enemy.rewardPreview.forEach((reward) => 
	{
		if (!possibleDrops.includes(reward.name)) possibleDrops.push(reward.name);
	});

	/**
	 * Displaying data
	 */
	const enemyEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle(`${enemy.name} | ${enemy.specialNames[0]}`)
		.setDescription(`*${enemy.description}*`)
		.addFields(
			{
				name: "Enemy Type:",
				value: `${toTitleCase(enemy.enemyType.toLowerCase())}`,
			},
			{
				name: "Enemy Category:",
				value: enemy.categoryText,
			},
			{
				name: "Enemy Drops:",
				value: possibleDrops.join("\n"),
			}
		);

	await interaction.editReply({ embeds: [enemyEmbed], });
};

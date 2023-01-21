import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Enemy } from "genshin-db";
import { toTitleCase } from "../../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction, enemy: Enemy) => 
{
	/**
	 * Drops
	 */
	const possibleDrops: string[] = [];
	enemy.rewardpreview.forEach((reward) => 
	{
		if (!possibleDrops.includes(reward.name)) possibleDrops.push(reward.name);
	});

	/**
	 * Displaying data
	 */
	const enemyEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle(`${enemy.name} | ${enemy.specialname}`)
		.setDescription(`*${enemy.description}*`)
		.addFields(
			{
				name: "Enemy Type:",
				value: `${toTitleCase(enemy["enemytype"].toLowerCase())}`,
			},
			{
				name: "Enemy Category:",
				value: enemy.category,
			},
			{
				name: "Enemy Drops:",
				value: possibleDrops.join("\n"),
			}
		);

	await interaction.editReply({ embeds: [enemyEmbed], });
};

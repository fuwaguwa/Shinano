import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Enemy } from "genshin-db";

export = async (interaction: ChatInputCommandInteraction, enemy: Enemy) => {
	/**
	 * Processing
	 */
	let level: number = interaction.options.getInteger("enemy-level");

	if (level < 1) level = 1;
	if (level > 100) level = 100;

	const enemyStats = enemy.stats(level);

	/**
	 * Displaying
	 */
	const enemyStatsEmbed: EmbedBuilder = new EmbedBuilder()
		.setTitle(`${enemy.name} | Level ${level}`)
		.setColor("#2f3136")
		.addFields({
			name: "Enemy's Stats:",
			value:
				`HP: **${enemyStats.hp.toFixed(2)} HP**\n` +
				`ATK: **${enemyStats.attack.toFixed(2)} ATK**\n` +
				`DEF: **${enemyStats.defense.toFixed(2)} DEF**`,
		});
	await interaction.editReply({ embeds: [enemyStatsEmbed] });
};

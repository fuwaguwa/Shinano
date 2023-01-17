import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import genshin, { Enemy } from "genshin-db";
import info from "./enemies-func/info";
import stats from "./enemies-func/stats";

export = async (interaction: ChatInputCommandInteraction) => {
	const enemyName: string = interaction.options
		.getString("enemy-name")
		.toLowerCase();
	const enemy: Enemy = genshin.enemies(enemyName);

	if (!enemy) {
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No enemy found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	switch (interaction.options.getSubcommand()) {
		case "info": {
			return info(interaction, enemy);
		}

		case "stats": {
			return stats(interaction, enemy);
		}
	}
};

import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import genshin from "genshin-db";
import info from "./weapon-func/info";
import stats from "./weapon-func/stats";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const weaponName: string = interaction.options
		.getString("weapon-name")
		.toLowerCase();
	const weapon = genshin.weapons(weaponName);

	if (!weapon) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No weapon found!");
		await interaction.editReply({ embeds: [noResult], });
	}

	switch (interaction.options.getSubcommand()) 
	{
		case "info": {
			return info(interaction, weapon);
		}

		case "stats": {
			return stats(interaction, weapon);
		}
	}
};

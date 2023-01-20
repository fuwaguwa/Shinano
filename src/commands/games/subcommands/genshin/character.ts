import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import genshin from "genshin-db";
import info from "./character-func/info";
import stats from "./character-func/stats";
import talents from "./character-func/talents";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const charName: string = interaction.options
		.getString("character-name")
		.toLowerCase();
	const character = genshin.characters(charName);

	if (!character) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No character found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	switch (interaction.options.getSubcommand()) 
	{
		case "info": {
			return info(interaction, character);
		}

		case "stats": {
			return stats(interaction, character);
		}

		case "talents": {
			return talents(interaction);
		}
	}
};

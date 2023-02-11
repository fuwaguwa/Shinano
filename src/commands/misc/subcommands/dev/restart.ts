import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { restartBot } from "../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const restarting: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription("✅ | Restarting Shinano...");
	await interaction.editReply({ embeds: [restarting], });

	restartBot();
};

import { EmbedBuilder } from "discord.js";
import { getWaifuReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "blush",
	description: "Give someone a warm hug.",
	cooldown: 4000,
	category: "Reactions",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(await getWaifuReactionGIF(interaction.commandName))
			.setDescription(`${interaction.user} blushed!`);

		await interaction.editReply({ embeds: [reactionEmbed], });
	},
});

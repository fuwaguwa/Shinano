import { EmbedBuilder } from "discord.js";
import { getNekoReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "think",
	description: "🤔",
	cooldown: 4000,
	category: "Reactions",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`${interaction.user} is cooking up something malicious...`)
			.setImage(await getNekoReactionGIF(interaction.commandName));

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

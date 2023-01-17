import { EmbedBuilder } from "discord.js";
import { getNekoReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "sleep",
	description: "💤💤💤",
	cooldown: 4000,
	category: "Reactions",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`Shh...${interaction.user} is sleeping!`)
			.setImage(await getNekoReactionGIF(interaction.commandName));

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

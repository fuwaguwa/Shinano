import { EmbedBuilder } from "discord.js";
import neko from "nekos-fun";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "baka",
	description: "Y-You idiot!",
	cooldown: 4000,
	category: "Reactions",
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const bakaEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(await neko.sfw.baka());

		await interaction.editReply({ embeds: [bakaEmbed] });
	},
});

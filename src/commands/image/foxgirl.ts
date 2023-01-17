import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "foxgirl",
	description: "If you love me, you'll love them too (SFW)",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://nekos.best/api/v2/kitsune");
		const kitsunePic = await response.json();

		const foxgirlEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
			})
			.setTimestamp()
			.setImage(kitsunePic.results[0].url);

		await interaction.editReply({ embeds: [foxgirlEmbed] });
	},
});

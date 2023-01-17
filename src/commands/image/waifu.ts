import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "waifu",
	description: "Looking for waifus?",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const response = await fetch("https://nekos.best/api/v2/waifu");
		const waifu = await response.json();

		const waifuEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
			})
			.setTimestamp()
			.setImage(waifu.results[0].url);

		await interaction.editReply({ embeds: [waifuEmbed] });
	},
});

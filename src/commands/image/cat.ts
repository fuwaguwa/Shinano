import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "cat",
	description: "Get an image of a cat!",
	cooldown: 4000,
	category: "Image",
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://api.thecatapi.com/v1/images/search", {
			method: "GET",
		});
		const cat = await response.json();

		const catEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(cat[0].url)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
			});

		await interaction.editReply({ embeds: [catEmbed] });
	},
});

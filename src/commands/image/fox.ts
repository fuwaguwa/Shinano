import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "fox",
	description: "Generate an image of a fox!",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://randomfox.ca/floof/", {
			method: "GET",
		});
		const fox = await response.json();

		const foxEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(fox.image)
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		await interaction.editReply({ embeds: [foxEmbed], });
	},
});

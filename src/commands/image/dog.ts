import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "dog",
	description: "Get an image of a dog!",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://api.thedogapi.com/v1/images/search", {
			method: "GET",
		});
		const dog = await response.json();

		const dogEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(dog[0].url)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: true, }),
			});

		await interaction.editReply({ embeds: [dogEmbed], });
	},
});

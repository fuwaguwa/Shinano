import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";
import neko from "nekos-fun";

export default new ChatInputCommand({
	name: "kemonomimi",
	description: "Girls with animal features (SFW)",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const kemonomimiEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			})
			.setTimestamp()
			.setImage(await neko.sfw.animalEars());

		await interaction.editReply({ embeds: [kemonomimiEmbed], });
	},
});

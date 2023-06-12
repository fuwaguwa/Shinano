import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "husbando",
	description: "Looking for husbandos?",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://nekos.best/api/v2/husbando");
		const husbando = await response.json();

		const husbandoEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			})
			.setTimestamp()
			.setImage(husbando.results[0].url);

		const imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(husbando.results[0].url),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji({ name: "🔍", })
				.setLabel("Get Sauce")
				.setCustomId("SAUCE")
		);

		await interaction.editReply({
			embeds: [husbandoEmbed],
			components: [imageInfo],
		});
	},
});

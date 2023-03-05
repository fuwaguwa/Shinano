import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
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

		const link = await neko.sfw.animalEars();
		const kemonomimiEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			})
			.setTimestamp()
			.setImage(link);

		const imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(link),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji({ name: "🔍", })
				.setLabel("Get Sauce")
				.setCustomId("SAUCE")
		);

		await interaction.editReply({
			embeds: [kemonomimiEmbed],
			components: [imageInfo],
		});
	},
});

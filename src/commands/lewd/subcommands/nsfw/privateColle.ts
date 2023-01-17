import Collection from "../../../../schemas/PrivateCollection";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";

export = async (
	interaction: ChatInputCommandInteraction,
	lewdEmbed: EmbedBuilder,
	category: string
) => {
	const data = await Collection.findOne({ type: category });
	const image = data.links[Math.floor(Math.random() * data.size)];

	if (!(image.link as string).endsWith("mp4")) {
		lewdEmbed.setImage(image.link);

		const imageLink = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗" })
				.setLabel("Image Link")
				.setURL(image.link)
		);

		return interaction.editReply({
			embeds: [lewdEmbed],
			components: [imageLink],
		});
	}
	return interaction.editReply({ content: image.link });
};

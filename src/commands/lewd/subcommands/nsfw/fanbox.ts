import {
	ActionRowBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
} from "discord.js";
import Collection from "../../../../schemas/PrivateCollection";

export = async (
	interaction: ChatInputCommandInteraction,
	lewdEmbed: EmbedBuilder
) => {
	const tags = [
		"elf",
		"genshin",
		"kemonomimi",
		"shipgirls",
		"undies",
		"misc",
		"uniform",
	];
	const tag =
		interaction.options.getString("fanbox-category") ||
		tags[Math.floor(Math.random() * tags.length)];

	const data = await Collection.findOne({ type: tag });
	const response = data.links.filter((item) => item.link.includes("_FANBOX"));
	const item = response[Math.floor(Math.random() * response.length)];

	lewdEmbed.setImage(item.link);
	const imageLink: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗" })
				.setLabel("Image Link")
				.setURL(item.link)
		);

	return interaction.editReply({
		embeds: [lewdEmbed],
		components: [imageLink],
	});
};

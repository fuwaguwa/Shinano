import Collection from "../../../../schemas/PrivateCollection";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

export = async (
	interaction: ChatInputCommandInteraction,
	lewdEmbed: EmbedBuilder,
	category: string
) => 
{
	if (category === "random") 
	{
		const allCategories = [
			"elf",
			"genshin",
			"misc",
			"shipgirls",
			"undies",
			"uniform",
			"kemonomimi"
		];

		category = allCategories[Math.floor(Math.random() * allCategories.length)];
	}

	const data = await Collection.findOne({ type: category, });
	const image = data.links[Math.floor(Math.random() * data.size)];

	if (!(image.link as string).endsWith("mp4")) 
	{
		lewdEmbed.setImage(image.link);

		const imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(image.link),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji({ name: "🔍", })
				.setLabel("Get Sauce")
				.setCustomId("SAUCE")
		);

		return interaction.editReply({
			embeds: [lewdEmbed],
			components: [imageInfo],
		});
	}
	return interaction.editReply({ content: image.link, });
};

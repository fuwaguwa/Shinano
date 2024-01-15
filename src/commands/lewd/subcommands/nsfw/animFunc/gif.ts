import fetch from "node-fetch";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
import { LoadableNSFWInteraction } from "../../../../../typings/Sauce";
import Image from "../../../../../schemas/Image";
import { queryDefault } from "../../../../../lib/Lewdies";

export = async (
	interaction: LoadableNSFWInteraction,
	load: ActionRowBuilder<ButtonBuilder>,
	category?: string,
	mode?: string
) => 
{
	const lewdEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Random")
		.setFooter({
			text: `Requested by ${interaction.user.username}`,
			iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
		});

	let url;
	if (!category) 
	{
		url = await queryDefault("gif");
	}
	else 
	{
		const image = (
			await Image.aggregate([
				{ $match: { category: category, format: "gif", }, },
				{ $sample: { size: 1, }, }
			])
		)[0];

		url = image.link;
	}

	const imageLink: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(url)
		);
	lewdEmbed.setImage(url).setColor("Random");

	return mode === "followUp"
		? await interaction.followUp({
			embeds: [lewdEmbed],
			components: [imageLink, load],
		  })
		: await interaction.editReply({
			embeds: [lewdEmbed],
			components: [imageLink, load],
		  });
};

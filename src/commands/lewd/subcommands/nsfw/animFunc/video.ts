import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { LoadableNSFWInteraction } from "../../../../../typings/Sauce";
import Image from "../../../../../schemas/Image";

export = async (
	interaction: LoadableNSFWInteraction,
	category: string,
	load: ActionRowBuilder<ButtonBuilder>,
	mode?: string
) => 
{
	let match = {
		format: "mp4",
	};

	if (category !== "random") Object.assign(match, { category: category, });

	const image = (
		await Image.aggregate([{ $match: match, }, { $sample: { size: 1, }, }])
	)[0];

	return mode === "followUp"
		? await interaction.followUp({
			content: image.link,
			components: [load],
		  })
		: await interaction.editReply({
			content: image.link,
			components: [load],
		  });
};

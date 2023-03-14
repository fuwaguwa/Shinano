import {
	ActionRowBuilder,
	ButtonBuilder
} from "discord.js";
import fetch from "node-fetch";
import { LoadableNSFWInteraction } from "../../../../../typings/Sauce";

async function videoFetch(category) 
{
	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/private/${category}?type=mp4`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);

	const responseJson = await response.json();
	if (!responseJson.body) return videoFetch(category);
	return responseJson.body.link;
}

export = async (
	interaction: LoadableNSFWInteraction,
	category: string,
	load: ActionRowBuilder<ButtonBuilder>,
	mode?: string
) => 
{
	return mode === "followUp"
		? await interaction.followUp({
			content: await videoFetch(category),
			components: [load],
		  })
		: await interaction.editReply({
			content: await videoFetch(category),
			components: [load],
		  });
};

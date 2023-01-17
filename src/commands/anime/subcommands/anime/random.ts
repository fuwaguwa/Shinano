import fetch from "node-fetch";
import { animeInfo } from "../../../../lib/Anime";
import { ChatInputCommandInteraction } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => {
	const response = await fetch(
		`https://api.jikan.moe/v4/random/anime?sfw=true`,
		{ method: "GET" }
	);
	const anime = (await response.json()).data;

	await animeInfo(anime, interaction);
};

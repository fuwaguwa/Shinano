import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	StringSelectMenuBuilder
} from "discord.js";
import { ShinanoPaginator } from "./Pages";

/**
 * Display a menu for information about an anime
 * @param anime anime info
 * @param interaction ChatInputCommandInteraction
 * @param menu StringSelectMenu
 */
export async function animeInfo(
	anime,
	interaction: ChatInputCommandInteraction,
	menu?: ActionRowBuilder<StringSelectMenuBuilder>
) 
{
	let genres: string[] = [];
	anime.genres.forEach(genre => genres.push(genre.name));

	let studios: string[] = [];
	anime.studios.forEach(studio =>
		studios.push(`[${studio.name}](${studio.url})`)
	);

	const startDate = Math.floor(new Date(anime.aired.from).getTime() / 1000);
	const endDate = Math.floor(new Date(anime.aired.to).getTime() / 1000);

	const synopsisEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setThumbnail(anime.images.jpg.large_image_url)
		.setTitle(`${anime.title} | Synopsis`)
		.setDescription(`*${anime.synopsis || "No Sypnosis Can Be Found"}*`);
	const generalInfoEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setThumbnail(anime.images.jpg.large_image_url)
		.setTitle(`${anime.title} | General Info`)
		.addFields(
			{
				name: "MyAnimeList Info:",
				value:
					`**ID**: [${anime.mal_id}](${anime.url})\n` +
					`**Rating**: ${anime.score} ⭐\n` +
					`**Ranking**: #${anime.rank}\n` +
					`**Favorites**: ${anime.favorites}\n` +
					`**Popularity**: #${anime.popularity}\n`,
			},
			{
				name: "Anime Info:",
				value:
					`**Rating**: ${anime.rating}\n` +
					`**Genres**: ${genres.join(", ")}\n` +
					`**JP Title**: ${
						anime.title_japanese ? anime.title_japanese : "None"
					}\n` +
					`**Trailer**: ${
						anime.trailer.url ? `[Trailer Link](${anime.trailer.url})` : "None"
					}\n` +
					`**Studio**: ${studios.join(", ")}\n`,
			},
			{
				name: "Episodes Info:",
				value:
					`**Status**: ${anime.status}\n` +
					`**Episodes**: ${anime.episodes}\n` +
					`**Duration**: ${anime.duration}\n` +
					`**Start Date**: <t:${startDate}>\n` +
					`**End Date**: ${
						endDate == 0 ? "Ongoing Anime" : `<t:${endDate}>`
					}\n`,
			}
		);

	if (menu) 
	{
		await ShinanoPaginator({
			interaction,
			interactorOnly: true,
			time: 120000,
			menu: menu,
			pages: [synopsisEmbed, generalInfoEmbed],
		});
	}
	else 
	{
		await ShinanoPaginator({
			interaction,
			interactorOnly: true,
			time: 120000,
			pages: [synopsisEmbed, generalInfoEmbed],
		});
	}
}

/**
 * Display a menu for information about an anime character
 * @param character character info
 * @param VAs character's voice actors
 */
export async function characterInfo(character, VAs) 
{
	const characterEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Random")
		.setTitle(
			`${character.name} | ${
				character.name_kanji ? character.name_kanji : "No Kanji Name"
			}`
		)
		.setThumbnail(character.images.jpg.image_url)
		.setDescription(character.about ? character.about : "No Biography Found");

	if (character.anime.length != 0) 
	{
		characterEmbed.addFields(
			{
				name: "Extra Info:",
				value:
					`**Anime**: [${character.anime[0].anime.title}](${character.anime[0].anime.url})\n` +
					`**Voice Actors**: ${VAs.length != 0 ? VAs.join("; ") : "None"}\n` +
					`**Nicknames**: ${
						character.nicknames.length != 0
							? character.nicknames.join(", ")
							: "None"
					}`,
			},
			{
				name: "MyAnimeList Info",
				value:
					`**ID**: [${character.mal_id}](${character.url})\n` +
					`**Favorites**: ${character.favorites}`,
			}
		);
	}
	else 
	{
		characterEmbed.addFields({
			name: "MyAnimeList Info",
			value:
				`**ID**: [${character.mal_id}](${character.url})\n` +
				`**Favorites**: ${character.favorites}`,
		});
	}
	return characterEmbed;
}

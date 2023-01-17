import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import animeFunc from "./subcommands/animeSubs";

export default new ChatInputCommand({
	name: "anime",
	description: "Get information about animes and its characters!",
	cooldown: 4500,
	category: "Anime",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "search",
			description: "Search up information of an anime on MyAnimeList",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "name",
					description: "The anime's name (Japanese name is recommended).",
				},
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "type",
					description: "The type of the anime",
					choices: [
						{ name: "TV", value: "tv" },
						{ name: "Movie", value: "movie" },
						{ name: "OVA (Original Video Animation)", value: "ova" },
						{ name: "ONA (Original Net Animation)", value: "ona" },
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "character",
			description: "Search up information of an anime character on MyAnimeList",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "name",
					description: "The character name.",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "quote",
			description:
				"Send you an edgy, funny, motivational or straight up random anime quote.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "random",
			description: "Return a random anime.",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case "character": {
				return animeFunc.character(interaction);
			}

			case "quote": {
				return animeFunc.quote(interaction);
			}

			case "random": {
				return animeFunc.random(interaction);
			}

			case "search": {
				return animeFunc.search(interaction);
			}
		}
	},
});

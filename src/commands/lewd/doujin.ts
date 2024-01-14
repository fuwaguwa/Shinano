import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import doujinFunc from "./subcommands/doujinSubs";

export default new ChatInputCommand({
	name: "doujin",
	description: "Search up an doujin on the most popular doujin site.",
	nsfw: true,
	cooldown: 5000,
	category: "NSFW",
	ownerOnly: true,
	defaultMemberPermissions: "0",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "code",
			description: "Search up an doujin with the 6-digits code.",
			options: [
				{
					type: ApplicationCommandOptionType.Integer,
					required: true,
					name: "doujin-code",
					description: "The doujin's code.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "search",
			description: "Search up an doujin on the most popular H-manga website.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "search-query",
					description: "Search query (title, artists, groups, tags, etc).",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "sorting",
					description: "The search sorting.",
					choices: [
						{ name: "Popular All-Time", value: "popular", },
						{ name: "Popular Weekly", value: "popular-weekly", },
						{ name: "Popular Today", value: "popular-today", },
						{ name: "Recent", value: "recent", }
					],
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();
		switch (interaction.options.getSubcommand()) 
		{
			case "code": {
				return doujinFunc.code(interaction);
			}

			case "search": {
				return doujinFunc.search(interaction);
			}
		}
	},
});

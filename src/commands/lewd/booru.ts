import { ChatInputCommand } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import { searchBooru } from "../../lib/Booru";
import { checkNSFW } from "../../lib/Utils";

export default new ChatInputCommand({
	name: "booru",
	description: "Search for content on booru image boards!",
	voteRequired: false,
	cooldown: 8000,
	category: "NSFW",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "gelbooru",
			description: "Search for an image on the Gelbooru image board!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "tag-1",
					description:
						"Tag for the image/animation, e.g: shinano_(azur_lane), jean_(genshin_impact)",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-2",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-3",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-4",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-5",
					description: "Tag for the image/animation",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "r34",
			description: "Search for an image on the Rule34 image board!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "tag-1",
					description:
						"Tag for the image/animation, e.g: shinano_(azur_lane), jean_(genshin_impact)",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-2",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-3",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-4",
					description: "Tag for the image/animation",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-5",
					description: "Tag for the image/animation",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "realbooru",
			description: "Search for an image on the Realbooru image board!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "tag-1",
					description: "Tag for the image/video, e.g: onlyfans, japanese",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-2",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-3",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-4",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-5",
					description: "Tag for the image/video",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "safebooru",
			description: "Search for an image on the Safebooru image board!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "tag-1",
					description: "Tag for the image/video, e.g: shinano_(azur_lane), jean_(genshin_impact)",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-2",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-3",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-4",
					description: "Tag for the image/video",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "tag-5",
					description: "Tag for the image/video",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const site = interaction.options.getSubcommand();
		if (site !== "safebooru" && !(await checkNSFW(interaction))) return;

		const query: string[] = [];
		for (let i = 0; i < 5; i++) 
		{
			const tag = interaction.options.getString(`tag-${i + 1}`);
			if (tag) query.push(tag);
		}

		return searchBooru(interaction, query, site);
	},
});

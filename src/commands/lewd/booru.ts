import { ChatInputCommand } from "../../structures/Command";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
import { searchBooru } from "../../lib/Booru";
const booru = require("booru");

export default new ChatInputCommand({
	name: "booru",
	description: "Search for content on booru image boards!",
	nsfw: true,
	voteRequired: false,
	cooldown: 5555,
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
					description: "Tag for the image/video, e.g: onlyfans, jav",
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

		const query: string[] = [];
		for (let i = 0; i < 5; i++)
		{
			const tag = interaction.options.getString(`tag-${i + 1}`);
			if (tag) query.push(tag);
		}

		const site = interaction.options.getSubcommand();

		return searchBooru(interaction, query, site);
	},
});

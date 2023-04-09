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
					name: "tags",
					description:
						"Tags for the image/animation, seperate the tags by commas, e.g: shinano_(azur_lane), thighs",
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
					name: "tags",
					description:
						"Tags for the image/animation, seperate the tags by commas, e.g: shinano_(azur_lane), thighs",
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
					name: "tags",
					description:
						"Tags for the image/video, seperate the tags by commas, e.g: onlyfans, japanese",
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
					name: "tags",
					description:
						"Tags for the image/animation, seperate the tags by commas, e.g: shinano_(azur_lane), thighs",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const site = interaction.options.getSubcommand();
		if (site !== "safebooru" && !(await checkNSFW(interaction))) return;

		const query: string[] = interaction.options
			.getString("tags")
			.split(",")
			.map(tag => tag.trim());

		return searchBooru(interaction, query, site);
	},
});

import { ApplicationCommandOptionType } from "discord.js";
import { findSauce } from "../../lib/Sauce";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "sauce",
	description: "Get the sauce for an image.",
	nsfw: true,
	cooldown: 5000,
	category: "NSFW",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "link",
			description: "Get the sauce for an image/gif with a raw link.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "link",
					description: "RAW image link.",
					required: true,
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "file",
			description: "Get the sauce for an image/gif by uploading it.",
			options: [
				{
					type: ApplicationCommandOptionType.Attachment,
					name: "image",
					description: "Image.",
					required: true,
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		let link: string;
		interaction.options.getSubcommand() === "link"
			? (link = interaction.options.getString("link"))
			: (link = interaction.options.getAttachment("image").proxyURL);

		await findSauce({ interaction, link, ephemeral: false, });
	},
});

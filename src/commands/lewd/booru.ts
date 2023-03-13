import { ChatInputCommand } from "../../structures/Command";
import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
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
		let siteUrl;
		switch (site) 
		{
			case "gelbooru":
				siteUrl = "https://gelbooru.com/index.php?page=post&s=view&id=";
				break;
			case "r34":
				siteUrl = "https://rule34.xxx/index.php?page=post&s=view&id=";
				break;
			case "realbooru":
				siteUrl = "https://realbooru.com/index.php?page=post&s=view&id=";
				break;
		}

		const obligatory: string[] = [
			"sort:score",
			"-loli",
			"-shota",
			"-furry",
			"-scat",
			"-amputee",
			"-vomit",
			"-insect",
			"-bestiality",
			"-futanari",
			"-ryona",
			"-death",
			"-vore",
			"-torture",
			"-pokephilia"
		];
		const booruResult = await booru.search(site, query.concat(obligatory), {
			limit: 1,
			random: true,
		});

		if (booruResult.length == 0) 
		{
			const noResult: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("❌ | No result found!");
			return interaction.editReply({ embeds: [noResult], });
		}

		const result = booruResult[0];

		let message = "**Post Tags**: ||";
		result.tags.forEach((tag) => 
		{
			message += ` \`${tag}\` `;
		});
		message += "||";

		const links: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel("Post Link")
					.setEmoji({ name: "🔗", })
					.setURL(siteUrl + result.id)
			);
		if (result.source) 
		{
			links.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel("Sauce Link")
					.setEmoji({ name: "🔍", })
					.setURL(result.source)
			);
		}

		if ([".mp4", "webm"].includes(result.fileUrl.slice(-4))) 
		{
			return interaction.editReply({
				content: message + "\n\n" + result.fileUrl,
				components: [links],
			});
		}

		const booruEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(result.fileUrl)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		if (message.length > 2000)
			return interaction.editReply({
				content: message,
				embeds: [booruEmbed],
				components: [links],
			});

		booruEmbed.setDescription(message);
		await interaction.editReply({ embeds: [booruEmbed], components: [links], });
	},
});

import {
	ApplicationCommandOptionType,
	ChannelType,
	EmbedBuilder
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import nsfwFunc from "./subcommands/nsfwSubs";
import { checkMutual } from "../../lib/Utils";

export default new ChatInputCommand({
	name: "nsfw",
	description: "NSFW Commands - Anime & IRL",
	cooldown: 4500,
	nsfw: true,
	voteRequired: true,
	category: "NSFW",
	defaultMemberPermissions: "0",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "hquality",
			description: "High quality images.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "hquality-category",
					description:
						"The category of high res content from. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls", value: "shipgirls", },
						{ name: "Undies ⭐", value: "undies", },
						{ name: "Uniform ⭐", value: "uniform", },
						{ name: "Genshin ⭐", value: "genshin", },
						{ name: "Honkai", value: "honkai", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "bomb",
			description: "Bombs you with lewdness!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "category",
					description:
						"The category you want to be bombed with. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls", value: "shipgirls", },
						{ name: "Undies", value: "undies", },
						{ name: "Genshin", value: "genshin", },
						{ name: "Honkai", value: "honkai", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", },
						{ name: "Uniform", value: "uniform", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "hquality-bomb",
			description: "Bombs you with XTRA lewdness!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "category",
					description:
						"The category you want to be bombed with. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls", value: "shipgirls", },
						{ name: "Undies ⭐", value: "undies", },
						{ name: "Uniform ⭐", value: "uniform", },
						{ name: "Genshin ⭐", value: "genshin", },
						{ name: "Honkai", value: "honkai", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "animation",
			description: "When pictures are not enough...",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "type",
					required: true,
					description: "File type. Ignore this option for random file type.",
					choices: [
						{ name: "Video", value: "video", },
						{ name: "GIF", value: "gif", },
						{ name: "Random", value: "random", }
					],
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "category",
					description:
						"The category you want animations from. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls ⭐", value: "shipgirls", },
						{ name: "Genshin ⭐", value: "genshin", },
						{ name: "Undies", value: "undies", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", },
						{ name: "Uniform", value: "uniform", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "animation-bomb",
			description: "Bombs you with animations!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "type",
					required: true,
					description: "File type. Ignore this option for random file type.",
					choices: [
						{ name: "Video", value: "mp4", },
						{ name: "GIF", value: "gif", },
						{ name: "Random", value: "animation", }
					],
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "category",
					description:
						"The category you want animations from. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls ⭐", value: "shipgirls", },
						{ name: "Genshin ⭐", value: "genshin", },
						{ name: "Undies", value: "undies", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", },
						{ name: "Uniform", value: "uniform", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "anal",
			description: "There's more than one hole.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "ass",
			description: "Big booty.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "thighs",
			description: "The best part of the leg.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "paizuri",
			description: "Squished between thiccness.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "cum",
			description: "Baby gravy.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "random",
			description: "Return images/GIFs/videos from a random category.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "blowjob",
			description: "Girls \"playing the trumpet\"",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "genshin",
			description: "Genshin Girls!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "honkai",
			description: "Honkai girls, from both series!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "undies",
			description:
				"Undies, sportwears, swimsuits, bodysuits and stockings/thigh highs.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "kemonomimi",
			description: "Fox girls, cat girls, bunny girls, succubus and more!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "uniform",
			description: "Maid, Office Lady, JK, you name it!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "shipgirls",
			description: "Shipgirls from Azur Lane!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "nekomimi",
			description: "Catgirls!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "feet",
			description: "Shinano will not question your kink.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "boobs",
			description: "Girls with huge jugs!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "misc",
			description: "Categories that are not mentioned here!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "pussy",
			description: "😺🐈",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "irl",
			description: "Not interested in anime girls? No problem!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "category",
					description: "Category",
					choices: [
						{ name: "random", value: "random", },
						{ name: "thigh", value: "thigh", },
						{ name: "ass", value: "ass", },
						{ name: "anal", value: "anal", },
						{ name: "blowjob", value: "blowjob", },
						{ name: "boobs", value: "boobs", },
						{ name: "feet", value: "feet", },
						{ name: "gone wild", value: "gonewild", },
						{ name: "pussy", value: "pussy", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "autohentai",
			description: "Automatically post hentai!",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "set",
					description:
						"Automatically post hentai into a channel every 5 minutes!",
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							channelTypes: [ChannelType.GuildText],
							required: true,
							name: "channel",
							description: "Channel for autohentai.",
						}
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "stop",
					description: "Stop autohentai job in the server.",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();
		const lewdEmbed: EmbedBuilder = new EmbedBuilder().setFooter({
			text: `Requested by ${interaction.user.username}`,
			iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
		});

		/**
		 * Processing Command
		 */
		if (interaction.options["_group"]) 
		{
			if (await checkMutual(interaction))
				return nsfwFunc.autohentai(interaction);
		}
		else 
		{
			const subcommand = interaction.options.getSubcommand();
			if (subcommand !== "irl") 
			{
				switch (subcommand) 
				{
					case "bomb": {
						return nsfwFunc.bomb(interaction);
					}

					case "hquality-bomb": {
						if (await checkMutual(interaction))
							return nsfwFunc.hqualityBomb(interaction);
						break;
					}

					case "animation-bomb": {
						if (await checkMutual(interaction))
							return nsfwFunc.bomb(interaction);
						break;
					}

					case "animation": {
						const fileType: string =
							interaction.options.getString("type") === "random"
								? ["video", "gif"][Math.floor(Math.random() * 2)]
								: interaction.options.getString("type");
						const category: string =
							interaction.options.getString("category") || "random";

						return nsfwFunc.animation(interaction, fileType, category);
					}

					case "hquality": {
						const tags = [
							"elf",
							"genshin",
							"kemonomimi",
							"shipgirls",
							"undies",
							"misc",
							"uniform"
						];
						const tag =
							interaction.options.getString("hquality-category") ||
							tags[Math.floor(Math.random() * tags.length)];

						return nsfwFunc.hquality(interaction, lewdEmbed, tag);
					}

					case "elf":
					case "genshin":
					case "kemonomimi":
					case "misc":
					case "shipgirls":
					case "undies":
					case "uniform":
					case "honkai":
					case "random": {
						return nsfwFunc.privateColle(
							interaction,
							lewdEmbed,
							interaction.options.getSubcommand()
						);
					}

					default: {
						let tag = interaction.options.getSubcommand();

						if (tag === "solo") tag = "masturbation";

						return nsfwFunc.def(interaction, lewdEmbed, tag);
					}
				}
			}
			else 
			{
				let tag = interaction.options.getString("category");

				return nsfwFunc.irl(interaction, lewdEmbed, tag);
			}
		}
	},
});

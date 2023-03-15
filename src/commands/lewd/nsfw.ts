import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import nsfwFunc from "./subcommands/nsfwSubs";
import { client } from "../../index";

async function checkMutual(interaction: ChatInputCommandInteraction) 
{
	if (interaction.user.id !== "836215956346634270") 
	{
		try 
		{
			const guild = await client.guilds.fetch(
				process.env.guildId || "1020960562710052895"
			);
			await guild.members.fetch(interaction.user.id);
		}
		catch (err) 
		{
			const exclusive: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setTitle("Exclusive Command!")
				.setDescription(
					"You have used a command exclusive to the members of the Shrine of Shinano server, join the server to use the command anywhere!"
				);
			const button: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Join Server!")
						.setEmoji({ name: "🔗", })
						.setURL("https://discord.gg/NFkMxFeEWr")
				);
			return interaction.editReply({
				embeds: [exclusive],
				components: [button],
			});
		}
	}
}

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
			name: "fanbox",
			description: "Images from artists' FANBOX/Patreon (High Quality)",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "fanbox-category",
					description:
						"The category you want FANBOX/Patreon content from. Ignore this option for random category.",
					choices: [
						{ name: "Shipgirls", value: "shipgirls", },
						{ name: "Undies ⭐", value: "undies", },
						{ name: "Uniform ⭐", value: "uniform", },
						{ name: "Elf", value: "elf", },
						{ name: "Genshin", value: "genshin", },
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
						{ name: "Elf", value: "elf", },
						{ name: "Genshin", value: "genshin", },
						{ name: "Kemonomimi", value: "kemonomimi", },
						{ name: "Misc", value: "misc", },
						{ name: "Uniform", value: "uniform", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "fanbox-bomb",
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
						{ name: "Elf", value: "elf", },
						{ name: "Genshin", value: "genshin", },
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
						{ name: "Elf", value: "elf", },
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
						{ name: "Elf", value: "elf", },
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
			name: "elf",
			description: "Thicc and pointy-eared.",
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
						{ name: "Random", value: "random", },
						{ name: "Video", value: "video", },
						{ name: "Ass", value: "ass", },
						{ name: "Cum", value: "cum", },
						{ name: "Anal", value: "anal", },
						{ name: "Blowjob", value: "blowjob", },
						{ name: "Boobs", value: "boobs", },
						{ name: "Pussy", value: "pussy", },
						{ name: "Cosplay", value: "cosplay", },
						{ name: "Lingerie", value: "lingerie", }
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
		const lewdEmbed: EmbedBuilder = new EmbedBuilder()
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		/**
		 * Processing Command
		 */
		if (interaction.options["_group"]) 
		{
			await checkMutual(interaction);
			return nsfwFunc.autohentai(interaction);
		}

		const subcommand = interaction.options.getSubcommand();
		if (subcommand !== "irl") 
		{
			switch (subcommand) 
			{
				case "bomb": {
					return nsfwFunc.bomb(interaction);
				}

				case "fanbox-bomb": {
					await checkMutual(interaction);
					return nsfwFunc.fanboxBomb(interaction);
				}

				case "animation-bomb": {
					await checkMutual(interaction);
					return nsfwFunc.bomb(interaction);
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

				case "fanbox": {
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
						interaction.options.getString("fanbox-category") ||
						tags[Math.floor(Math.random() * tags.length)];

					return nsfwFunc.fanbox(interaction, lewdEmbed, tag);
				}

				case "elf":
				case "genshin":
				case "kemonomimi":
				case "misc":
				case "shipgirls":
				case "undies":
				case "uniform":
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
	},
});

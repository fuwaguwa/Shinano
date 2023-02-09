import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import nsfwFunc from "./subcommands/nsfwSubs";
import fetch from "node-fetch";

export default new ChatInputCommand({
	name: "nsfw",
	description: "NSFW Commands - Anime & IRL",
	cooldown: 4000,
	nsfw: true,
	voteRequired: true,
	category: "NSFW",
	defaultMemberPermissions: "0",
	options: [
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "anime",
			description: "uwu",
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
					name: "bomb",
					description: "Bombs you with lewdness!",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "category",
							description:
								"The category you want to be bombed with. Ignore this option for random category.",
							choices: [
								{ name: "GIF", value: "gif", },
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
					name: "animation",
					description: "When pictures are not enough...",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "type",
							required: true,
							description:
								"File type. Ignore this option for random file type.",
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
					name: "a-level",
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
					name: "solo",
					description: "Single Player Mode.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "nut",
					description: "Baby gravy.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "random",
					description: "Return images/GIFs/videos from a random category.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "oral",
					description: "Girls \"playing the trumpet\"",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "genshin",
					description: "Genshin Girls",
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
					name: "breasts",
					description: "Girls with huge jugs!",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "misc",
					description: "Categories that are not mentioned here!",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "cunny",
					description: "😺🐈",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "irl",
			description: "Real People.",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "ass",
					description: "Big Booty IRL.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "nut",
					description: "Special sauce from the meat.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "a-level",
					description: "There's more than one hole",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "oral",
					description: "The SUCC.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "breasts",
					description: "Big and heavy.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "cunny",
					description: "Down there.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "random",
					description: "Return image/video from a random category.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "cosplay",
					description: "Life imitates art.",
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "video",
					description: "Videos from RedGIFS.",
				}
			],
		}
	],
	run: async ({ interaction, client, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();
		const lewdEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		/**
		 * Processing Command
		 */
		if (interaction.options.getSubcommandGroup() === "anime") 
		{
			switch (interaction.options.getSubcommand()) 
			{
				case "random": {
					return nsfwFunc.random(interaction, lewdEmbed);
				}

				case "bomb": {
					return nsfwFunc.bomb(interaction);
				}

				case "fanbox-bomb": {
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

					return nsfwFunc.fanboxBomb(interaction);
				}

				case "animation": {
					return nsfwFunc.animation(interaction);
				}

				case "fanbox": {
					return nsfwFunc.fanbox(interaction, lewdEmbed);
				}

				case "elf":
				case "genshin":
				case "kemonomimi":
				case "misc":
				case "shipgirls":
				case "undies":
				case "uniform":
				case "yuri": {
					return nsfwFunc.privateColle(
						interaction,
						lewdEmbed,
						interaction.options.getSubcommand()
					);
				}

				default: {
					let tag = interaction.options.getSubcommand();

					if (tag === "cunny") tag = "pussy";
					if (tag === "breasts") tag = "boobs";
					if (tag === "nut") tag = "cum";
					if (tag === "oral") tag = "blowjob";
					if (tag === "a-level") tag = "anal";

					const response = await fetch(
						`https://Amagi.fuwafuwa08.repl.co/nsfw/public/${tag}`,
						{
							method: "GET",
							headers: {
								Authorization: process.env.amagiApiKey,
							},
						}
					);
					const waifu = await response.json();
					lewdEmbed.setImage(waifu.link);

					return interaction.editReply({ embeds: [lewdEmbed], });
				}
			}
		}
		else 
		{
			let tag = interaction.options.getSubcommand();

			if (tag === "cunny") tag = "pussy";
			if (tag === "breasts") tag = "boobs";
			if (tag === "nut") tag = "cum";
			if (tag === "oral") tag = "blowjob";
			if (tag === "a-level") tag = "anal";

			const response = await fetch(
				`https://Amagi.fuwafuwa08.repl.co/nsfw/porn/${tag}`,
				{
					method: "GET",
					headers: {
						Authorization: process.env.amagiApiKey,
					},
				}
			);
			const result = await response.json();

			if (
				(result.link as string).includes("redgifs") ||
				(result.link as string).includes(".gifv")
			)
				return interaction.editReply({ content: result.link, });
			lewdEmbed.setImage(result.link);

			return interaction.editReply({ embeds: [lewdEmbed], });
		}
	},
});

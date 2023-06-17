import { AzurAPI } from "@azurapi/azurapi";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import azurLaneFunc from "./subcommands/azurLaneSubs";

const AL = new AzurAPI();

export default new ChatInputCommand({
	name: "azur-lane",
	description: "Get information related to Azur Lane!",
	cooldown: 5500,
	category: "AzurLane",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "ship",
			description: "Get information about an Azur Lane ship via AzurAPI!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "ship-name",
					description: "Ship's Name",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "gear",
			description: "Get information about an Azur Lane gear via AzurAPI!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "gear-name",
					description: "Gear Name",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "chapter",
			description: "Get information about an Azur Lane chapter via AzurAPI!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "chapter-number",
					description: "Chapter Number",
					choices: [
						{ name: "Chapter 1: Tora! Tora! Tora!", value: "1", },
						{ name: "Chapter 2: Battle of the Coral Sea", value: "2", },
						{ name: "Chapter 3: Midway Showdown", value: "3", },
						{ name: "Chapter 4: Solomon's Nightmare Pt.1", value: "4", },
						{ name: "Chapter 5: Solomon's Nightmare Pt.2", value: "5", },
						{ name: "Chapter 6: Solomon's Nightmare Pt.3", value: "6", },
						{ name: "Chapter 7: Night of Chaos", value: "7", },
						{ name: "Chapter 8: Battle Komandorski", value: "8", },
						{ name: "Chapter 9: Battle of Kula Gulf", value: "9", },
						{ name: "Chapter 10: Battle of Kolombangara", value: "10", },
						{ name: "Chapter 11: Empress Augusta Bay", value: "11", },
						{ name: "Chapter 12: Mariana's Turmoil Pt.1", value: "12", },
						{ name: "Chapter 13: Mariana's Turmoil Pt.2", value: "13", },
						{ name: "Chapter 14: Surigao Night Combat", value: "14", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "gacha",
			description: "Build simulator for Azur Lane!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "banner-name",
					description:
						"The name of the banner you wish to pull on (You can build 300 times per session!)",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "build",
			description:
				"Get the recommended gears for a ship from the community tier list!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "ship-name",
					description: "Ship's Name.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "farm",
			description:
				"See the requirements for a ship to reach the target level at a certain stage.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "ship-name",
					description: "The ship's name.",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					required: true,
					name: "current-level",
					description: "Current level of the ship (Max 125)",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					required: true,
					name: "target-level",
					description: "The level your want to get the ship to (Max 125)",
				},
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "chapter",
					description: "The chapter you want to farm at.",
					choices: [
						{ name: "Chapter 1: Tora! Tora! Tora!", value: "1", },
						{ name: "Chapter 2: Battle of the Coral Sea", value: "2", },
						{ name: "Chapter 3: Midway Showdown", value: "3", },
						{ name: "Chapter 4: Solomon's Nightmare Pt.1", value: "4", },
						{ name: "Chapter 5: Solomon's Nightmare Pt.2", value: "5", },
						{ name: "Chapter 6: Solomon's Nightmare Pt.3", value: "6", },
						{ name: "Chapter 7: Night of Chaos", value: "7", },
						{ name: "Chapter 8: Battle Komandorski", value: "8", },
						{ name: "Chapter 9: Battle of Kula Gulf", value: "9", },
						{ name: "Chapter 10: Battle of Kolombangara", value: "10", },
						{ name: "Chapter 11: Empress Augusta Bay", value: "11", },
						{ name: "Chapter 12: Mariana's Turmoil Pt.1", value: "12", },
						{ name: "Chapter 13: Mariana's Turmoil Pt.2", value: "13", },
						{ name: "Chapter 14: Surigao Night Combat", value: "14", }
					],
				},
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "stage",
					description: "The stage you want to farm at",
					choices: [
						{ name: "1", value: "1", },
						{ name: "2", value: "2", },
						{ name: "3", value: "3", },
						{ name: "4", value: "4", }
					],
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					required: false,
					name: "flagship",
					description: "Is the ship at the flagship position or not.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "pr-completion",
			description: "Calculate your PR completion!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "ship-name",
					description: "Name of the PR/DR ship.",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					required: true,
					name: "dev-level",
					description: "Dev level of the PR/DR ship. (Max 30)",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					required: true,
					name: "unused-bps",
					description:
						"Number of BPs you have spent on the current dev level + Number of unused BPs.",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "fate-sim-level",
					description: "Fate simulation level of the PR/DR ship.",
					choices: [
						{ name: "0", value: "0", },
						{ name: "1", value: "1", },
						{ name: "2", value: "2", },
						{ name: "3", value: "3", },
						{ name: "4", value: "4", },
						{ name: "5", value: "5", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "news",
			description:
				"Send the latest tweets/news about the game for both EN and JP server from the official accounts!",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "set",
					description:
						"Send the latest news/tweets about the game for both EN and JP server from the official accounts!",
					options: [
						{
							type: ApplicationCommandOptionType.Channel,
							channelTypes: [ChannelType.GuildText],
							required: true,
							name: "channel",
							description: "The channel for the bot to send tweets into.",
						}
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "stop",
					description: "Stop posting news/tweets into the server.",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();
		if (!interaction.options["_group"]) 
		{
			switch (interaction.options.getSubcommand()) 
			{
				case "pr-completion": {
					return azurLaneFunc.prCompletion(interaction, AL);
				}

				case "farm": {
					return azurLaneFunc.farm(interaction, AL);
				}

				case "chapter": {
					return azurLaneFunc.chapter(interaction, AL);
				}

				case "ship": {
					return azurLaneFunc.ship(interaction, AL);
				}

				case "gear": {
					return azurLaneFunc.gear(interaction, AL);
				}

				case "gacha": {
					return azurLaneFunc.gacha(interaction);
				}

				case "build": {
					return azurLaneFunc.build(interaction, AL);
				}
			}
		}

		switch (interaction.options.getSubcommandGroup()) 
		{
			case "news": {
				return azurLaneFunc.news(interaction);
			}
		}
	},
});

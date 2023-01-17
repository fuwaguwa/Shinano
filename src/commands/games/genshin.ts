import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import genshinFunc from "./subcommands/genshinSubs";

export default new ChatInputCommand({
	name: "genshin",
	description: "Get information related to Genshin.",
	cooldown: 5000,
	category: "GenshinImpact",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "artifact",
			description: "Get information about a Genshin artifact set!",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "artifact-name",
					description: "The name of an artifact set.",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "material",
			description: "Get information about a Genshin material.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "material-name",
					description: "The material name.",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "character",
			description: "Get information about a Genshin character.",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "info",
					description:
						"Information about a Genshin character (General Info, Constellations, Ascension Costs).",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "character-name",
							description: "The character's name.",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "stats",
					description: "Stats of a Genshin character.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "character-name",
							description: "The character's name.",
						},
						{
							type: ApplicationCommandOptionType.Integer,
							required: true,
							name: "character-level",
							description: "The character's level.",
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "ascension-phase",
							description: "The character's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
								{ name: "6", value: "6" },
							],
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "talents",
					description:
						"Get information about a Genshin character talents (General Info, Talent Costs).",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "character-name",
							description:
								"The character's name (Tip: Use 'Traveler <Element>' for the info on the Traveler)",
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "weapon",
			description: "Get information about a Genshin weapon.",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "info",
					description: "Information about a weapon from Genshin.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "weapon-name",
							description: "The weapon's name.",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "stats",
					description: "Stats of a weapon from Genshin.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "weapon-name",
							description: "The weapon's name.",
						},
						{
							type: ApplicationCommandOptionType.Integer,
							required: true,
							name: "weapon-level",
							description: "The weapon's level.",
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "ascension-phase",
							description: "The weapon's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
								{ name: "6", value: "6" },
							],
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "refinement-level",
							description: "The weapon's ascension phase.",
							choices: [
								{ name: "1", value: "1" },
								{ name: "2", value: "2" },
								{ name: "3", value: "3" },
								{ name: "4", value: "4" },
								{ name: "5", value: "5" },
							],
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "enemy",
			description: "Get information about a Genshin enemy.",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "info",
					description: "Get general information about a Genshin enemy.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "enemy-name",
							description: "The enemy's name.",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "stats",
					description: "Get a Genshin enemy's stats.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "enemy-name",
							description: "The enemy's name.",
						},
						{
							type: ApplicationCommandOptionType.Integer,
							required: true,
							name: "enemy-level",
							description: "The enemy's level.",
						},
					],
				},
			],
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();

		if (!interaction.options["_group"]) {
			switch (interaction.options.getSubcommand()) {
				case "artifact": {
					return genshinFunc.artifact(interaction);
				}

				case "material": {
					return genshinFunc.material(interaction);
				}
			}
		}

		switch (interaction.options.getSubcommandGroup()) {
			case "enemy": {
				return genshinFunc.enemy(interaction);
			}

			case "weapon": {
				return genshinFunc.weapon(interaction);
			}

			case "character": {
				return genshinFunc.character(interaction);
			}
		}
	},
});

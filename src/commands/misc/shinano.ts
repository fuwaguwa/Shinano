import { ChatInputCommand } from "../../structures/Command";
import { ApplicationCommandOptionType } from "discord.js";
import shinanoFunc from "./subcommands/shinanoSubs";

export default new ChatInputCommand({
	name: "shinano",
	description: "Information about Shinano.",
	cooldown: 4500,
	category: "Miscellaneous",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "info",
			description: "Show information about Shinano.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "stats",
			description: "Display Shinano's stats.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "ping",
			description: "Show Shinano's ping.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "vote",
			description: "Vote for Shinano or check your vote status!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "support",
			description: "Run this command if you got any problem with Shinano!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "pat",
			description: "Give me a headpat!",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "help",
			description: "All of Shinano's commands and what they do.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "command-type",
					description: "The type of command.",
					choices: [
						{
							name: "Normal Commands",
							value: "sfw",
						},
						{
							name: "NSFW Commands",
							value: "nsfw",
						}
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "lewd",
			description: "\"As a reward for your valiant efforts...\"",
		}
	],
	run: async ({ interaction, }) => 
	{
		switch (interaction.options.getSubcommand()) 
		{
			case "info": {
				return shinanoFunc.info(interaction);
			}

			case "stats": {
				return shinanoFunc.stats(interaction);
			}

			case "pat": {
				return shinanoFunc.pat(interaction);
			}

			case "ping": {
				return shinanoFunc.ping(interaction);
			}

			case "vote": {
				return shinanoFunc.vote(interaction);
			}

			case "lewd": {
				return shinanoFunc.lewd(interaction);
			}

			case "support": {
				return shinanoFunc.support(interaction);
			}

			case "help": {
				return shinanoFunc.help(interaction);
			}
		}
	},
});

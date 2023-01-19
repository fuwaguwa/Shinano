import { ApplicationCommandOptionType } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import devFunc from "./subcommands/devSubs";

export default new ChatInputCommand({
	name: "dev",
	description: "Developer Tools",
	defaultMemberPermissions: "0",
	cooldown: 4500,
	category: "Dev",
	ownerOnly: true,
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "eval",
			description: "N/A - Developer Only",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "code",
					description: "Code.",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "usage",
			description: "Shows bot memory usage.",
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "leave",
			description: "Make the bot leave a guild.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "guild-id",
					description: "Guild's ID",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "vote-check",
			description: "Check an user's vote status.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					required: true,
					name: "user",
					description: "User to vote check.",
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "inspect",
			description: "inspection",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "user",
					description: "Get information about an user.",
					options: [
						{
							type: ApplicationCommandOptionType.User,
							name: "user",
							description: "The user you want to inspect.",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "guild",
					description: "Get information about a guild.",
					options: [
						{
							type: ApplicationCommandOptionType.String,
							required: true,
							name: "guild-id",
							description: "The guild's ID.",
						},
					],
				},
			],
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "blacklist",
			description: "hehe",
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "add",
					description: "Add someone to the bot's blacklist.",
					options: [
						{
							type: ApplicationCommandOptionType.User,
							required: true,
							name: "user",
							description: "User's to blacklist.",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "remove",
					description: "Remove someone from the bot's blacklist.",
					options: [
						{
							type: ApplicationCommandOptionType.User,
							required: true,
							name: "user",
							description: "User's to unblacklist",
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "check",
					description: "Check if an user is blacklisted or not.",
					options: [
						{
							type: ApplicationCommandOptionType.User,
							required: true,
							name: "user",
							description: "User to the check in the blacklist.",
						},
					],
				},
			],
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case "vote-check": {
				return devFunc.voteCheck(interaction);
			}

			case "leave": {
				return devFunc.leave(interaction);
			}

			case "eval": {
				return devFunc.eval(interaction);
			}

			case "usage": {
				return devFunc.usage(interaction);
			}
		}

		switch (interaction.options.getSubcommandGroup()) {
			case "inspect": {
				return devFunc.inspect(interaction);
			}

			case "blacklist": {
				return devFunc.blacklist(interaction);
			}
		}
	},
});

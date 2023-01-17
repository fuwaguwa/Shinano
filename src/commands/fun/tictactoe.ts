import { ChatInputCommand } from "../../structures/Command";
import TTT from "discord-tictactoe";
import {
	ApplicationCommandOptionType,
	ChatInputCommandInteraction,
} from "discord.js";

const game = new TTT({ language: "en", commandOptionName: "user" });

export default new ChatInputCommand({
	name: "ttt",
	description: "Play tic tac toe against a bot or an user!",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user you want to play against.",
		},
	],
	run: async ({ interaction }) => {
		game.handleInteraction(interaction as ChatInputCommandInteraction);
	},
});

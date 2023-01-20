import { ChatInputCommand } from "../../structures/Command";
import blackjack from "discord-blackjack";

export default new ChatInputCommand({
	name: "blackjack",
	description: "Play blackjack!",
	cooldown: 4500,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		await blackjack(interaction, { resultEmbed: true, });
	},
});

import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "match",
	description: "Check 2 people's love meter.",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			required: true,
			name: "user1",
			description: "First Person.",
		},
		{
			type: ApplicationCommandOptionType.User,
			required: true,
			name: "user2",
			description: "Second Person.",
		}
	],
	run: async ({ interaction, }) => 
	{
		const person1: User = interaction.options.getUser("user1");
		const person2: User = interaction.options.getUser("user2");

		let love = Math.round(Math.random() * 100);
		const loveIndex = Math.floor(love / 10);
		const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

		const loveEmbed = new EmbedBuilder()
			.setColor("Red")
			.setTitle("Love Percentage 💘")
			.setDescription(
				`${person1} and ${person2} love percentage: ${love}%\n\n${loveLevel}`
			);
		await interaction.reply({ embeds: [loveEmbed], });
	},
});

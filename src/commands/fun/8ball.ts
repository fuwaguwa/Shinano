import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "8ball",
	description: "Ask 8ball.",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "question",
			description: "Your Question.",
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		const responses = [
			"As I see it, yes.",
			"Ask again later.",
			"Better not tell you now.",
			"Cannot predict now.",
			"Concentrate and ask again.",
			"Don’t count on it.",
			"It is certain.",
			"It is decidedly so.",
			"Most likely.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good.",
			"Outlook good.",
			"Reply hazy, try again.",
			"Signs point to yes.",
			"Very doubtful.",
			"Without a doubt.",
			"Yes.",
			"Yes – definitely.",
			"You may rely on it."
		];

		const response: EmbedBuilder = new EmbedBuilder()
			.setColor("#2b2d31")
			.setDescription(
				`> **${interaction.options.getString("question")}**\n` +
					responses[Math.floor(Math.random() * responses.length)]
			);

		await interaction.reply({ embeds: [response], });
	},
});

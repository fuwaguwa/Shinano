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
			"Kindly inquire again at a later time.",
			"It would be preferable not to disclose that information at this moment.",
			"I am unable to provide a prediction at the moment...",
			"Focus your thoughts and pose the question once more.",
			"I advise against relying on it.",
			"It is certain.",
			"It is decidedly so.",
			"Most likely.",
			"Regrettably, my response is in the negative.",
			"According to my sources, the answer is in the negative.",
			"The outlook appears to be unfavorable.",
			"The outlook seems promising.",
			"The response remains uncertain. Please attempt your inquiry once more.",
			"The signs indicate an affirmative response.",
			"Highly doubtful, I'm afraid.",
			"Without a doubt.",
			"Yes.",
			"Indeed, without a doubt.",
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

import { EmbedBuilder } from "discord.js";
import rFetch from "reddit-fetch";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "two-sentence-horror",
	description: "A two sentences story. Could be horrifying, cringe or funny.",
	category: "Fun",
	cooldown: 5000,
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const post = await rFetch({
			subreddit: "TwoSentenceHorror",
			sort: "hot",
			allowNSFW: false,
			allowModPost: false,
			allowCrossPost: false,
			allowVideo: false,
		});

		const postEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setDescription(`**${post.title}**\n${post.selftext}`);

		await interaction.editReply({ embeds: [postEmbed], });
	},
});

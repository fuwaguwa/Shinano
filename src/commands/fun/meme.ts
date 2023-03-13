import rFetch from "reddit-fetch";
import { ChatInputCommand } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "meme",
	description: "Get a meme from Reddit!",
	cooldown: 5000,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const result = await rFetch({
			subreddit: ["memes", "dankmemes"][Math.floor(Math.random() * 2)],
			sort: "hot",
			allowNSFW: false,
			allowModPost: false,
			allowCrossPost: false,
			allowVideo: false,
		});

		const memeEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(result.title)
			.setURL("https://reddit.com" + result.permalink)
			.setImage(result.url);

		await interaction.editReply({ embeds: [memeEmbed], });
	},
});

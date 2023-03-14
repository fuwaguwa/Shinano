import rFetch from "reddit-fetch";
import { ChatInputCommand } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "greentext",
	description: "4chan greentext.",
	nsfw: true,
	voteRequired: false,
	cooldown: 5000,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const result = await rFetch({
			subreddit: "greentext",
			sort: "hot",
			allowNSFW: true,
			allowModPost: false,
			allowCrossPost: false,
			allowVideo: false,
		});

		const greentextEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(result.title)
			.setURL("https://reddit.com" + result.permalink)
			.setImage(result.url);

		await interaction.editReply({ embeds: [greentextEmbed], });
	},
});

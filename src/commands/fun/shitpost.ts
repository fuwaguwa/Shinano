import rFetch from "reddit-fetch";
import { ChatInputCommand } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "shitpost",
	description: "Shitpost from Reddit.",
	cooldown: 5000,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const result = await rFetch({
			subreddit: "shitposting",
			sorting: "hot",
			allowNSFW: false,
			allowModPost: false,
			allowCrossPost: false,
			allowVideo: true,
		});

		if (result.is_video) 
		{
			return interaction.editReply({
				content: "https://reddit.com" + result.permalink,
			});
		}

		const shitpostEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(result.title)
			.setURL("https://reddit.com" + result.permalink)
			.setImage(result.url);

		await interaction.editReply({ embeds: [shitpostEmbed], });
	},
});

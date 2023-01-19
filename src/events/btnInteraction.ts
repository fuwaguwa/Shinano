import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { Event } from "../structures/Event";
import User from "../schemas/User";
import { TwitterApi } from "twitter-api-v2";
import translate from "google-translate-api-x";
import fetch from "node-fetch";

const twitClient = new TwitterApi({
	appKey: process.env.twitterApiKey,
	appSecret: process.env.twitterApiKeySecret,
	accessToken: process.env.twitterAccessToken,
	accessSecret: process.env.twitterAccessTokenSecret,
});

export default new Event("interactionCreate", async (interaction) => {
	if (!interaction.isButton()) return;

	if (!interaction.customId.includes("STWT")) {
		switch (interaction.customId) {
			case "NO-NSFW": {
				const cantSee: EmbedBuilder = new EmbedBuilder()
					.setColor("#2f3136")
					.setTitle("Enabling The NSFW Commands")
					.addFields(
						{
							name: "For Normal Members",
							value:
								"Shinano's `/nsfw` commands are **disabled by default** to keep the command list clean in non-NSFW channels. If you want to use them, please ask a moderator/administrator to read the section below.",
						},
						{
							name: "For Moderators/Administrators",
							value:
								"As said above, `/nsfw` command is **disabled by default**, meaning only people with **Administrator/Manage Webhooks** permission can use the command!\n\n" +
								"If you want to **enable it for normal members**:\n" +
								"Go to **Server Settings** > **Integrations** > **Shinano** > Search for `nsfw` > Enable it for **roles** and **channels** you want.",
						}
					)
					.setImage("https://cdn.upload.systems/uploads/xI7OxDPg.gif");
				return interaction.reply({ embeds: [cantSee], ephemeral: true });
			}

			case "VOTE-CHECK": {
				const user = await User.findOne({ userId: interaction.user.id });

				const voteLink: ActionRowBuilder<ButtonBuilder> =
					new ActionRowBuilder<ButtonBuilder>().setComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Link)
							.setLabel("Vote for Shinano!")
							.setEmoji({ id: "1002849574517477447" })
							.setURL("https://top.gg/bot/1002193298229829682/vote")
					);

				if (!user.lastVoteTimestamp) {
					// Haven't vote at all
					const noVotes: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							"You have not voted for Shinano! Please vote using the button below!"
						)
						.setTimestamp();
					return interaction.reply({
						embeds: [noVotes],
						components: [voteLink],
						ephemeral: true,
					});
				} else if (
					Math.floor(Date.now() / 1000) - user.lastVoteTimestamp >
					43200
				) {
					// 12 hours has passed
					const votable: EmbedBuilder = new EmbedBuilder()
						.setColor("Green")
						.setDescription(
							`Your last vote was <t:${user.lastVoteTimestamp}:R>, you can now vote again using the button below!`
						)
						.setTimestamp();
					return interaction.reply({
						embeds: [votable],
						components: [voteLink],
						ephemeral: true,
					});
				} else {
					// 12 hours has not passed
					const unvotable: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setDescription(
							`Your last vote was <t:${
								user.lastVoteTimestamp
							}:R>, you can vote again <t:${user.lastVoteTimestamp + 43200}:R>`
						)
						.setTimestamp();
					return interaction.reply({ embeds: [unvotable], ephemeral: true });
				}
			}
		}
	} else {
		await interaction.deferReply({ ephemeral: true });

		const tweetId = interaction.customId.split("-")[1];
		const tweet = await twitClient.v2.singleTweet(tweetId);

		const translations: any = await translate(tweet.data.text, {
			from: "ja",
			to: "en",
			requestFunction: fetch,
		});

		const translateEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setTitle("Translated Tweet")
			.setDescription(translations.text)
			.setFooter({ text: "Translated with Google Translate" });

		await interaction.editReply({ embeds: [translateEmbed] });
	}
});

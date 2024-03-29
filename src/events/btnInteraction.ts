import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	Collection,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import { Event } from "../structures/Event";
import User from "../schemas/User";
import fs from "fs";
import path from "path";
import { findSauce } from "../lib/Sauce";
import { client } from "../index";
import ms from "ms";

const Cooldown: Collection<string, number> = new Collection();
const owner = "836215956346634270";

export async function cooldownCheck(
	id: string,
	interaction: ButtonInteraction
) 
{
	if (Cooldown.has(`${id}${owner}`)) Cooldown.delete(`${id}${owner}`);

	if (Cooldown.has(`${id}${interaction.user.id}`)) 
	{
		const cms = Cooldown.get(`${id}${interaction.user.id}`);
		const onChillOut = new EmbedBuilder()
			.setTitle("Slow Down!")
			.setColor("Red")
			.setDescription(
				`You are on a \`${ms(cms - Date.now(), { long: true, })}\` cooldown.`
			);
		await interaction.reply({ embeds: [onChillOut], ephemeral: true, });
		return true;
	}
	return false;
}

export function setCooldown(id: string, interaction: ButtonInteraction) 
{
	Cooldown.set(`${id}${interaction.user.id}`, Date.now() + 5000);
	setTimeout(() => 
	{
		Cooldown.delete(`${id}${interaction.user.id}`);
	}, 4500);
}

export default new Event("interactionCreate", async (interaction) => 
{
	if (!interaction.isButton()) return;

	switch (true) 
	{
		case interaction.customId === "VOTE-CHECK": {
			if (await cooldownCheck("VOTE-CHECK", interaction)) return;

			const user = await User.findOne({ userId: interaction.user.id, });

			const voteLink: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Vote for Shinano!")
						.setEmoji({ id: "1002849574517477447", })
						.setURL("https://top.gg/bot/1002193298229829682/vote")
				);

			setCooldown("VOTE-CHECK", interaction);

			if (!user.lastVoteTimestamp) 
			{
				// Haven't vote at all
				const noVotes: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setDescription(
						"It seems that you have not cast your vote for me! I earnestly request you to do so by using the option below!"
					)
					.setTimestamp();
				return interaction.reply({
					embeds: [noVotes],
					components: [voteLink],
					ephemeral: true,
				});
			}
			else if (
				Math.floor(Date.now() / 1000) - user.lastVoteTimestamp >
				43200
			) 
			{
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
			}
			else 
			{
				// 12 hours has not passed
				const unvotable: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setDescription(
						`Your last vote was <t:${
							user.lastVoteTimestamp
						}:R>, you can vote again <t:${user.lastVoteTimestamp + 43200}:R>`
					)
					.setTimestamp();
				return interaction.reply({ embeds: [unvotable], ephemeral: true, });
			}
		}

		case interaction.customId.includes("JTWT"): {
			if (await cooldownCheck("JTWT", interaction)) return;

			await interaction.deferReply({ ephemeral: true, });

			const tweetId = interaction.customId.split("-")[1];
			fs.readFile(
				path.join(__dirname, "..", "..", "data", "tweetsInfo.json"),
				"utf-8",
				(err, data) => 
				{
					const json = JSON.parse(data);
					const tweet = json.tweets.find(tweet => tweet.id == tweetId);

					if (!tweet || !tweet.enTranslate) 
					{
						const noTweet: EmbedBuilder = new EmbedBuilder()
							.setColor("Red")
							.setDescription(
								"❌ | \"Regrettably, the tweet is currently not in the database. I suggesting visiting the tweet manually and seeking the desired translation there.\""
							);
						return interaction.editReply({ embeds: [noTweet], });
					}

					const translatedTweet: EmbedBuilder = new EmbedBuilder()
						.setColor("#2b2d31")
						.setTitle("Translated Tweet")
						.setDescription(tweet.enTranslate)
						.setFooter({ text: "Translated with Google Translate", });

					return interaction.editReply({ embeds: [translatedTweet], });
				}
			);

			setCooldown("JTWT", interaction);

			break;
		}

		case interaction.customId.includes("CTWT"): {
			if (await cooldownCheck("CTWT", interaction)) return;

			await interaction.deferReply({ ephemeral: true, });

			const tweetId = interaction.customId.split("-")[1];
			fs.readFile(
				path.join(__dirname, "..", "..", "data", "weiboTweetsInfo.json"),
				"utf-8",
				(err, data) => 
				{
					const json = JSON.parse(data);
					const tweet = json.tweets.find(tweet => tweet.id == tweetId);

					if (!tweet || !tweet.enTranslate) 
					{
						const noTweet: EmbedBuilder = new EmbedBuilder()
							.setColor("Red")
							.setDescription(
								"❌ | \"My apologies, the tweet is currently not in the database. I suggesting visiting the tweet manually and seeking the desired translation there.\""
							);
						return interaction.editReply({ embeds: [noTweet], });
					}

					const translatedTweet: EmbedBuilder = new EmbedBuilder()
						.setColor("#2b2d31")
						.setTitle("Translated Tweet")
						.setDescription(tweet.enTranslate)
						.setFooter({ text: "Translated with Google Translate", });

					return interaction.editReply({ embeds: [translatedTweet], });
				}
			);

			setCooldown("CTWT", interaction);

			break;
		}

		case interaction.customId.includes("SAUCE"): {
			if (await cooldownCheck("SAUCE", interaction)) return;

			const link = interaction.message.embeds[0].data.image.url;

			if (interaction.customId.split("-")[1] === "EPH") 
			{
				await findSauce({
					interaction,
					link,
					ephemeral: true,
				});
			}
			else 
			{
				await findSauce({
					interaction,
					link,
					ephemeral: !(interaction.channel as TextChannel).nsfw,
				});
			}

			setCooldown("SAUCE", interaction);
			break;
		}
	}

	/**
	 * Logging button interaction
	 */
	if (interaction.user.id === owner) return;

	const mainGuild = await client.guilds.fetch("1002188088942022807");
	const commandLogsChannel = await mainGuild.channels.fetch(
		"1084050120775057418"
	);

	const fullCommand = interaction.customId;
	const commandExecuted: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle("Button Pressed!")
		.setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, }))
		.addFields(
			{ name: "Button ID: ", value: `\`${fullCommand}\``, },
			{
				name: "Guild Name | Guild ID",
				value: `${interaction.guild.name} | ${interaction.guild.id}`,
			},
			{
				name: "Channel Name | Channel ID",
				value: `#${interaction.channel.name} | ${interaction.channel.id}`,
			},
			{
				name: "User | User ID",
				value: `${interaction.user.username} | ${interaction.user.id}`,
			},
			{
				name: "Message Link",
				value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channelId}/${interaction.message.id}`,
			}
		)
		.setTimestamp();
	await (commandLogsChannel as TextChannel).send({
		embeds: [commandExecuted],
	});
});

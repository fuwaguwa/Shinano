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
import translate from "google-translate-api-x";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { findSauce } from "../lib/Sauce";
import { client } from "../index";
import ms from "ms";

const Cooldown: Collection<string, number> = new Collection();
const owner = "836215956346634270";

let EHOSTRetries: number = 0;
function translateTweet(text: string, interaction: ButtonInteraction) 
{
	translate(text, {
		from: "ja",
		to: "en",
		requestFunction: fetch,
	})
		.then(async (translations) => 
		{
			const translateEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setTitle("Translated Tweet")
				.setDescription(translations.text)
				.setFooter({ text: "Translated with Google Translate", });

			await interaction.editReply({ embeds: [translateEmbed], });
		})
		.catch(async (err) => 
		{
			console.error(err);

			if (err.message.includes("EHOSTUNREACH") && EHOSTRetries < 3) 
			{
				EHOSTRetries += 1;
				return translateTweet(text, interaction);
			}

			EHOSTRetries = 0;
			const errorEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`**${err.name}**: ${err.message}`)
				.setFooter({
					text: "Please use the command again or contact support!",
				});
			const button: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Support Server")
						.setEmoji({ name: "⚙️", })
						.setURL("https://discord.gg/NFkMxFeEWr")
				);

			await interaction.editReply({
				embeds: [errorEmbed],
				components: [button],
			});
		});
}

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
		case interaction.customId === "NO-NSFW": {
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
							"As said above, `/nsfw` command is **disabled by default**, meaning only people with **Administrator** permission can use the command!\n\n" +
							"If you want to **enable it**:\n" +
							"Go to **Server Settings** > **Integrations** > **Shinano** > Search for `nsfw` > Enable it for **roles** and **channels** you want.\n\n" +
							"Make sure that the NSFW commands are disabled for all channels and only available in the channels that you want, see the gif below for an example!",
					}
				)
				.setImage(
					"https://cdn.discordapp.com/attachments/1002189321631187026/1068046004856819732/Discord_lhVlTgLx3R.gif"
				);
			return interaction.reply({ embeds: [cantSee], ephemeral: true, });
		}

		case interaction.customId === "VOTE-CHECK": {
			const user = await User.findOne({ userId: interaction.user.id, });

			const voteLink: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Vote for Shinano!")
						.setEmoji({ id: "1002849574517477447", })
						.setURL("https://top.gg/bot/1002193298229829682/vote")
				);

			if (!user.lastVoteTimestamp) 
			{
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

		case interaction.customId.includes("STWT"): {
			await interaction.deferReply({ ephemeral: true, });

			const tweetId = interaction.customId.split("-")[1];
			fs.readFile(
				path.join(__dirname, "..", "..", "tweetsInfo.json"),
				"utf-8",
				(err, data) => 
				{
					const json = JSON.parse(data);
					const tweet = json.tweets.find(tweet => tweet.id == tweetId);

					if (!tweet) 
					{
						const noTweet: EmbedBuilder = new EmbedBuilder()
							.setColor("Red")
							.setDescription(
								"❌ | Tweet is currently in the database. Please click on the link and translate the tweet there."
							);
						return interaction.editReply({ embeds: [noTweet], });
					}

					return translateTweet(tweet.raw, interaction);
				}
			);
			break;
		}

		case interaction.customId.includes("SAUCE"): {
			if (await cooldownCheck("SAUCE", interaction)) return;

			const link = interaction.message.components[0].components[0].data["url"];
 
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
		}
	}

	if (interaction.user.id === owner) return;

	const mainGuild = await client.guilds.fetch("1002188088942022807");
	const commandLogsChannel = await mainGuild.channels.fetch(
		"1084050120775057418"
	);

	const fullCommand = interaction.customId;
	const commandExecuted: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
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
				value: `${interaction.user.username}#${interaction.user.discriminator} | ${interaction.user.id}`,
			}
		)
		.setTimestamp();
	await (commandLogsChannel as TextChannel).send({
		embeds: [commandExecuted],
	});
});

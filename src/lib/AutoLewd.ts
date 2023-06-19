import Guild from "../schemas/AutoLewd";
import User from "../schemas/User";
import Image from "../schemas/Image";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageCreateOptions,
	TextChannel
} from "discord.js";
import { client } from "../index";
import { toTitleCase } from "./Utils";

export async function postLewd() 
{
	const image = (await Image.aggregate([{ $sample: { size: 1, }, }]))[0];

	let chatOptions: MessageCreateOptions;

	if (!(image.link as string).endsWith("mp4")) 
	{
		const lewdEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setTitle(`Category: ${image.category}`)
			.setTitle(`Category: ${toTitleCase(image.category)}`)
			.setImage(image.link)
			.setTimestamp();

		const imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(image.link),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji({ name: "🔍", })
				.setLabel("Get Sauce")
				.setCustomId("SAUCE-EPH")
		);

		chatOptions = {
			embeds: [lewdEmbed],
			components: [imageInfo],
		};
	}
	else 
	{
		chatOptions = {
			content: image.link,
		};
	}

	for await (let doc of Guild.find()) 
	{
		try 
		{
			const guild = await client.guilds.fetch(doc.guildId);
			const channel = (await guild.channels.fetch(
				doc.channelId
			)) as TextChannel;

			if (!channel.nsfw) 
			{
				const nsfw: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setTitle("NSFW Command")
					.setDescription("Autolewd was setup but this channel is not NSFW!");
				return channel.send({ embeds: [nsfw], });
			}

			const userId = doc.identifier.split("|")[1];
			const user = await User.findOne({ userId: userId, });
			if (
				userId !== "836215956346634270" &&
				Math.floor(Date.now() / 1000) - user.lastVoteTimestamp > 43200
			) 
			{
				if (!doc.paused) 
				{
					const paused: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setTitle("Autohentai has been paused...")
						.setDescription(
							"You will have to vote for Shinano again for her to continue posting lewds!"
						);
					const voteLink: ActionRowBuilder<ButtonBuilder> =
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Link)
								.setLabel("Vote for Shinano!")
								.setEmoji({ id: "1002849574517477447", })
								.setURL("https://top.gg/bot/1002193298229829682/vote"),
							new ButtonBuilder()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Check Vote")
								.setCustomId("VOTE-CHECK")
								.setEmoji({ name: "🔍", })
						);

					await channel.send({
						content: `<@${userId}>,`,
						embeds: [paused],
						components: [voteLink],
					});

					doc.paused = true;
					await doc.save();
				}

				continue;
			}

			if (doc.paused) 
			{
				doc.paused = false;
				await doc.save();
			}

			await channel.send(chatOptions);
		}
		catch (error) 
		{
			console.warn(error);
			if (
				["DiscordAPIError[10004]", "DiscordAPIError[10003]"].includes(
					error.name
				)
			)
				await doc.deleteOne();
		}
	}
}

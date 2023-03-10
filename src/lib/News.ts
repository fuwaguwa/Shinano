import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	MessageCreateOptions,
	TextChannel
} from "discord.js";
import { client } from "..";
import News from "../schemas/ALNews";

let retries: number = 0;
export async function fetchTweets() 
{
	fetch("https://twitterscraperapi.fuwafuwa08.repl.co/altweet")
		.then(res => res.json())
		.then((json) => 
		{
			const tweetJsonDir = path.join(__dirname, "..", "..", "tweetsInfo.json");

			fs.readFile(tweetJsonDir, "utf-8", (err, data) => 
			{
				const tweetsInfo = JSON.parse(data);
				const result = tweetsInfo.tweets.find(
					tweet => tweet.id == json.data[0].id
				);

				if (!result) 
				{
					tweetsInfo.tweets.push({
						id: json.data[0].id,
						url: json.data[0].url,
						raw: json.data[0].raw,
					});

					fs.writeFile(
						tweetJsonDir,
						JSON.stringify(tweetsInfo, null, "\t"),
						"utf-8",
						(err) => 
						{
							if (err) console.error(err);
						}
					);

					postTweet(tweetsInfo.tweets[tweetsInfo.tweets.length - 1]);
				}
			});
		})
		.catch((err) => 
		{
			if (retries < 3) 
			{
				return fetchTweets();
			}

			retries = 0;
			console.error(err);
		});
}

async function postTweet(tweet) 
{
	const server = tweet.url.includes("azurlane_staff") ? "JP" : "EN";

	let messageOptions: MessageCreateOptions = {
		content:
			`__Shikikans, there's a new message from ${server} HQ!__\n` + tweet.url,
	};
	if (tweet.url.includes("azurlane_staff")) 
	{
		const translate: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setCustomId(`STWT-${tweet.id}`)
					.setLabel("Translate Tweet")
					.setEmoji({ id: "1065640481687617648", })
			);
		messageOptions = Object.assign({ components: [translate], }, messageOptions);
	}

	for await (const doc of News.find()) 
	{
		try 
		{
			const guild = await client.guilds.fetch(doc.guildId);
			const channel = await guild.channels.fetch(doc.channelId);

			await (channel as TextChannel).send(messageOptions);
		}
		catch (error) 
		{
			console.warn(error);
			continue;
		}
	}
}

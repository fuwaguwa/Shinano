import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	MessageCreateOptions,
	TextChannel
} from "discord.js";
import { client } from "..";
import News from "../schemas/ALNews";
import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import axios from "axios";
import { getTwitterUserFeed, translateTweet } from "./Utils";

puppeteer.use(Stealth());

let retries: number = 0;
export async function fetchTweets() 
{
	const enFeed = await getTwitterUserFeed("AzurLane_EN");
	const jpFeed = await getTwitterUserFeed("azurlane_staff");

	console.log("-----------------------------------------------------");
	console.log(`Newest EN Tweet: ${enFeed.items[0].link}`);
	console.log(`Newest JP Tweet: ${jpFeed.items[0].link}`);

	const allFeed = enFeed.items.concat(jpFeed.items);

	allFeed.sort((x, y) => 
	{
		const xId = x.link.split("/status/")[1];
		const yId = y.link.split("/status/")[1];

		if (xId > yId) return -1;
		if (xId < yId) return 1;
		return 0;
	});

	const newestTweet = allFeed[0];
	const newestTweetId = parseInt(newestTweet.link.split("/status/")[1]);

	const tweetJsonDir = path.join(
		__dirname,
		"..",
		"..",
		"data",
		"tweetsInfo.json"
	);

	fs.readFile(tweetJsonDir, "utf-8", async (err, data) => 
	{
		const allSavedTweets = JSON.parse(data);

		const newTweetPresence = allSavedTweets.tweets.find(
			tweet => tweet.id == newestTweetId
		);

		const validTweet =
			!newTweetPresence &&
			!newestTweet.title.includes("🔁") &&
			!newestTweet.title.includes("↩️");

		console.log(`Newest Tweet: ${newestTweet.link} | Valid: ${validTweet}`);
		console.log("-----------------------------------------------------");

		if (validTweet) 
		{
			allSavedTweets.tweets.push({
				id: newestTweetId,
				url: newestTweet.link,
				raw: null,
				enTranslate: null,
			});

			fs.writeFile(
				tweetJsonDir,
				JSON.stringify(allSavedTweets, null, "\t"),
				"utf-8",
				(err) => 
				{
					if (err) console.log(err);
				}
			);

			postTweet(allSavedTweets.tweets[allSavedTweets.tweets.length - 1]);
		}
	});
}

export async function fetchWeiboTweets() 
{
	fetch("https://twitapi.fuwafuwa08.repl.co/alweibotweet")
		.then(res => res.json())
		.then((json) => 
		{
			const tweetJsonDir = path.join(
				__dirname,
				"..",
				"..",
				"data",
				"weiboTweetsInfo.json"
			);

			fs.readFile(tweetJsonDir, "utf-8", async (err, data) => 
			{
				const tweetsInfo = JSON.parse(data);

				const response = json.data;
				response.sort((a, b) => b.id - a.id);
				const tweet = response[0];

				const result = tweetsInfo.tweets.find(tweetI => tweetI.id == tweet.id);

				if (!result) 
				{
					const main = async (url: string) => 
					{
						const browser: Browser = await puppeteer.launch({
							headless: "new",
							args: ["--no-sandbox"],
						});

						const page: Page = await browser.newPage();
						await page.goto(url);
						await page.waitForSelector(".weibo-text", { timeout: 300000, });

						const pageData = await page.evaluate(() => 
						{
							// eslint-disable-next-line no-undef
							const div = document.querySelector(".weibo-text");
							const textNodes = div.childNodes;

							let text = "";
							for (let i = 0; i < textNodes.length; i++) 
							{
								const node = textNodes[i];

								if (node.nodeName === "#text") 
								{
									text += node.textContent;
								}
								else if (node.nodeName === "A") 
								{
									text += node.textContent;
								}
								else if (node.nodeName === "BR") 
								{
									text += "\n";
								}
							}

							return text;
						});

						await browser.close();

						return pageData;
					};

					const text = await main(tweet.url);
					let img = null;

					if (tweet.pictures && tweet.pictures.length >= 1) 
					{
						const imageResponse = await axios.get(tweet.pictures[0], {
							responseType: "arraybuffer",
							headers: {
								Host: "wx2.sinaimg.cn",
								Referer: "https://m.weibo.cn/",
							},
						});

						const buffer = Buffer.from(imageResponse.data, "utf-8");

						const guild = await client.guilds.fetch("1002188088942022807");
						const channel = await guild.channels.fetch("1110132419484454935");

						let fileFormat = tweet.pictures[0].slice(-3);
						if (["jpg", "png"].includes(fileFormat)) fileFormat = "png";

						const message = await (channel as TextChannel).send({
							files: [
								new AttachmentBuilder(buffer, { name: `image.${fileFormat}`, })
							],
						});

						img = message.attachments.first().url;
					}

					tweetsInfo.tweets.push({
						id: tweet.id,
						url: tweet.url,
						raw: text,
						img: img,
						enTranslate: await translateTweet(text, "zh-CN"),
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
				retries++;
				return fetchTweets();
			}

			retries = 0;
			console.error(err);
		});
}

async function postTweet(tweet) 
{
	let messageOptions: MessageCreateOptions;

	if (tweet.url.includes("azurlane_staff")) 
	{
		messageOptions = {
			content:
				"__Shikikans, a new message has arrived from JP HQ!__\n" +
				tweet.url.replace("twitter.com", "vxtwitter.com"),
		};
	}
	else if (tweet.url.includes("weibo.cn")) 
	{
		const translate: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setCustomId(`CTWT-${tweet.id}`)
					.setLabel("Translate Tweet")
					.setEmoji({ id: "1065640481687617648", })
			);
		const tweetEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#1da0f2")
			.setDescription(tweet.raw)
			.setAuthor({
				name: "碧蓝航线",
				iconURL:
					"https://cdn.discordapp.com/attachments/1022191350835331203/1110126024978616361/response.jpeg",
				url: "https://m.weibo.cn/u/5770760941",
			});

		if (tweet.img) tweetEmbed.setImage(tweet.img);

		messageOptions = {
			content:
				"__Shikikans, a new message has arrived from CN HQ!__\n" +
				`<${tweet.url}>`,
			embeds: [tweetEmbed],
			components: [translate],
		};
	}
	else 
	{
		messageOptions = {
			content:
				"__Shikikans, a new message has arrived from EN HQ!__\n" +
				tweet.url.replace("twitter.com", "vxtwitter.com"),
		};
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
			/**
			 * 50001: Missing Access
			 * 10003: Unknown Channel
			 * 10004: Unknown Guild
			 */
			if (error.name !== "DiscordAPIError[50001]") console.warn(error);
			if (
				["DiscordAPIError[10004]", "DiscordAPIError[10003]"].includes(
					error.name
				)
			)
				await doc.deleteOne();
		}
	}
}

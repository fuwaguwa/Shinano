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

puppeteer.use(Stealth());

let retries: number = 0;
export async function fetchTweets() 
{
	fetch("https://twitapi.fuwafuwa08.repl.co/altweet")
		.then(res => res.json())
		.then((json) => 
		{
			const tweetJsonDir = path.join(
				__dirname,
				"..",
				"..",
				"data",
				"tweetsInfo.json"
			);

			fs.readFile(tweetJsonDir, "utf-8", (err, data) => 
			{
				const tweetsInfo = JSON.parse(data);

				const response = json.data;
				response.sort((a, b) => b.id - a.id);
				const tweet = response[0];

				const result = tweetsInfo.tweets.find(tweetI => tweetI.id == tweet.id);

				if (
					!result &&
					!(tweet.text && tweet.text.includes("Age-restricted adult content"))
				) 
				{
					let tweetUrl = tweet.url;
					if (
						tweet.media.find(
							media =>
								media.type.toLowerCase() === "snscrape.modules.twitter.cideo"
						)
					)
						tweetUrl =
							"https://vxtwitter.com/" +
							tweetUrl.split("https://twitter.com/")[1];

					tweetsInfo.tweets.push({
						id: tweet.id,
						url: tweetUrl,
						raw: tweet.rawContent,
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

						const message = await (channel as TextChannel).send({
							files: [new AttachmentBuilder(buffer, { name: "image.gif", })],
						});

						img = message.attachments.first().url;
					}

					tweetsInfo.tweets.push({
						id: tweet.id,
						url: tweet.url,
						raw: text,
						img: img,
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
	if (tweet.raw.includes("RT @")) return;

	let messageOptions: MessageCreateOptions;

	if (tweet.url.includes("azurlane_staff")) 
	{
		const translate: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setCustomId(`JTWT-${tweet.id}`)
					.setLabel("Translate Tweet")
					.setEmoji({ id: "1065640481687617648", })
			);
		messageOptions = {
			content:
				"__Shikikans, a new message has arrived from JP HQ!__\n" + tweet.url,
			components: [translate],
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
				"__Shikikans, a new message has arrived from EN HQ!__\n" + tweet.url,
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
			console.warn(error);
			if (error.name.includes("DiscordAPIError[10004]")) await doc.delete();
		}
	}
}

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder
} from "discord.js";
import { SauceOptions } from "../typings/Sauce";
import { isImageAndGif } from "./Utils";
import fetch from "node-fetch";
import sagiri from "sagiri";

const sClient = sagiri(process.env.saucenaoApiKey);

const emojis = {
	Pixiv: "<:pixiv:1003211984747118642>",
	Twitter: "<:twitter:1003211986697453680>",
	Danbooru: "<:danbooru:1003212182156230686>",
	Gelbooru: "<:gelbooru:1003211988916252682>",
	"Yande.re": "🔪",
	Konachan: "⭐",
	Fantia: "<:fantia:1003211990673670194>",
	AniDB: "<:anidb:1003211992410107924>",
};

export async function findSauce({
	interaction,
	link,
	ephemeral,
}: SauceOptions) 
{
	/**
	 * Filtering Inputs
	 */
	await interaction.deferReply({ ephemeral, });
	let wait: EmbedBuilder = new EmbedBuilder()
		.setTitle("Processing...")
		.setColor("Green")
		.setDescription(
			"<a:lod:1021265223707000923> | Validating Link...\n<a:lod:1021265223707000923> | Searching For Sauce...\n<a:lod:1021265223707000923> | Filtering..."
		);
	await interaction.editReply({ embeds: [wait], });

	if (!isImageAndGif(link)) 
	{
		const failed: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("Must be an image/gif!");
		return interaction.editReply({ embeds: [failed], });
	}

	const response = await fetch(link);
	if (response.status !== 200) 
	{
		const failed: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("Invalid image/gif link/file.");
		return interaction.editReply({ embeds: [failed], });
	}

	/**
	 * Finding sauce
	 */
	wait.setDescription(
		"✅ | Valid Link!\n" +
			"<a:lod:1021265223707000923> | Searching For Sauce...\n" +
			"<a:lod:1021265223707000923> | Filtering..."
	);
	await interaction.editReply({ embeds: [wait], });

	const results = await sClient(link);

	/**
	 * Processing
	 */
	if (results.length == 0) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No results were found!")
			.setImage(
				"https://cdn.discordapp.com/attachments/977409556638474250/999486337822507058/akairo-azur-lane.gif"
			);
		return interaction.editReply({ embeds: [noResult], });
	}

	/**
	 * Formatting links
	 */
	// Limited to 5 results
	const links: string[] = [];
	for (let i = 0; i < 5; i++) 
	{
		const sauce = results[i];
		links.push(`${sauce.url}|${sauce.similarity}%`);
	}

	/**
	 * Filtering
	 */
	wait.setDescription(
		"✅ | Valid Link!\n" +
			"✅ | Sauce Found!\n" +
			"<a:lod:1021265223707000923> | Filtering..."
	);
	await interaction.editReply({ embeds: [wait], });

	const firstResult = results[0];
	const resultEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Random")
		.setTitle("Sauce...Found?")
		.setThumbnail(firstResult.thumbnail)
		.setFooter({ text: "Similarity is displayed below.", });

	if (
		firstResult.raw.data.source &&
		firstResult.raw.header.index_name.includes("H-Anime")
	) 
	{
		/**
		 * GIFs & Animations
		 */
		resultEmbed.addFields({
			name: "Sauce: ",
			value: firstResult.raw.data.source,
		});
		resultEmbed.addFields({
			name: "Estimated Timestamp: ",
			value: firstResult.raw.data.est_time,
		});
	}
	else 
	{
		/**
		 * For other sources
		 */
		const danbooru = results.find(result => result.site === "Danbooru");
		const gelbooru = results.find(result => result.site === "Gelbooru");
		const yandere = results.find(result => result.site === "Yande.re");
		const konachan = results.find(result => result.site === "Konachan");
		const pixiv = results.find(result => result.site === "Pixiv");

		let infoFound: number = 0;

		if (danbooru) 
		{
			infoFound++;

			const info = danbooru.raw.data;
			let result = "";

			for (const data in info) 
			{
				if (data === "creator" && info[data].length > 0)
					result += `**Artist**: ${info[data]}\n`;
				if (data === "material" && info[data].length > 0)
					result += `**Material**: ${info[data]}\n`;
				if (data === "characters" && info[data].length > 0)
					result += `**Characters**: ${info[data]}\n`;
			}

			resultEmbed.addFields({ name: "Danbooru:", value: result, inline: true, });
		}

		if (gelbooru) 
		{
			infoFound++;

			const info = gelbooru.raw.data;
			let result = "";

			for (const data in info) 
			{
				if (data === "creator" && info[data].length > 0)
					result += `**Artist**: ${info[data]}\n`;
				if (data === "material" && info[data].length > 0)
					result += `**Material**: ${info[data]}\n`;
				if (data === "characters" && info[data].length > 0)
					result += `**Characters**: ${info[data]}\n`;
			}

			resultEmbed.addFields({ name: "Gelbooru:", value: result, });
		}

		if (pixiv) 
		{
			infoFound++;

			const info = pixiv.raw.data;
			let result = "";

			for (const data in info) 
			{
				if (data === "title") result += `**Title**: ${info[data]}\n`;
				if (data === "member_name") result += `**Artist**: ${info[data]}\n`;
				if (data === "member_id") result += `**Artist ID**: ${info[data]}\n`;
			}

			resultEmbed.addFields({
				name: "Pixiv:",
				value: result,
				inline: infoFound % 2 == 0,
			});
		}

		if (yandere) 
		{
			infoFound++;

			const info = yandere.raw.data;
			let result = "";

			for (const data in info) 
			{
				if (data === "creator" && info[data].length > 0)
					result += `**Artist**: ${info[data]}\n`;
				if (data === "material" && info[data].length > 0)
					result += `**Material**: ${info[data]}\n`;
				if (data === "characters" && info[data].length > 0)
					result += `**Characters**: ${info[data]}\n`;
			}

			resultEmbed.addFields({
				name: "Yande.re:",
				value: result,
			});
		}

		if (konachan && infoFound < 4) 
		{
			const info = konachan.raw.data;
			let result = "";

			for (const data in info) 
			{
				if (data === "creator" && info[data].length > 0)
					result += `**Artist**: ${info[data]}\n`;
				if (data === "material" && info[data].length > 0)
					result += `**Material**: ${info[data]}\n`;
				if (data === "characters" && info[data].length > 0)
					result += `**Characters**: ${info[data]}\n`;
			}

			resultEmbed.addFields({
				name: "Konachan:",
				value: result,
				inline: infoFound % 2 == 1,
			});
		}
	}

	const sortedLinks = {};
	links.forEach((link) => 
	{
		switch (true) 
		{
			case link.includes("pixiv.net"): {
				if (!sortedLinks["Pixiv"]) 
				{
					sortedLinks["Pixiv"] = link;
				}
				break;
			}

			case link.includes("danbooru.donmai.us"): {
				if (!sortedLinks["Danbooru"]) 
				{
					sortedLinks["Danbooru"] = link;
				}
				break;
			}

			case link.includes("gelbooru.com"): {
				if (!sortedLinks["Gelbooru"]) 
				{
					sortedLinks["Gelbooru"] = link;
				}
				break;
			}

			case link.includes("konachan.com"): {
				if (!sortedLinks["Konachan"]) 
				{
					sortedLinks["Konachan"] = link;
				}
				break;
			}

			case link.includes("yande.re"): {
				if (!sortedLinks["Yande.re"]) 
				{
					sortedLinks["Yande.re"] = link;
				}
				break;
			}

			case link.includes("fantia.jp"): {
				if (!sortedLinks["Fantia"]) 
				{
					sortedLinks["Fantia"] = link;
				}
				break;
			}

			case link.includes("anidb.net"): {
				if (!sortedLinks["AniDB"]) 
				{
					sortedLinks["AniDB"] = link;
				}
				break;
			}
		}
	});

	/**
	 * Buttons
	 */
	const sauceURLs: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>();
	for (const link in sortedLinks) 
	{
		const source = sortedLinks[link].split("|")[0];
		const similarity = sortedLinks[link].split("|")[1];

		sauceURLs.addComponents(
			new ButtonBuilder()
				.setLabel(`${link} (${similarity})`)
				.setStyle(ButtonStyle.Link)
				.setEmoji(emojis[link])
				.setURL(source)
		);
	}

	/**
	 * Outputting
	 */
	wait.setDescription(
		"✅ | Valid Link!\n" +
			"✅ | Searching For Sauce...\n" +
			"✅ | Link Filtered!"
	);
	await interaction.editReply({ embeds: [wait], });

	return interaction.editReply({
		embeds: [resultEmbed],
		components: [sauceURLs],
	});
}

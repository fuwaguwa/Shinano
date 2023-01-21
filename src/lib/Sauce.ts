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
	 * Filtering sauce
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

	const firstResult = results[0];
	const raw = firstResult.raw;

	const resultEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Random")
		.setTitle("Sauce...Found?")
		.setThumbnail(firstResult.thumbnail)
		.setFooter({ text: "Similarity is displayed below.", });

	if (raw.data.source && raw.header.index_name.includes("H-Anime")) 
	{
		/**
		 * GIFs & Animations
		 */
		resultEmbed.addFields({
			name: "Sauce: ",
			value: raw.data.source,
		});
		resultEmbed.addFields({
			name: "Estimated Timestamp: ",
			value: raw.data.est_time,
		});
	}
	else 
	{
		/**
		 * For pixiv/danbooru
		 */
		if (raw.data.member_name)
			resultEmbed.addFields({
				name: "Artist: ",
				value: raw.data.member_name,
			});
		if (raw.data.creator)
			resultEmbed.addFields({
				name: "Artist: ",
				value: `${raw.data.creator}`,
			});
		if (raw.data.characters)
			resultEmbed.addFields({
				name: "Character: ",
				value: raw.data.characters,
			});
		if (raw.data.user_name)
			resultEmbed.addFields({
				name: "Artist: ",
				value: raw.data.user_name,
			});
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

	wait.setDescription(
		"✅ | Valid Link!\n" +
			"✅ | Sauce Found!\n" +
			"<a:lod:1021265223707000923> | Filtering..."
	);
	await interaction.editReply({ embeds: [wait], });

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

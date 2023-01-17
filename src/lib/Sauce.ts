import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { SauceNao } from "saucenao.js";
import { SauceOptions } from "../typings/Sauce";
import { isImageAndGif } from "./Utils";
import fetch from "node-fetch";

const sauce = new SauceNao({ api_key: process.env.saucenaoApiKey });

export async function getSauce({ interaction, link, ephemeral }: SauceOptions) {
	try {
		/**
		 * Filtering Inputs
		 */
		await interaction.deferReply({ ephemeral });
		let wait: EmbedBuilder = new EmbedBuilder()
			.setTitle("Processing...")
			.setColor("Green")
			.setDescription(
				"<a:lod:1021265223707000923> | Validating Link...\n<a:lod:1021265223707000923> | Searching For Sauce...\n<a:lod:1021265223707000923> | Filtering..."
			);
		await interaction.editReply({ embeds: [wait] });

		if (!isImageAndGif(link)) {
			const failed: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("Must be an image/gif!");
			return interaction.editReply({ embeds: [failed] });
		}

		const response = await fetch(link);
		if (response.status !== 200) {
			const failed: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("Invalid image/gif link/file.");
			return interaction.editReply({ embeds: [failed] });
		}

		/**
		 * Sauce Searching
		 */
		wait.setDescription(
			"✅ | Valid Link!\n<a:lod:1021265223707000923> | Searching For Sauce...\n<a:lod:1021265223707000923> | Filtering..."
		);
		await interaction.editReply({ embeds: [wait] });

		const emojis = {
			Pixiv: "1003211984747118642",
			Twitter: "1003211986697453680",
			Danbooru: "1003212182156230686",
			Gelbooru: "1003211988916252682",
			"Yande.re": "🔪",
			Konachan: "⭐",
			Fantia: "1003211990673670194",
			AniDB: "1003211992410107924",
		};

		sauce.find({ url: link }).then(async (sauce) => {
			if (sauce.results.length == 0) {
				const noResult: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setDescription("❌ | No result was found...")
					.setImage(
						"https://cdn.discordapp.com/attachments/977409556638474250/999486337822507058/akairo-azur-lane.gif"
					);
				return interaction.editReply({ embeds: [noResult] });
			}

			let result: EmbedBuilder = new EmbedBuilder()
				.setColor("Random")
				.setTitle("Sauce...Found?")
				.setThumbnail(sauce.results[0].header.thumbnail);
			if (
				sauce.results[0].data.source &&
				sauce.results[0].header.index_name.includes("H-Anime")
			) {
				/**
				 * For animations/GIFs
				 */
				result.addFields({
					name: "Sauce: ",
					value: sauce.results[0].data.source,
				});
				result.addFields({
					name: "Estimated Timestamp: ",
					value: sauce.results[0].data.est_time,
				});
			} else {
				/**
				 * For pixiv/danbooru
				 */
				if (sauce.results[0].data.member_name)
					result.addFields({
						name: "Artist: ",
						value: sauce.results[0].data.member_name,
					});
				if (sauce.results[0].data.creator)
					result.addFields({
						name: "Artist: ",
						value: `${sauce.results[0].data.creator}`,
					});
				if (sauce.results[0].data.material)
					result.addFields({
						name: "Material: ",
						value: sauce.results[0].data.material,
					});
				if (sauce.results[0].data.characters)
					result.addFields({
						name: "Character: ",
						value: sauce.results[0].data.characters,
					});
				if (sauce.results[0].data.user_name)
					result.addFields({
						name: "Artist: ",
						value: sauce.results[0].data.user_name,
					});
			}

			/**
			 * Filtering Links
			 */
			const links: string[] = [];
			for (let i = 0; i < 5; i++) {
				const source = sauce.results[i];

				if (!source) return;
				if (source.data.ext_urls) {
					links.push(`${source.data.ext_urls[0]}|${source.header.similarity}%`);
				}
			}
			wait.setDescription(
				"✅ | Valid Link!\n✅ | Sauce Found!\n<a:lod:1021265223707000923> | Filtering..."
			);
			await interaction.editReply({ embeds: [wait] });

			let filteredLink = {};
			for (let i = 0; i < links.length; i++) {
				switch (true) {
					case links[i].includes("pixiv.net"): {
						if (!filteredLink["Pixiv"]) {
							filteredLink["Pixiv"] = links[i];
						}
						break;
					}

					case links[i].includes("danbooru.donmai.us"): {
						if (!filteredLink["Danbooru"]) {
							filteredLink["Danbooru"] = links[i];
						}
						break;
					}

					case links[i].includes("gelbooru.com"): {
						if (!filteredLink["Gelbooru"]) {
							filteredLink["Gelbooru"] = links[i];
						}
						break;
					}

					case links[i].includes("konachan.com"): {
						if (!filteredLink["Konachan"]) {
							filteredLink["Konachan"] = links[i];
						}
						break;
					}

					case links[i].includes("yande.re"): {
						if (!filteredLink["Yande.re"]) {
							filteredLink["Yande.re"] = links[i];
						}
						break;
					}

					case links[i].includes("fantia.jp"): {
						if (!filteredLink["Fantia"]) {
							filteredLink["Fantia"] = links[i];
						}
						break;
					}

					case links[i].includes("anidb.net"): {
						if (!filteredLink["AniDB"]) {
							filteredLink["AniDB"] = links[i];
						}
						break;
					}
				}
			}
			if (Object.keys(filteredLink).length == 0)
				return interaction.editReply({ embeds: [result] });

			/**
			 * Links Buttons
			 */
			const sauceUrls: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>();
			for (let link in filteredLink) {
				switch (link) {
					case "Pixiv": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Pixiv (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ id: emojis["Pixiv"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Danbooru": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Danbooru (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ id: emojis["Danbooru"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Gelbooru": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Gelbooru (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ id: emojis["Gelbooru"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Konachan": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Konachan (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ name: emojis["Konachan"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Yande.re": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Yande.re (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ name: emojis["Yande.re"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "Fantia": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`Fantia (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ id: emojis["Fantia"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}

					case "AniDB": {
						sauceUrls.addComponents(
							new ButtonBuilder()
								.setLabel(`AniDB (${filteredLink[link].split("|")[1]})`)
								.setStyle(ButtonStyle.Link)
								.setEmoji({ id: emojis["AniDB"] })
								.setURL(filteredLink[link].split("|")[0])
						);
						break;
					}
				}
			}

			/**
			 * Outputting
			 */
			wait.setDescription(
				"✅ | Valid Link!\n✅ | Sauce Found!\n✅ | Filtered!"
			);
			await interaction.editReply({ embeds: [wait] });

			if (sauceUrls.components.length === 0) {
				result.setDescription(
					`Similarity: ${sauce.results[0].header.similarity}%`
				);
				return interaction.editReply({ embeds: [result] });
			}
			result.setFooter({ text: "Similarity is displayed below." });
			return interaction.editReply({
				embeds: [result],
				components: [sauceUrls],
			});
		});
	} catch (err) {
		/**
		 * Error Catching
		 */
		const errorEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(`[${err.name}] ${err.message}`)
			.setFooter({
				text: "Please use the command again or contact support!",
			});
		const button: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel("Support Server")
					.setEmoji("⚙️")
					.setURL("https://discord.gg/NFkMxFeEWr")
			);

		interaction.deferred
			? await interaction.editReply({
					embeds: [errorEmbed],
					components: [button],
			  })
			: await interaction.reply({
					embeds: [errorEmbed],
					components: [button],
			  });
	}
}

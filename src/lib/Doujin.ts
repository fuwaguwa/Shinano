import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { ShinanoPaginator } from "./Pages";
import { toTitleCase } from "./Utils";

/**
 * Get file type
 * @param type shorten file type
 * @returns file type
 */
function getFileType(type: string) 
{
	switch (type) 
	{
		case "j":
			return "jpg";
		case "p":
			return "png";
		case "g":
			return "gif";
	}
}

/**
 * Get doujin page url
 * @param doujin doujin
 * @param pageNumber page number
 * @returns page url
 */
function getPageLink(doujin, pageNumber) 
{
	const type = getFileType(doujin.images.pages[pageNumber].t);
	return `https://i.nhentai.net/galleries/${doujin.media_id}/${
		pageNumber + 1
	}.${type}`;
}

/**
 * Generate doujin pages from doujin
 * @param doujin doujin
 * @param title doujin's title
 * @returns embeds of doujin pages
 */
function genDoujinPage(doujin, title) 
{
	const doujinPages: EmbedBuilder[] = [];
	for (let i = 0; i < doujin.num_pages; i++) 
	{
		doujinPages.push(
			new EmbedBuilder()
				.setColor("#2f3136")
				.setDescription(
					`**[${title} | ${doujin.id}](https://nhentai.net/g/${doujin.id}/${i})**`
				)
				.setImage(getPageLink(doujin, i))
		);
	}
	return doujinPages;
}

/**
 * Get doujin tags
 * @param doujin doujin
 * @returns categorized doujin tags
 */
export function getDoujinTags(doujin) 
{
	const doujinTags: string[] = [];
	const doujinArtists: string[] = [];
	const doujinParodies: string[] = [];
	const doujinChars: string[] = [];
	const doujinLang: string[] = [];
	const doujinCategories: string[] = [];
	const doujinGroups: string[] = [];

	doujin.tags.forEach((tag) => 
	{
		let tagName = toTitleCase(tag.name);
		switch (tag.type) 
		{
			case "tag":
				doujinTags.push(tagName);
				break;
			case "artist":
				doujinArtists.push(tagName);
				break;
			case "parody":
				doujinParodies.push(tagName);
				break;
			case "character":
				doujinChars.push(tagName);
				break;
			case "language":
				doujinLang.push(tagName);
				break;
			case "category":
				doujinCategories.push(tagName);
				break;
			case "group":
				doujinGroups.push(tagName);
				break;
		}
	});

	return {
		tags: doujinTags,
		artists: doujinArtists,
		parodies: doujinParodies,
		characters: doujinChars,
		languages: doujinLang,
		categories: doujinCategories,
		groups: doujinGroups,
	};
}

/**
 * Generate embed of information for a doujin
 * @param doujin doujin
 * @param tagInfo doujin's tags
 * @returns doujin embed
 */
export function genDoujinEmbed(doujin, tagInfo) 
{
	const doujinTitle =
		doujin.title.pretty || doujin.title.english || doujin.title.japanese;
	const doujinThumbnail = getPageLink(doujin, 0);

	const mainInfo: EmbedBuilder = new EmbedBuilder()
		.setTitle(`${doujinTitle} | ${doujin.id}`)
		.setThumbnail(doujinThumbnail)
		.setColor("#2f3136")
		.setDescription("**Tags:**\n" + tagInfo.tags.join(", "))
		.setURL(`https://nhentai.net/g/${doujin.id}`);
	if (tagInfo.characters.length != 0)
		mainInfo.addFields({
			name: "Characters:",
			value: tagInfo.characters.join(", "),
			inline: false,
		});
	if (tagInfo.parodies.length != 0)
		mainInfo.addFields({
			name: "Parodies:",
			value: tagInfo.parodies.join(", "),
			inline: false,
		});
	if (tagInfo.languages.length != 0)
		mainInfo.addFields({
			name: "Languages:",
			value: tagInfo.languages.join(", "),
			inline: false,
		});
	if (tagInfo.categories.length != 0)
		mainInfo.addFields({
			name: "Categories:",
			value: tagInfo.categories.join(", "),
			inline: false,
		});
	if (tagInfo.artists.length != 0)
		mainInfo.addFields({
			name: "Artists:",
			value: tagInfo.artists.join(", "),
			inline: false,
		});
	if (tagInfo.groups.length != 0)
		mainInfo.addFields({
			name: "Groups:",
			value: tagInfo.groups.join(", "),
			inline: false,
		});
	mainInfo.addFields(
		{ name: "Pages:", value: `${doujin.num_pages}`, inline: true, },
		{ name: "Favorites:", value: `${doujin.num_favorites}`, inline: true, },
		{ name: "Upload Date:", value: `<t:${doujin.upload_date}:D>`, inline: true, }
	);

	return mainInfo;
}

/**
 * Display a menu for reading and information about a doujin
 * @param interaction ChatInputCommandInteraction
 * @param doujin doujin
 */
export async function displayDoujin(
	interaction: ChatInputCommandInteraction,
	doujin
) 
{
	const doujinTitle =
		doujin.title.pretty || doujin.title.english || doujin.title.japanese;
	const tagInfo = getDoujinTags(doujin);

	/**
	 * Filtering Tags
	 */
	const filter = tagInfo.tags.find((tag) => 
	{
		return (
			tag.includes("Lolicon") ||
			tag.includes("Guro") ||
			tag.includes("Scat") ||
			tag.includes("Insect") ||
			tag.includes("Shotacon") ||
			tag.includes("Amputee") ||
			tag.includes("Vomit") ||
			tag.includes("Vore")
		);
	});

	if (filter) 
	{
		const blacklisted: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				`❌ | Shinano found that the doujin contains a blacklisted tag (\`${filter.toLowerCase()}\`) and will not be displaying it here!\n`
			);
		return interaction.editReply({ embeds: [blacklisted], });
	}

	/**
	 * Components
	 */
	const mainInfo = await genDoujinEmbed(doujin, tagInfo);
	let doujinPages: EmbedBuilder[];
	if (doujin.num_pages <= 150) doujinPages = genDoujinPage(doujin, doujinTitle);

	const navigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`${doujin.id}-${interaction.user.id}`)
				.addOptions(
					{
						label: "Info",
						value: "info",
						emoji: "🔍",
						default: true,
					},
					{
						label: "Read",
						value: "read",
						emoji: "📰",
						default: false,
					}
				)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [mainInfo],
		components: [navigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 150000,
		});

	let lastPage: number = 0;

	collector.on("collect", async (i) => 
	{
		if (!i.customId.endsWith(`${i.user.id}`)) 
		{
			await i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}
		else 
		{
			const menu = navigation.components[0];

			if (i.values) 
			{
				await i.deferUpdate();
				switch (i.values[0]) 
				{
					case "info": {
						menu.options[0].setDefault(true);
						menu.options[1].setDefault(false);

						await i.editReply({
							embeds: [mainInfo],
							components: [navigation],
						});
						break;
					}

					case "read": {
						menu.options[0].setDefault(false);
						menu.options[1].setDefault(true);

						if (doujinPages) 
						{
							ShinanoPaginator({
								interaction,
								interactorOnly: true,
								pages: doujinPages,
								lastPage,
								menu: navigation,
								time: 150000,
							}).then((page) => 
							{
								lastPage = page;
							});
						}
						else 
						{
							const notAvailable: EmbedBuilder = new EmbedBuilder()
								.setColor("Red")
								.setDescription(
									"Unfortunately, we only support doujins that are under 150 pages long. Instead, you can read this doujin " +
										`[here](https://nhentai.net/g/${doujin.id})`
								);
							await i.editReply({
								embeds: [notAvailable],
								components: [navigation],
							});
						}
					}
				}
			}
		}
	});
}

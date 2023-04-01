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
import { collectors } from "../events/cmdInteraction";

/**
 * Generate doujin pages from doujin
 * @param doujin doujin
 * @param title doujin's title
 * @returns embeds of doujin pages
 */
function genDoujinPage(doujin, title) 
{
	const doujinPages: EmbedBuilder[] = [];
	for (let i = 0; i < doujin.body.pagesNumber; i++) 
	{
		doujinPages.push(
			new EmbedBuilder()
				.setColor("#2f3136")
				.setDescription(
					`**[${title} | ${doujin.body.id}](${doujin.body.pages[i]})**`
				)
				.setImage(doujin.body.pages[i])
		);
	}
	return doujinPages;
}

/**
 * Generate embed of information for a doujin
 * @param doujin doujin
 * @returns doujin embed
 */
export function genDoujinEmbed(doujin) 
{
	const doujinTitle =
		doujin.body.title.pretty ||
		doujin.body.title.english ||
		doujin.body.title.japanese;

	const mainInfo: EmbedBuilder = new EmbedBuilder()
		.setTitle(`${doujinTitle} | ${doujin.body.id}`)
		.setThumbnail(doujin.body.pages[0])
		.setColor("#2f3136")
		.setDescription("**Tags:**\n" + doujin.body.tags.tags.join(", "))
		.setURL(`https://nhentai.net/g/${doujin.body.id}`);
	if (doujin.body.tags.characters.length != 0)
		mainInfo.addFields({
			name: "Characters:",
			value: doujin.body.tags.characters.join(", "),
			inline: false,
		});
	if (doujin.body.tags.parodies.length != 0)
		mainInfo.addFields({
			name: "Parodies:",
			value: doujin.body.tags.parodies.join(", "),
			inline: false,
		});
	if (doujin.body.tags.languages.length != 0)
		mainInfo.addFields({
			name: "Languages:",
			value: doujin.body.tags.languages.join(", "),
			inline: false,
		});
	if (doujin.body.tags.categories.length != 0)
		mainInfo.addFields({
			name: "Categories:",
			value: doujin.body.tags.categories.join(", "),
			inline: false,
		});
	if (doujin.body.tags.artists.length != 0)
		mainInfo.addFields({
			name: "Artists:",
			value: doujin.body.tags.artists.join(", "),
			inline: false,
		});
	if (doujin.body.tags.groups.length != 0)
		mainInfo.addFields({
			name: "Groups:",
			value: doujin.body.tags.groups.join(", "),
			inline: false,
		});
	mainInfo.addFields(
		{ name: "Pages:", value: `${doujin.body.pagesNumber}`, inline: true, },
		{ name: "Favorites:", value: `${doujin.body.favorites}`, inline: true, },
		{
			name: "Upload Date:",
			value: `<t:${doujin.body.uploadTimestamp}:D>`,
			inline: true,
		}
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
		doujin.body.title.pretty ||
		doujin.body.title.english ||
		doujin.body.title.japanese;

	/**
	 * Filtering Tags
	 */
	const filter = doujin.body.tags.tags.find((tag) => 
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
	const mainInfo = await genDoujinEmbed(doujin);
	let doujinPages: EmbedBuilder[];
	if (doujin.body.pagesNumber <= 150)
		doujinPages = genDoujinPage(doujin, doujinTitle);

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

	collectors.set(interaction.user.id, collector);

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
										`[here](https://nhentai.net/g/${doujin.body.id})`
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

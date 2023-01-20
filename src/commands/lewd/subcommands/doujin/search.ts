import {
	ActionRowBuilder,
	ButtonBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import fetch from "node-fetch";
import { genDoujinEmbed, getDoujinTags } from "../../../../lib/Doujin";
import { ShinanoPaginator } from "../../../../lib/Pages";
import { getNHentaiIP } from "../../../../lib/Utils";
import code from "./code";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Getting doujin info
	 */
	const nhentaiIP = await getNHentaiIP();
	const name: string = interaction.options.getString("search-query");
	const sorting: string = interaction.options.getString("sorting") || "popular";
	const blacklist: string =
		"-lolicon -scat -guro -insect -shotacon -amputee -vomit -vore";
	const response = await fetch(
		`${nhentaiIP}/api/galleries/search?query=${name} ${blacklist}&sort=${sorting}`,
		{ method: "GET", }
	);
	const searchResults = await response.json();

	if (searchResults.error || searchResults.result.length == 0) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No Result!");
		return interaction.editReply({ embeds: [noResult], });
	}

	/**
	 * Displaying Search Results
	 */
	const doujinResults: EmbedBuilder[] = [];

	let count: number = 10;
	if (searchResults.result.length < 10) count = searchResults.result.length;

	const resultNavigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`RES-${interaction.user.id}`)
				.setPlaceholder(`Doujin Search Results (${count})`)
		);

	for (let i = 0; i < count; i++) 
	{
		const result = searchResults.result[i];
		const tagsInfo = getDoujinTags(result);

		doujinResults.push(genDoujinEmbed(result, tagsInfo));

		resultNavigation.components[0].addOptions({
			label: `Page ${i + 1} | ${result.id}`,
			value: `${result.id}`,
		});
	}

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [doujinResults[0]],
		components: [resultNavigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 60000,
		});

	await ShinanoPaginator({
		interaction,
		interactorOnly: true,
		pages: doujinResults,
		menu: resultNavigation,
		time: 60000,
	});

	collector.on("collect", async i => 
	{
		if (!i.customId.endsWith(i.user.id)) 
		{
			await i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		}
		else 
		{
			await i.deferUpdate();

			const menu = resultNavigation.components[0];
			for (let j = 0; j < menu.options.length; j++) 
			{
				menu.options[j].data.value === i.values[0]
					? menu.options[j].setDefault(true)
					: menu.options[j].setDefault(false);
			}

			await code(interaction, i.values[0]);

			collector.stop("Processed");
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		// Timeout
		if (reason !== "Processed") 
		{
			resultNavigation.components[0].setDisabled(true);
			await interaction.editReply({ components: [resultNavigation], });
		}
	});
};

import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuInteraction,
	StringSelectMenuBuilder
} from "discord.js";
import fetch from "node-fetch";
import { characterInfo } from "../../../../lib/Anime";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Processing data
	 */
	const characterName: string = interaction.options
		.getString("name")
		.toLowerCase();
	const query = `q=${characterName}&order_by=popularity&limit=10&sfw=true`;
	const response = await fetch(`https://api.jikan.moe/v4/characters?${query}`, {
		method: "GET",
	});

	const charResponse = (await response.json()).data;
	if (charResponse.length == 0) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("No result can be found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	/**
	 * Menu
	 */
	const results: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`CHARES-${interaction.user.id}`)
				.setPlaceholder(`Character Search Results (${charResponse.length})`)
		);
	charResponse.forEach((result) => 
	{
		results.components[0].addOptions({
			label: `${result.name} | ${
				result.name_kanji ? result.name_kanji : "No Kanji Name"
			}`,
			value: `${result.mal_id}`,
		});
	});

	/**
	 * Collector
	 */
	const message = await interaction.editReply({ components: [results], });
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	collector.on("collect", async (i) => 
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

			const response = await fetch(
				`https://api.jikan.moe/v4/characters/${i.values[0]}/full`,
				{ method: "GET", }
			);
			const character = (await response.json()).data;

			let VAs: string[] = [];
			if (character && character.voices) 
			{
				character.voices.forEach((va) => 
				{
					if (va.language !== "Japanese" && va.language !== "English") return;
					VAs.push(`[${va.person.name}](${va.person.url})`);
				});
			}

			const characterEmbed = await characterInfo(character, VAs);

			const menu = results.components[0];
			for (let j = 0; j < menu.options.length; j++) 
			{
				menu.options[j].data.value === i.values[0]
					? menu.options[j].setDefault(true)
					: menu.options[j].setDefault(false);
			}

			await i.editReply({
				embeds: [characterEmbed],
				components: [results],
			});

			collector.resetTimer();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		results.components[0].setDisabled(true);
		await interaction.editReply({ components: [results], });
	});
};

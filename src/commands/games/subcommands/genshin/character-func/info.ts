import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { Character } from "genshin-db";
import { ShinanoPaginator } from "../../../../../lib/Pages";
import { ShinanoCharacter } from "../../../../../structures/Character";

export = async (
	interaction: ChatInputCommandInteraction,
	character: Character
) => 
{
	const characterClass = new ShinanoCharacter(character);
	const characterInfo = characterClass.getCharacterEmbeds();

	/**
	 * Menu
	 */
	const navigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`${character.name}-${interaction.user.id}`)
				.setOptions(
					{
						label: "Info",
						value: "info",
						emoji: "📝",
						default: true,
					},
					{
						label: "Constellations",
						value: "constellations",
						emoji: "⭐",
						default: false,
					},
					{
						label: "Ascension Costs",
						value: "costs",
						emoji: "💵",
						default: false,
					}
				)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [characterInfo.generalInfo],
		components: [navigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	let consPage: number = 0;
	let acPage: number = 0;

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

			const menuOptions = navigation.components[0].options;

			for (let j = 0; j < menuOptions.length; j++) 
			{
				menuOptions[j].data.value === i.values[0]
					? menuOptions[j].setDefault(true)
					: menuOptions[j].setDefault(false);
			}

			switch (i.values[0]) 
			{
				case "info": {
					await i.editReply({
						embeds: [characterInfo.generalInfo],
						components: [navigation],
					});

					break;
				}

				case "constellations": {
					if (characterInfo.travellerConstellations.length != 0) 
					{
						ShinanoPaginator({
							interaction,
							menu: navigation,
							interactorOnly: true,
							lastPage: consPage,
							pages: characterInfo.travellerConstellations,
							time: 120000,
						}).then((page) => 
						{
							consPage = page;
						});
					}
					else 
					{
						await i.editReply({
							embeds: [characterInfo.constellations],
							components: [navigation],
						});
					}

					break;
				}

				case "costs": {
					ShinanoPaginator({
						interaction,
						menu: navigation,
						interactorOnly: true,
						lastPage: acPage,
						pages: characterInfo.ascensionCosts,
						time: 120000,
					}).then((page) => 
					{
						acPage = page;
					});

					break;
				}
			}
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		navigation.components[0].setDisabled(true);
		await interaction.editReply({ components: [navigation], });
	});
};

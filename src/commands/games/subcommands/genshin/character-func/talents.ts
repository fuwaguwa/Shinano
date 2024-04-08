import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { Character } from "genshin-db";
import { toTitleCase } from "../../../../../lib/Utils";
import genshin from "genshin-db";
import { color } from "../../../../../lib/Genshin";
import { ShinanoPaginator } from "../../../../../lib/Pages";
import { collectors } from "../../../../../events/cmdInteraction";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Filtering
	 */
	let characterName = toTitleCase(
		interaction.options.getString("character-name").toLowerCase()
	);
	let character: Character;

	if (characterName.toLowerCase().includes("traveler")) 
	{
		if (characterName.split(" ")[0] !== "Traveler")
			characterName = toTitleCase(`Traveler (${characterName.split(" ")[0]})`);
		character = genshin.characters("Aether");
	}
	else 
	{
		character = genshin.characters(characterName);

		if (!character) 
		{
			const noResult: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("❌ | No character found!");
			return interaction.editReply({ embeds: [noResult], });
		}
	}

	let embedColor;
	if (characterName === "Aether" || characterName === "Lumine") 
	{
		embedColor = color(characterName.split(" ")[0]);
	}
	else 
	{
		embedColor = color(character);
	}

	/**
	 * Talents
	 */
	const talents = genshin.talents(characterName);
	const charTalentsEmbeds: EmbedBuilder[] = [];

	let combatCount = 3;
	if (talents.combatsp) combatCount++;

	for (let i = 0; i < combatCount; i++) 
	{
		const embed: EmbedBuilder = new EmbedBuilder()
			.setColor(embedColor)
			.setThumbnail(character.images.mihoyo_icon);

		switch (i + 1) 
		{
			case 1: {
				embed
					.setTitle(`${character.name}'s Talents | Normal Attack`)
					.setDescription(
						`**${talents.combat1.name}**\n` + talents.combat1.description
					);
				break;
			}

			case 2: {
				embed
					.setTitle(`${character.name}'s Talents | Elemental Skill`)
					.setDescription(
						`*${talents.combat2.description}*\n\n` +
							`**Elemental Skill: ${talents.combat2.name}**\n` +
							talents.combat2.description
					);
				break;
			}

			case 3: {
				embed
					.setTitle(`${character.name}'s Talents | Elemental Burst`)
					.setDescription(
						`*${talents.combat3.description}*\n\n` +
							`**Elemental Burst: ${talents.combat3.name}**\n` +
							talents.combat3.description
					);
				break;
			}

			case 4: {
				embed.setTitle(`${character.name}'s Talents | SP Skill`).setFields({
					name: "Alternate Sprint",
					value: talents.combatsp.description,
				});
				break;
			}
		}
		charTalentsEmbeds.push(embed);
	}

	let passiveCount = 2;
	if (talents.passive3) passiveCount++;
	if (talents.passive4) passiveCount++;

	for (let i = 0; i < passiveCount; i++) 
	{
		const embed: EmbedBuilder = new EmbedBuilder()
			.setColor(embedColor)
			.setTitle(`${character.name}'s Talents | Passive ${i + 1}`)
			.setThumbnail(character.images.mihoyo_icon)
			.setFields({
				name: `Passive: ${talents[`passive${i + 1}`].name}`,
				value: talents[`passive${i + 1}`].description,
			});
		charTalentsEmbeds.push(embed);
	}

	/**
	 * Costs
	 */
	const talentCosts = talents.costs;

	const costs = [];
	const talentsCostsEmbeds: EmbedBuilder[] = [];

	for (let level in talentCosts) 
	{
		let matz = [];
		talentCosts[level].forEach((item) => 
		{
			matz.push(`${item.count}x **${item.name}**`);
		});
		costs.push(matz.join("\n"));
	}

	for (let i = 0; i < costs.length; i++) 
	{
		talentsCostsEmbeds.push(
			new EmbedBuilder()
				.setColor(embedColor)
				.setTitle(`${character.name}'s Talents Costs`)
				.setThumbnail(character.images.mihoyo_icon)
				.setFields({ name: `Level ${i + 2}`, value: costs[i], })
		);
	}

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
						label: "Talent Info",
						value: "info",
						emoji: "📝",
						default: true,
					},
					{
						label: "Talent Costs",
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
		embeds: [charTalentsEmbeds[0]],
		components: [navigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	collectors.set(interaction.user.id, collector);

	let costPage: number = 0;
	let infoPage: number = 0;

	ShinanoPaginator({
		interaction,
		menu: navigation,
		interactorOnly: true,
		lastPage: infoPage,
		pages: charTalentsEmbeds,
		time: 120000,
	}).then((page) => 
	{
		infoPage = page;
	});

	collector.on("collect", async (i) => 
	{
		if (!i.customId.endsWith(i.user.id)) 
		{
			await i.reply({
				content: "\"This menu does not pertain to you!\"",
				ephemeral: true,
			});
		}
		else 
		{
			await i.deferUpdate();

			const menuOptions = navigation.components[0].options;

			for (let j = 0; j < menuOptions.length; j++) 
			{
				menuOptions[j].setDefault(menuOptions[j].data.value === i.values[0]);
			}

			switch (i.values[0]) 
			{
				case "info": {
					ShinanoPaginator({
						interaction,
						menu: navigation,
						lastPage: infoPage,
						interactorOnly: true,
						pages: charTalentsEmbeds,
						time: 120000,
					}).then((page) => 
					{
						infoPage = page;
					});

					break;
				}

				case "costs": {
					ShinanoPaginator({
						interaction,
						menu: navigation,
						lastPage: costPage,
						interactorOnly: true,
						pages: talentsCostsEmbeds,
						time: 120000,
					}).then((page) => 
					{
						costPage = page;
					});

					break;
				}
			}
		}
	});
};

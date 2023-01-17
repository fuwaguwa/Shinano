import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from "discord.js";
import { Character } from "genshin-db";
import { toTitleCase } from "../../../../../lib/Utils";
import genshin from "genshin-db";
import { color } from "../../../../../lib/Genshin";
import { ShinanoPaginator } from "../../../../../lib/Pages";

export = async (interaction: ChatInputCommandInteraction) => {
	/**
	 * Filtering
	 */
	let characterName = toTitleCase(
		interaction.options.getString("character-name").toLowerCase()
	);
	let character: Character;

	if (characterName.toLowerCase().includes("traveler")) {
		if (characterName.split(" ")[0] !== "Traveler")
			characterName = toTitleCase(`Traveler (${characterName.split(" ")[0]})`);
		character = genshin.characters("Aether");
	} else {
		character = genshin.characters(characterName);

		if (!character) {
			const noResult: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription("❌ | No character found!");
			return interaction.editReply({ embeds: [noResult] });
		}
	}

	let embedColor;
	if (characterName === "Aether" || characterName === "Lumine") {
		embedColor = color(characterName.split(" ")[0]);
	} else {
		embedColor = color(character);
	}

	/**
	 * Talents
	 */
	const talents = genshin.talents(characterName);
	const charTalentsEmbeds: EmbedBuilder[] = [];

	let combatCount = 3;
	if (talents.combatsp) combatCount++;

	for (let i = 0; i < combatCount; i++) {
		const embed: EmbedBuilder = new EmbedBuilder()
			.setColor(embedColor)
			.setThumbnail(character.images.icon);

		switch (i + 1) {
			case 1: {
				embed
					.setTitle(`${characterName}'s Talents | Normal Attack`)
					.setDescription(
						`**${talents.combat1.name}**\n` + talents.combat1.info
					);
				break;
			}

			case 2: {
				embed
					.setTitle(`${characterName}'s Talents | Elemental Skill`)
					.setDescription(
						`*${talents.combat2.description}*\n\n` +
							`**Elemental Skill: ${talents.combat2.name}**\n` +
							talents.combat2.info
					);
				break;
			}

			case 3: {
				embed
					.setTitle(`${characterName}'s Talents | Elemental Burst`)
					.setDescription(
						`*${talents.combat3.description}*\n\n` +
							`**Elemental Burst: ${talents.combat3.name}**\n` +
							talents.combat3.info
					);
				break;
			}

			case 4: {
				embed.setTitle(`${characterName}'s Talents | SP Skill`).setFields({
					name: `Alternate Sprint`,
					value: talents.combatsp.info,
				});
				break;
			}
		}
		charTalentsEmbeds.push(embed);
	}

	let passiveCount = 2;
	if (talents.passive3) passiveCount++;
	if (talents.passive4) passiveCount++;

	for (let i = 0; i < passiveCount; i++) {
		const embed: EmbedBuilder = new EmbedBuilder()
			.setColor(embedColor)
			.setTitle(`${characterName}'s Talents | Passive ${i + 1}`)
			.setThumbnail(character.images.icon)
			.setFields({
				name: `Passive: ${talents[`passive${i + 1}`].name}`,
				value: talents[`passive${i + 1}`].info,
			});
		charTalentsEmbeds.push(embed);
	}

	/**
	 * Costs
	 */
	const talentCosts = talents.costs;

	const costs = [];
	const talentsCostsEmbeds: EmbedBuilder[] = [];

	for (let level in talentCosts) {
		let matz = [];
		talentCosts[level].forEach((item) => {
			matz.push(`${item.count}x **${item.name}**`);
		});
		costs.push(matz.join("\n"));
	}

	for (let i = 0; i < costs.length; i++) {
		talentsCostsEmbeds.push(
			new EmbedBuilder()
				.setColor(embedColor)
				.setTitle(`${character.name}'s Talents Costs`)
				.setThumbnail(character.images.icon)
				.setFields({ name: `Level ${i + 2}`, value: costs[i] })
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

	await ShinanoPaginator({
		interaction,
		menu: navigation,
		interactorOnly: true,
		pages: charTalentsEmbeds,
		time: 120000,
	});

	collector.on("collect", async (i) => {
		if (!i.customId.endsWith(i.user.id)) {
			await i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		} else {
			await i.deferUpdate();

			const menuOptions = navigation.components[0].options;

			for (let j = 0; j < menuOptions.length; j++) {
				menuOptions[j].data.value === i.values[0]
					? menuOptions[j].setDefault(true)
					: menuOptions[j].setDefault(false);
			}

			switch (i.values[0]) {
				case "info": {
					await ShinanoPaginator({
						interaction,
						menu: navigation,
						interactorOnly: true,
						pages: charTalentsEmbeds,
						time: 120000,
					});

					break;
				}

				case "costs": {
					await ShinanoPaginator({
						interaction,
						menu: navigation,
						interactorOnly: true,
						pages: talentsCostsEmbeds,
						time: 120000,
					});

					break;
				}
			}
		}
	});
};

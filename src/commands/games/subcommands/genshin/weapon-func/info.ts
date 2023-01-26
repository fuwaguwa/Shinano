import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { Weapon } from "genshin-db";
import { ShinanoPaginator } from "../../../../../lib/Pages";
import { ShinanoWeapon } from "../../../../../structures/Weapon";

export = async (interaction: ChatInputCommandInteraction, weapon: Weapon) => 
{
	const weaponClass = new ShinanoWeapon(weapon);
	const weaponInfo = weaponClass.getWeaponEmbeds();

	/**
	 * Menu
	 */
	const navigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`WEAPON-${interaction.user.id}`)
				.setOptions(
					{
						label: "Info",
						value: "info",
						emoji: "📝",
						default: true,
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
		embeds: [weaponInfo.generalInfo],
		components: [navigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

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
				menuOptions[j].setDefault(menuOptions[j].data.value === i.values[0]);
			}

			switch (i.values[0]) 
			{
				case "info": {
					await i.editReply({
						embeds: [weaponInfo.generalInfo],
						components: [navigation],
					});

					break;
				}

				case "costs": {
					ShinanoPaginator({
						interaction,
						menu: navigation,
						interactorOnly: true,
						lastPage: acPage,
						pages: weaponInfo.ascensionCost,
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

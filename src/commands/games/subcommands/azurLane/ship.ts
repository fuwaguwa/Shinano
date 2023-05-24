import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { ShinanoPaginator } from "../../../../lib/Pages";
import { ShinanoShip } from "../../../../structures/Ship";
import { collectors } from "../../../../events/cmdInteraction";

export = async (interaction: ChatInputCommandInteraction, AL: any) => 
{
	/**
	 * Getting ship
	 */
	const shipName: string = interaction.options.getString("ship-name");
	const shipInfo = await AL.ships.get(shipName);
	if (!shipInfo) 
	{
		const shipNotFound: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | I couldn't find that ship...");
		return interaction.editReply({ embeds: [shipNotFound], });
	}

	const ship = await new ShinanoShip(shipInfo).getShipEmbeds();

	/**
	 * Menu
	 */
	const categories: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setPlaceholder("Categories")
				.setCustomId(`${shipName}-${interaction.user.id}`)
				.setOptions(
					{
						label: "Info",
						value: "info",
						default: true,
						emoji: "🔍",
					},
					{
						label: "Tech",
						value: "tech",
						default: false,
						emoji: "🛠",
					},
					{
						label: "Stats",
						value: "stats",
						default: false,
						emoji: "🚢",
					},
					{
						label: "Skills",
						value: "skills",
						default: false,
						emoji: "📚",
					},
					{
						label: "Skins",
						value: "skins",
						default: false,
						emoji: "<:GEAMS:1002198674539036672>",
					}
				)
		);
	if (ship.gallery.length != 0)
		categories.components[0].addOptions({
			label: "Gallery",
			value: "gallery",
			default: false,
			emoji: "📸",
		});

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [ship.generalInfo],
		components: [categories],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	collectors.set(interaction.user.id, collector);

	let skinPage: number = 0;
	let galleryPage: number = 0;

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
			const menuOptions = categories.components[0].options;

			await i.deferUpdate();

			for (let j = 0; j < menuOptions.length; j++) 
			{
				menuOptions[j].setDefault(menuOptions[j].data.value === i.values[0]);
			}

			switch (i.values[0]) 
			{
				case "info": {
					await i.editReply({
						embeds: [ship.generalInfo],
						components: [categories],
					});

					break;
				}

				case "tech": {
					await i.editReply({
						embeds: [ship.tech],
						components: [categories],
					});

					break;
				}

				case "stats": {
					await i.editReply({
						embeds: [ship.stats],
						components: [categories],
					});

					break;
				}

				case "skills": {
					await i.editReply({
						embeds: [ship.skills],
						components: [categories],
					});

					break;
				}

				case "skins": {
					ShinanoPaginator({
						interaction,
						menu: categories,
						lastPage: skinPage,
						interactorOnly: true,
						pages: ship.skins,
						time: 120000,
					}).then((page) => 
					{
						skinPage = page;
					});

					break;
				}

				case "gallery": {
					ShinanoPaginator({
						interaction,
						menu: categories,
						lastPage: galleryPage,
						interactorOnly: true,
						pages: ship.gallery,
						time: 120000,
					}).then((page) => 
					{
						galleryPage = page;
					});

					break;
				}
			}

			collector.resetTimer();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		categories.components[0].setDisabled(true);
		await interaction.editReply({ components: [categories], });
	});
};

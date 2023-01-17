import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from "discord.js";
import { ShinanoPaginator } from "../../../../lib/Pages";
import { ShinanoShip } from "../../../../structures/Ship";

export = async (interaction: ChatInputCommandInteraction, AL: any) => {
	/**
	 * Getting ship
	 */
	const shipName: string = interaction.options.getString("ship-name");
	const shipInfo = await AL.ships.get(shipName);
	if (!shipInfo) {
		const shipNotFound: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | Ship not found!");
		return interaction.reply({ embeds: [shipNotFound], ephemeral: true });
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

	let skinPage: number = 0;
	let galleryPage: number = 0;

	collector.on("collect", async (i) => {
		const customId = i.customId.split("-")[0];

		if (!i.customId.endsWith(i.user.id)) {
			await i.reply({
				content: "This menu is not for you!",
				ephemeral: true,
			});
		} else {
			const menuOptions = categories.components[0].options;

			await i.deferUpdate();

			for (let j = 0; j < menuOptions.length; j++) {
				menuOptions[j].data.value === i.values[0]
					? menuOptions[j].setDefault(true)
					: menuOptions[j].setDefault(false);
			}

			switch (i.values[0]) {
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
					skinPage = await ShinanoPaginator({
						interaction,
						menu: categories,
						interactorOnly: true,
						pages: ship.skins,
						time: 120000,
					});

					break;
				}

				case "gallery": {
					galleryPage = await ShinanoPaginator({
						interaction,
						menu: categories,
						interactorOnly: true,
						pages: ship.gallery,
						time: 120000,
					});

					break;
				}
			}

			collector.resetTimer();
		}
	});

	collector.on("end", async (collected, reason) => {
		categories.components[0].setDisabled(true);
		await interaction.editReply({ components: [categories] });
	});
};

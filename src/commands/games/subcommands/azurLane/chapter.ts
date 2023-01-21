import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { chapterInfo } from "../../../../lib/AzurLane";
import { ShinanoPaginator } from "../../../../lib/Pages";

export = async (interaction: ChatInputCommandInteraction, AL: any) => 
{
	/**
	 * Getting chapter
	 */
	const chapterNumber: string = interaction.options.getString("chapter-number");
	const chapter = AL.chapters.filter((chapter) => 
	{
		return chapter.id === chapterNumber;
	});

	const info = chapter[0];

	/**
	 * Difficulties
	 */
	const normalLevels: EmbedBuilder[] = chapterInfo(info, "normal");
	if (!info[1].hard) 
	{
		return ShinanoPaginator({
			interaction,
			interactorOnly: true,
			pages: normalLevels,
			time: 120000,
		});
	}

	const hardLevels: EmbedBuilder[] = chapterInfo(info, "hard");

	/**
	 * Components
	 */
	const menu: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`${chapterNumber}-${interaction.user.id}`)
				.setMaxValues(1)
				.setMinValues(1)
				.setOptions(
					{
						label: "Normal",
						value: "normal",
						default: true,
					},
					{
						label: "Hard",
						value: "hard",
						default: false,
					}
				)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [normalLevels[0]],
		components: [menu],
	});

	ShinanoPaginator({
		interaction,
		interactorOnly: true,
		pages: normalLevels,
		menu,
		time: 120000,
	});

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
			const menuOptions = menu.components[0].options;

			for (let j = 0; j < menuOptions.length; j++) 
			{
				menuOptions[j].data.value === i.values[0]
					? menuOptions[j].setDefault(true)
					: menuOptions[j].setDefault(false);
			}

			switch (i.values[0]) 
			{
				case "normal": {
					ShinanoPaginator({
						interaction,
						interactorOnly: true,
						pages: normalLevels,
						menu,
						time: 120000,
					});

					break;
				}

				case "hard": {
					ShinanoPaginator({
						interaction,
						interactorOnly: true,
						pages: hardLevels,
						menu,
						time: 120000,
					});

					break;
				}
			}

			collector.resetTimer();
		}
	});
};

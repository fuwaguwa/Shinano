import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import { client } from "../../../../..";
import { ShinanoPaginator } from "../../../../../lib/Pages";
import { ChatInputCommandCategoryList } from "../../../../../typings/Command";
import { collectors } from "../../../../../events/cmdInteraction";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.deferred) await interaction.deferReply();

	const allCommands: ChatInputCommandCategoryList =
		await client.generateCommandList();

	/**
	 * Menu
	 */
	const navigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`NAVCAT-${interaction.user.id}`)
				.setMaxValues(1)
				.setMinValues(1)
				.setDisabled(false)
				.addOptions(
					{
						label: "Fun",
						value: "Fun",
						description: "Entertain yourself with these commands!",
						default: true,
						emoji: "🎉",
					},
					{
						label: "Image",
						description:
							"Generate (catgirls) images and manipulate them with these commands!",
						value: "Image",
						default: false,
						emoji: "📸",
					},
					{
						label: "Misc",
						description: "Miscellaneous Commands.",
						value: "Miscellaneous",
						default: false,
						emoji: "⭐",
					},
					{
						label: "Reactions",
						description: "React to a friend with these commands!",
						value: "Reactions",
						default: false,
						emoji: "😊",
					},
					{
						label: "Utilities",
						description: "Utilities Commands.",
						value: "Utilities",
						default: false,
						emoji: "🛠",
					},
					{
						label: "Azur Lane",
						description: "Azur Lane utilities commands!",
						value: "AzurLane",
						default: false,
						emoji: "⚓",
					},
					{
						label: "Genshin",
						description: "Genshin utilities commands!",
						value: "GenshinImpact",
						default: false,
						emoji: "⚔️",
					},
					{
						label: "Anime",
						description:
							"Search up information about an anime/anime character!",
						value: "Anime",
						default: false,
						emoji: "🎎",
					}
				)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [allCommands.Fun[0]],
		components: [navigation],
	});

	ShinanoPaginator({
		interaction,
		menu: navigation,
		pages: allCommands.Fun,
		interactorOnly: true,
		time: 30000,
	});

	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 30000,
		});

	collectors.set(interaction.user.id, collector);

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

			const menu = navigation.components[0];
			for (let j = 0; j < menu.options.length; j++) 
			{
				menu.options[j].setDefault(menu.options[j].data.value === i.values[0]);
			}

			ShinanoPaginator({
				interaction,
				menu: navigation,
				pages: allCommands[i.values[0]],
				interactorOnly: true,
				time: 30000,
			});

			collector.resetTimer();
		}
	});
};

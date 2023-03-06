import {
	ButtonStyle,
	Message,
	ButtonBuilder,
	ActionRowBuilder
} from "discord.js";
import { ShinanoPaginatorOptions } from "../typings/Pages";

export async function ShinanoPaginator({
	interaction,
	interactorOnly,
	pages,
	time,
	lastPage,
	menu,
}: ShinanoPaginatorOptions): Promise<number> 
{
	return new Promise(async (resolve) =>
	{
		let pageCount: number = lastPage || 0;
		let menuId: string;

		if (menu) menuId = menu.components[0].data.custom_id.split("-")[0];
		if (!interaction.deferred) await interaction.deferReply();

		/**
		 * Paginator Buttons
		 */
		let paginatorNavigation: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ id: "1002197527732437052", })
					.setDisabled(true)
					.setCustomId(`FIRST-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ id: "1002197531335327805", })
					.setDisabled(true)
					.setCustomId(`BACK-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(true)
					.setCustomId("pagecount")
					.setLabel(`Page: ${pageCount + 1}/${pages.length}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ id: "1002197525345865790", })
					.setCustomId(`NEXT-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setEmoji({ id: "1002197529095577612", })
					.setCustomId(`LAST-${interaction.user.id}`)
			);
		const pagingButtons: ButtonBuilder[] = paginatorNavigation.components;

		/**
		 * Modifying buttons based on page
		 */
		if (pages.length == 1) 
		{
			for (let i = 0; i < pagingButtons.length; i++) 
			{
				pagingButtons[i].setStyle(ButtonStyle.Secondary).setDisabled(true);
			}
		}
		else if (pages.length === pageCount) 
		{
			pagingButtons[3].setDisabled(true);
			pagingButtons[4].setDisabled(true);
		}
		else 
		{
			pagingButtons[0].setDisabled(true);
			pagingButtons[1].setDisabled(true);
		}

		/**
		 * Collector
		 */
		let message: Message;
		if (menu) 
		{
			message = await interaction.editReply({
				embeds: [pages[pageCount]],
				components: [menu, paginatorNavigation],
			});
		}
		else 
		{
			message = await interaction.editReply({
				embeds: [pages[pageCount]],
				components: [paginatorNavigation],
			});
		}

		const collector = await message.createMessageComponentCollector({ time, });

		collector.on("collect", async (i) => 
		{
			const customId = i.customId.split("-")[0];

			if (customId === menuId) 
			{
				resolve(pageCount);
				pageCount = 0;
				return collector.stop("interaction ended");
			}

			if (interactorOnly && i.customId.split("-")[1] !== i.user.id) 
			{
				await i.reply({
					content: "This button is not for you!",
					ephemeral: true,
				});
			}
			else 
			{
				/**
				 * Changing pages
				 */
				switch (customId) 
				{
					case "BACK": {
						pageCount = pageCount - 1;
						break;
					}

					case "NEXT": {
						pageCount = pageCount + 1;
						break;
					}

					case "FIRST": {
						pageCount = 0;
						break;
					}

					case "LAST": {
						pageCount = pages.length - 1;
						break;
					}
				}

				/**
				 * Editing Buttons
				 */
				if (!i.deferred) await i.deferUpdate();
				pagingButtons[2].setLabel(`Page: ${pageCount + 1}/${pages.length}`);

				// First Page
				if (pageCount == 0) 
				{
					pagingButtons[0].setDisabled(true);
					pagingButtons[1].setDisabled(true);

					pagingButtons[3].setDisabled(false);
					pagingButtons[4].setDisabled(false);
				}

				// Normal Pages
				if (pageCount != 0 && pageCount != pages.length - 1) 
				{
					pagingButtons.forEach((button, i) => 
					{
						if (i == 2) return;
						button.setDisabled(false);
					});
				}

				// Last Page
				if (pageCount == pages.length - 1) 
				{
					pagingButtons[0].setDisabled(false);
					pagingButtons[1].setDisabled(false);

					pagingButtons[3].setDisabled(true);
					pagingButtons[4].setDisabled(true);
				}

				/**
				 * Updating Message
				 */
				menu
					? await i.editReply({
						embeds: [pages[pageCount]],
						components: [menu, paginatorNavigation],
					  })
					: await i.editReply({
						embeds: [pages[pageCount]],
						components: [paginatorNavigation],
					  });

				collector.resetTimer();
			}
		});

		collector.on("end", async (collected, reason) => 
		{
			if (reason === "messageDelete" || reason === "interaction ended") return;

			for (let i = 0; i < paginatorNavigation.components.length; i++) 
			{
				pagingButtons[i].setStyle(ButtonStyle.Secondary).setDisabled(true);
			}

			if (menu) 
			{
				menu.components[0].setDisabled(true);
				await interaction.editReply({
					components: [menu, paginatorNavigation],
				});
			}
			else 
			{
				await interaction.editReply({ components: [paginatorNavigation], });
			}
		});
	});
}

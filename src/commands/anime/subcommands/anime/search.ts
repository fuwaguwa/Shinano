import fetch from "node-fetch";
import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
} from "discord.js";
import { animeInfo } from "../../../../lib/Anime";

export = async (interaction: ChatInputCommandInteraction) => {
	/**
	 * Processing data
	 */
	const animeName: string = interaction.options.getString("name").toLowerCase();
	const animeType: string = interaction.options.getString("type");

	const query = `q=${animeName}&limit=10&order_by=popularity&type=${animeType}&sfw=true`;
	const response = await fetch(`https://api.jikan.moe/v4/anime?${query}`, {
		method: "GET",
	});

	const animeResponse = (await response.json()).data;
	if (animeResponse.length == 0) {
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No result can be found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	/**
	 * Menu
	 */
	const results: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setMaxValues(1)
				.setMinValues(1)
				.setCustomId(`RES-${interaction.user.id}`)
				.setPlaceholder(`Anime Search Results (${animeResponse.length})`)
		);
	animeResponse.forEach((result) => {
		results.components[0].addOptions({
			label: `${result.title}`,
			value: `${result.mal_id}`,
		});
	});

	/**
	 * Collector
	 */
	const message = await interaction.editReply({ components: [results] });
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
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

			const response = await fetch(
				`https://api.jikan.moe/v4/anime/${i.values[0]}/full`,
				{ method: "GET" }
			);
			const anime = (await response.json()).data;

			const menu = results.components[0];
			for (let j = 0; j < menu.options.length; j++) {
				menu.options[j].data.value === i.values[0]
					? menu.options[j].setDefault(true)
					: menu.options[j].setDefault(false);
			}

			await animeInfo(anime, interaction, results);
		}
	});

	collector.on("end", async (collected, reason) => {
		results.components[0].setDisabled(true);
		await interaction.editReply({ components: [results] });
	});
};

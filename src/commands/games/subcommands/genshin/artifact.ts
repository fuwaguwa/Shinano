import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import genshin from "genshin-db";
import { rarityColor } from "../../../../lib/Genshin";
import { toTitleCase } from "../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Processing
	 */
	const name: string = interaction.options
		.getString("artifact-name")
		.toLowerCase();
	const artifact: genshin.Artifact = genshin.artifacts(name);

	if (!artifact) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No artifact set found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	const embedColor = rarityColor(artifact.rarity[artifact.rarity.length - 1]);

	/**
	 * General info
	 */
	let artifactPartsInfo;
	const artifactParts: string[] = [
		"flower",
		"plume",
		"sands",
		"goblet",
		"circlet"
	];

	const infoEmbed: EmbedBuilder = new EmbedBuilder()
		.setTitle(artifact.name)
		.setColor(embedColor);
	if (artifact.url.fandom)
		infoEmbed.setDescription(`[Wiki Link](${artifact.url.fandom})`);

	if (artifact["1pc"]) 
	{
		infoEmbed
			.setThumbnail(artifact.images.circlet)
			.setDescription(`*${artifact.circlet.description}*`)
			.addFields({ name: "1-piece Effect:", value: artifact["1pc"], });
		return interaction.editReply({ embeds: [infoEmbed], });
	}

	infoEmbed.setThumbnail(artifact.images.flower);
	if (artifact["2pc"])
		infoEmbed.addFields({ name: "2-pieces Effect:", value: artifact["2pc"], });
	if (artifact["4pc"])
		infoEmbed.addFields({ name: "4-pieces Effect:", value: artifact["4pc"], });

	for (let i = 0; i < artifactParts.length; i++) 
	{
		const part = artifactParts[i];
		artifactPartsInfo = Object.assign(
			{
				[`${part}`]: new EmbedBuilder()
					.setTitle(`${toTitleCase(part)}: ${artifact[part].name}`)
					.setColor(embedColor)
					.setDescription(`*${artifact[part].description}*`)
					.setThumbnail(artifact.images[part]),
			},
			artifactPartsInfo
		);
	}

	/**
	 * Menu
	 */
	const navigation: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`ARTI-${interaction.user.id}`)
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(
					{
						label: "Set Info",
						value: "info",
						emoji: "📝",
						default: true,
					},
					{
						label: `Flower: ${artifact.flower.name}`,
						value: "flower",
						emoji: "🌸",
						default: false,
					},
					{
						label: `Plume: ${artifact.plume.name}`,
						value: "plume",
						emoji: "🪶",
						default: false,
					},
					{
						label: `Sands: ${artifact.sands.name}`,
						value: "sands",
						emoji: "⌛",
						default: false,
					},
					{
						label: `Goblet: ${artifact.goblet.name}`,
						value: "goblet",
						emoji: "🏆",
						default: false,
					},
					{
						label: `Circlet: ${artifact.circlet.name}`,
						value: "circlet",
						emoji: "👑",
						default: false,
					}
				)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [infoEmbed],
		components: [navigation],
	});
	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	collector.on("collect", async i => 
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
			const menuOptions = navigation.components[0].options;

			await i.deferUpdate();
			switch (i.values[0]) 
			{
				case "info": {
					for (let i = 0; i < menuOptions.length; i++) 
					{
						i == 0
							? menuOptions[i].setDefault(true)
							: menuOptions[i].setDefault(false);
					}

					await interaction.editReply({
						embeds: [infoEmbed],
						components: [navigation],
					});

					break;
				}

				default: {
					const defaultOption = menuOptions.filter(
						option => option.data.value === i.values[0]
					);
					const defaultVal = menuOptions.indexOf(defaultOption[0]);

					for (let i = 0; i < menuOptions.length; i++) 
					{
						i === defaultVal
							? menuOptions[i].setDefault(true)
							: menuOptions[i].setDefault(false);
					}

					await interaction.editReply({
						embeds: [artifactPartsInfo[i.values[0]]],
						components: [navigation],
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

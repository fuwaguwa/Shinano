import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	Message,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction
} from "discord.js";
import {
	gearColor,
	gearFits,
	gearSearch,
	gearStats
} from "../../../../lib/AzurLane";
import { collectors } from "../../../../events/cmdInteraction";

export = async (interaction: ChatInputCommandInteraction, AL: any) => 
{
	/**
	 * Filtering gear
	 */
	const gearName: string = interaction.options
		.getString("gear-name")
		.toLowerCase();
	const gearFiltered = await gearSearch(gearName, AL);

	if (gearFiltered.length === 0) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | I apologize, but I could not find the mentioned gear. Please ensure that you have spelled the gear's name correctly."
			);
		return interaction.editReply({ embeds: [noResult], });
	}
	const gear: any = gearFiltered[0].item;

	/**
	 * Generating Embeds
	 */
	const infoEmbeds: EmbedBuilder[] = [];
	const statsEmbeds: EmbedBuilder[] = [];
	const equippableEmbeds: EmbedBuilder[] = [];

	for (let i = 0; i < gear.tiers.length; i++) 
	{
		const color = gearColor(gear, i);

		/**
		 * General Info
		 */
		infoEmbeds.push(
			new EmbedBuilder()
				.setColor(color)
				.setThumbnail(gear.image)
				.setTitle(
					`${gear.names["wiki"] || gear.names.en} | ${gear.tiers[i].rarity}`
				)
				.setDescription(`Stars: ${gear.tiers[i].stars.stars}`)
				.setFields(
					{ name: "Nationality:", value: gear.nationality, },
					{ name: "Gear Type:", value: `${gear.category} | ${gear.type.name}`, },
					{ name: "Obtain From:", value: gear.misc.obtainedFrom, }
				)
		);

		if (gear.misc.notes.length > 0) 
		{
			infoEmbeds[i].addFields({ name: "Notes:", value: gear.misc.notes, });
		}

		/**
		 * Stats
		 */
		statsEmbeds.push(
			new EmbedBuilder()
				.setColor(color)
				.setThumbnail(gear.image)
				.setTitle(
					`${gear.names["wiki"] || gear.names.en} | ${gear.tiers[i].rarity}`
				)
		);

		gearStats(gear.tiers[i].stats, statsEmbeds[i]);

		/**
		 * Equippables
		 */
		equippableEmbeds.push(
			new EmbedBuilder()
				.setColor(color)
				.setThumbnail(gear.image)
				.setTitle(`${gear.names["wiki"] || gear.names.en}`)
				.setFields({
					name: "Equippable By:",
					value: gearFits(gear.fits).join("\n"),
				})
		);
	}

	/**
	 * Menus
	 */
	const tiers: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`TIERS-${interaction.user.id}`)
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(
					{
						label: "Tier 1",
						emoji: "1️⃣",
						value: "T1",
						default: true,
					},
					{
						label: "Tier 2",
						value: "T2",
						emoji: "2️⃣",
						default: false,
					},
					{
						label: "Tier 3",
						value: "T3",
						emoji: "3️⃣",
						default: false,
					}
				)
		);

	const options: ActionRowBuilder<StringSelectMenuBuilder> =
		new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(
			new StringSelectMenuBuilder()
				.setCustomId(`OPT-${interaction.user.id}`)
				.setMinValues(1)
				.setMaxValues(1)
				.setOptions(
					{
						label: "Info",
						value: "info",
						emoji: "🔎",
						default: true,
					},
					{
						label: "Stats",
						value: "stats",
						emoji: "📝",
						default: false,
					},
					{
						label: "Fits",
						value: "fits",
						emoji: "🚢",
						default: false,
					}
				)
		);

	const components: ActionRowBuilder<StringSelectMenuBuilder>[] =
		gear.tiers.length > 1 ? [tiers, options] : [options];

	/**
	 * Collector
	 */
	let message: Message;
	if (gear.tiers.length > 1) 
	{
		message = await interaction.editReply({
			embeds: [infoEmbeds[0]],
			components: [tiers, options],
		});
	}
	else 
	{
		message = await interaction.editReply({
			embeds: [infoEmbeds[0]],
			components: [options],
		});
	}

	const collector: InteractionCollector<StringSelectMenuInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			time: 120000,
		});

	collectors.set(interaction.user.id, collector);

	let tierCount: number = 0;

	collector.on("collect", async (i) => 
	{
		const customId = i.customId.split("-")[0];

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

			if (customId === "TIERS") 
			{
				const menuOptions = tiers.components[0].options;

				for (let j = 0; j < menuOptions.length; j++) 
				{
					menuOptions[j].setDefault(menuOptions[j].data.value === i.values[0]);
				}

				switch (i.values[0]) 
				{
					case "T1": {
						await i.editReply({
							embeds: [infoEmbeds[0]],
							components: [tiers, options],
						});
						tierCount = 0;

						break;
					}

					case "T2": {
						await i.editReply({
							embeds: [infoEmbeds[1]],
							components: [tiers, options],
						});
						tierCount = 1;

						break;
					}

					case "T3": {
						await i.editReply({
							embeds: [infoEmbeds[2]],
							components: [tiers, options],
						});
						tierCount = 2;

						break;
					}
				}
			}
			else 
			{
				const menuOptions = options.components[0].options;

				for (let j = 0; j < menuOptions.length; j++) 
				{
					menuOptions[j].setDefault(menuOptions[j].data.value === i.values[0]);
				}

				switch (i.values[0]) 
				{
					case "info": {
						await i.editReply({
							embeds: [infoEmbeds[tierCount]],
							components,
						});

						break;
					}

					case "stats": {
						await i.editReply({
							embeds: [statsEmbeds[tierCount]],
							components,
						});

						break;
					}

					case "fits": {
						await i.editReply({
							embeds: [equippableEmbeds[tierCount]],
							components,
						});

						break;
					}
				}
			}

			collector.resetTimer();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		tiers.components[0].setDisabled(true);
		options.components[0].setDisabled(true);

		await interaction.editReply({
			components,
		});
	});
};

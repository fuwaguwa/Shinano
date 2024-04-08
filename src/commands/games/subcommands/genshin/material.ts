import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import genshin from "genshin-db";
import { rarityColor } from "../../../../lib/Genshin";
import { toTitleCase } from "../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Processing
	 */
	const name: string = interaction.options
		.getString("material-name")
		.toLowerCase();
	const material: genshin.Material = genshin.materials(name);

	if (!material) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No material found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	/**
	 * Displaying
	 */
	const materialEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor(material.rarity ? rarityColor(material) : "#2b2d31")
		.setTitle(material.name)
		.setDescription(
			`*${material.description}*`
		)
		.setFields(
			{
				name: "Material Category:",
				value: toTitleCase(
					material.category.split("_").join(" ").toLowerCase()
				),
			},
			{
				name: "Material Type:",
				value: material.typeText,
			}
		);
	if (!material.daysOfWeek) 
	{
		materialEmbed.addFields({
			name: "Material Source:",
			value: material.source.join("\n"),
		});
	}
	else 
	{
		materialEmbed.addFields({
			name: "Material Source",
			value:
				`${(material as any).sources.join("\n")}\n` +
				`${material.dropDomainName} (${material.daysOfWeek.join("/")})`,
		});
	}

	await interaction.editReply({ embeds: [materialEmbed], });
};

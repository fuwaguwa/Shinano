import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import genshin from "genshin-db";
import { rarityColor } from "../../../../lib/Genshin";
import { toTitleCase } from "../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction) => {
	/**
	 * Processing
	 */
	const name: string = interaction.options
		.getString("material-name")
		.toLowerCase();
	const material: genshin.Material = genshin.materials(name);

	if (!material) {
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No material found!");
		return interaction.editReply({ embeds: [noResult] });
	}

	/**
	 * Displaying
	 */
	const materialEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor(material.rarity ? rarityColor(material) : "#2f3136")
		.setTitle(material.name)
		.setThumbnail(material.images.redirect)
		.setDescription(
			`*${material.description}*\n\n${
				material.url ? `[Wiki Link](${material.url.fandom})` : ""
			}`
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
				value: material.materialtype,
			}
		);
	if (!material.daysofweek) {
		materialEmbed.addFields({
			name: "Material Source:",
			value: material.source.join("\n"),
		});
	} else {
		materialEmbed.addFields({
			name: "Material Source",
			value:
				`${material.source.join("\n")}\n` +
				`${material.dropdomain} (${material.daysofweek.join("/")})`,
		});
	}

	await interaction.editReply({ embeds: [materialEmbed] });
};

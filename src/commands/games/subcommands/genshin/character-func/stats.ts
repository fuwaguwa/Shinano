import { ChatInputCommandInteraction } from "discord.js";
import { Character } from "genshin-db";
import { ShinanoCharacter } from "../../../../../structures/Character";

export = async (
	interaction: ChatInputCommandInteraction,
	character: Character
) => {
	let level: number = interaction.options.getInteger("character-level");
	let ascension: string = interaction.options.getString("ascension-phase");

	if (level < 1) level = 1;
	if (level > 90) level = 90;

	const characterClass = new ShinanoCharacter(character);
	const characterStats = characterClass.getCharaterStatsEmbed(level, ascension);

	await interaction.editReply({ embeds: [characterStats] });
};

import { ChatInputCommandInteraction } from "discord.js";
import { Weapon } from "genshin-db";
import { ShinanoWeapon } from "../../../../../structures/Weapon";

export = async (interaction: ChatInputCommandInteraction, weapon: Weapon) => 
{
	let level: number = interaction.options.getInteger("weapon-level");
	let ascension = interaction.options.getString("ascension-phase");
	let refinementLevel: string | number =
		interaction.options.getString("refinement-level");

	if (!refinementLevel) refinementLevel = 1;
	if (level < 1) level = 1;
	if (level > 90) level = 90;

	const weaponClass = new ShinanoWeapon(weapon);
	const weaponStats = weaponClass.getWeaponStatsEmbed(
		level,
		refinementLevel as number,
		ascension
	);

	await interaction.editReply({ embeds: [weaponStats], });
};

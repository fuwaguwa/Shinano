import { EmbedBuilder } from "discord.js";
import { Weapon } from "genshin-db";
import { rarityColor, stars } from "../lib/Genshin";
import { strFormat, stripColorTags } from "../lib/Utils";

const kaeya = "https://static.wikia.nocookie.net/115776a8-9014-45e6-9bb7-0bdb6184a80b/"

export class ShinanoWeapon 
{
	weapon: Weapon;
	color: any;
	stars: string;

	subValue: string;
	refinementStats: string[] = [];

	weaponStats: EmbedBuilder;
	generalInfo: EmbedBuilder;
	ascensionCosts: EmbedBuilder[] = [];

	constructor(weapon: Weapon) 
	{
		this.weapon = weapon;

		this.color = rarityColor(weapon);
		this.stars = stars(weapon);
		this.subValue = `${weapon.baseStatText} ${weapon.mainStatText}`
	}


	/**
	 * Formatting weapon refinement stats
	 */
	private getRefinementStats() 
	{
		const weapon = this.weapon;

		if (weapon.effectName) 
		{
			for (let i = 0; i < 5; i++) 
			{
				if (i == 0) 
				{
					weapon.r1.values.forEach((stat) => {this.refinementStats.push(stat)})
				}
				else 
				{
					for (let k = 0; k < weapon.r1.values.length; k++) 
					{
						this.refinementStats[k] += `/${weapon[`r${i + 1}`].values[k]}`;
					}
				}
			}

			for (let i = 0; i < this.refinementStats.length; i++) 
			{
				this.refinementStats[i] = `**${this.refinementStats[i]}**`;
			}
		}
	}

	/**
	 * Add weapon effect to embed
	 * @param embed weapon embed
	 * @param refStats weapon refinement stats
	 */
	private includeEffect(embed: EmbedBuilder, refStats?: string[]) 
	{
		const weapon = this.weapon;

		if (weapon.effectName) 
		{
			embed.addFields({
				name: `Effect: ${this.weapon.effectName}`,
				value: strFormat(stripColorTags(this.weapon.effectTemplateRaw), refStats || this.refinementStats),
			});
		}
	}

	/**
	 * Generate weapon general info embed
	 */
	private genGeneralInfoEmbed() 
	{
		const weapon = this.weapon;

		this.getRefinementStats();

		this.generalInfo = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(weapon.name)
			.setDescription(`*${weapon.description}*`)
			.setThumbnail(weapon.images.mihoyo_icon || kaeya)
			.setFields(
				{
					name: "Rarity",
					value: this.stars,
				},
				{
					name: "Weapon Type:",
					value: weapon.weaponText,
				},
				{
					name: "Base Stats",
					value:
						`Base ATK: **${Math.round(weapon.baseAtkValue)} ATK**\n` +
						`${this.subValue ? `Base Substat: **${this.subValue}**\n` : ""}`,
				}
			);
		if (weapon.effectName) this.includeEffect(this.generalInfo);
	}

	/**
	 * Generate weapon ascension costs embed
	 */
	private genAscensionCostsEmbed() 
	{
		const weapon = this.weapon;
		const ascensionCosts = [];

		for (let ascensionLevel in this.weapon.costs) 
		{
			let materials = [];

			weapon.costs[ascensionLevel].forEach((material) => 
			{
				materials.push(`${material.count}x **${material.name}**`);
			});

			ascensionCosts.push(materials.join("\n"));
		}

		for (let i = 0; i < ascensionCosts.length; i++) 
		{
			this.ascensionCosts.push(
				new EmbedBuilder()
					.setColor(this.color)
					.setTitle(`${weapon.name}'s Ascension Costs`)
					.setThumbnail(weapon.images.mihoyo_icon || kaeya)
					.setFields({ name: `Ascension ${i + 1}:`, value: ascensionCosts[i], })
			);
		}
	}

	/**
	 * Returing the embeds
	 */
	public getWeaponEmbeds() 
	{
		this.genGeneralInfoEmbed();
		this.genAscensionCostsEmbed();

		return {
			generalInfo: this.generalInfo,
			ascensionCost: this.ascensionCosts,
		};
	}

	/**
	 * Get weapon stats embed
	 * @param level weapon level
	 * @param refinementLevel refine level
	 * @param ascension ascension phase
	 */
	public getWeaponStatsEmbed(
		level: number,
		refinementLevel: number,
		ascension?: string
	) 
	{
		const weapon = this.weapon;
		let weaponStats = weapon.stats(level);
		if (ascension) weaponStats = weapon.stats(level, parseInt(ascension, 10));

		const weaponSPStats: string = this.subValue

		this.weaponStats = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(`${weapon.name}\'s Stats | Level ${level}`)
			.setThumbnail(weapon.images.mihoyo_icon || kaeya)
			.setFields(
				{
					name: "Level & Ascensions:",
					value:
						`Level: **${weaponStats.level}**\n` +
						`Ascensions: **${weaponStats.ascension}**\n` +
						`${
							weapon.effectName ? `Refinement Level: **${refinementLevel}**` : ""
						}`,
				},
				{
					name: "Weapon's Stats:",
					value:
						`ATK: **${
							weaponStats.attack
								? `${weaponStats.attack.toFixed(2)} ATK`
								: "N/A"
						}**\n` +
						`Main Stat: **${
							weaponStats.specialized ? weaponSPStats : "N/A"
						}**\n`,
				}
			);

		if (weapon.effectName) 
		{
			const refStats: string[] = [];
			weapon[`r${refinementLevel}`].values.forEach((stat) => 
			{
				refStats.push(`**${stat}**`);
			});

			this.includeEffect(this.weaponStats, refStats);
		}

		return this.weaponStats;
	}
}

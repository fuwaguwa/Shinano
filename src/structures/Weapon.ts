import { EmbedBuilder } from "discord.js";
import { Weapon } from "genshin-db";
import { rarityColor, stars } from "../lib/Genshin";
import { strFormat } from "../lib/Utils";

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
	}

	/**
	 * Converting weapon subvalues
	 */
	private getSubValue() 
	{
		const weapon = this.weapon;

		weapon.substat.toLowerCase() !== "elemental mastery"
			? (this.subValue = `${weapon.subvalue}% ${weapon.substat}`)
			: (this.subValue = `${weapon.subvalue} ${weapon.substat}`);
	}

	/**
	 * Formatting weapon refinement stats
	 */
	private getRefinementStats() 
	{
		const weapon = this.weapon;

		if (weapon.effect) 
		{
			for (let i = 0; i < 5; i++) 
			{
				if (i == 0) 
				{
					weapon[`r${i + 1}`].forEach((stat) => 
					{
						this.refinementStats.push(stat);
					});
				}
				else 
				{
					for (let k = 0; k < weapon.r1.length; k++) 
					{
						this.refinementStats[k] += `/${weapon[`r${i + 1}`][k]}`;
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
	 */
	private includeEffect(embed: EmbedBuilder, refStats?: string[]) 
	{
		const weapon = this.weapon;

		if (weapon.effect) 
		{
			embed.addFields({
				name: `Effect: ${this.weapon.effectname}`,
				value: strFormat(
					this.weapon.effect,
					refStats ? refStats : this.refinementStats
				),
			});
		}
	}

	/**
	 * Generate weapon general info embed
	 */
	private genGeneralInfoEmbed() 
	{
		const weapon = this.weapon;

		this.getSubValue();
		this.getRefinementStats();

		this.generalInfo = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(weapon.name)
			.setDescription(
				`*${weapon.description}*\n\n${
					weapon.url ? `[Wiki Link](${weapon.url.fandom})` : ""
				}`
			)
			.setThumbnail(weapon.images.icon)
			.setFields(
				{
					name: "Rarity",
					value: this.stars,
				},
				{
					name: "Weapon Type:",
					value: weapon.weapontype,
				},
				{
					name: "Base Stats",
					value:
						`Base ATK: **${weapon.baseatk} ATK**\n` +
						`${this.subValue ? `Base Substat: **${this.subValue}**\n` : ""}`,
				}
			);
		if (weapon.effect) this.includeEffect(this.generalInfo);
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
					.setThumbnail(weapon.images.icon)
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

		let weaponSPStats: string;
		if (weapon.substat) 
		{
			if (weapon.substat.toLowerCase() !== "elemental mastery") 
			{
				weaponSPStats = `${(weaponStats.specialized * 100).toFixed(2)}% ${
					weapon.substat
				}`;
			}
			else 
			{
				weaponSPStats = `${weaponStats.specialized.toFixed(2)} ${
					weapon.substat
				}`;
			}
		}

		this.weaponStats = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(`${weapon.name}\'s Stats | Level ${level}`)
			.setThumbnail(weapon.images.icon)
			.setFields(
				{
					name: "Level & Ascensions:",
					value:
						`Level: **${weaponStats.level}**\n` +
						`Ascensions: **${weaponStats.ascension}**\n` +
						`${
							weapon.effect ? `Refinement Level: **${refinementLevel}**` : ""
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

		if (weapon.effect) 
		{
			const refStats: string[] = [];
			weapon[`r${refinementLevel}`].forEach((stat) => 
			{
				refStats.push(`**${stat}**`);
			});

			this.includeEffect(this.weaponStats, refStats);
		}

		return this.weaponStats;
	}
}

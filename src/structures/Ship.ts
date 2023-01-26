import { EmbedBuilder } from "discord.js";
import { createTable, toTitleCase } from "../lib/Utils";

export class ShinanoShip 
{
	public ship: any;
	public color: any;

	private generalInfo: EmbedBuilder;
	private stats: EmbedBuilder;
	private skills: EmbedBuilder;
	private tech: EmbedBuilder;
	private skins: EmbedBuilder[] = [];
	private gallery: EmbedBuilder[] = [];

	constructor(ship) 
	{
		this.ship = ship;

		this.color = this.shipColor();
	}

	/**
	 * Get ship color based on ship rarity
	 * @param ship ship
	 */
	public shipColor() 
	{
		const ship = this.ship;

		let color: any;
		if (ship.rarity === "Normal") color = "#b0b7b8";
		if (ship.rarity === "Rare") color = "#03dbfc";
		if (ship.rarity === "Elite") color = "#ec18f0";
		if (ship.rarity === "Super Rare" || ship.rarity === "Priority")
			color = "#eff233";
		if (ship.rarity === "Ultra Rare" || ship.rarity === "Decisive")
			color = "#2f3136";

		return color;
	}

	/**
	 * Get ship pools
	 * @param ship ship
	 * @param embed general info embed
	 */
	private pools(embed: EmbedBuilder) 
	{
		const ship = this.ship;

		if (ship.rarity !== "Decisive" && ship.rarity !== "Priority") 
		{
			const pools: string[] = [];
			if (ship.construction.availableIn.exchange) pools.push("Exchange");
			if (ship.construction.availableIn.light) pools.push("Light Ship Pool");
			if (ship.construction.availableIn.heavy) pools.push("Heavy Ship Pool");
			if (ship.construction.availableIn.aviation)
				pools.push("Special Ship Pool");
			if (ship.construction.availableIn.limited)
				pools.push(
					`Limited Ship Pool: ${ship.construction.availableIn.limited}`
				);

			// Banner
			let aprIn: string;
			pools.length > 0 ? (aprIn = pools.join("\n")) : (aprIn = "Maps");

			// Maps
			const maps: string[] = [];
			if (ship.obtainedFrom.fromMaps.length > 0) 
			{
				for (let i = 0; i < ship.obtainedFrom.fromMaps.length; i++) 
				{
					if (ship.obtainedFrom.fromMaps[i].name) 
					{
						maps.push(ship.obtainedFrom.fromMaps[i].name);
					}
					else 
					{
						maps.push(ship.obtainedFrom.fromMaps[i]);
					}
				}
			}

			maps.length > 0 && pools.length > 0
				? (aprIn = aprIn + `\nMaps: ${maps.join(", ")}`)
				: (aprIn = aprIn + `: ${maps.join(", ")}`);

			/**
			 * Adding data
			 */
			return embed.addFields(
				{
					name: "Construction:",
					value:
						ship.construction.constructionTime === "Drop Only"
							? "Cannot Be Constructed"
							: ship.construction.constructionTime,
				},
				{ name: "Appears In:", value: aprIn, },
				{
					name: "Obtainable From:",
					value: `${
						ship.obtainedFrom.obtainedFrom
							? ship.obtainedFrom.obtainedFrom
							: "Other Sources (Maps/Banner)"
					}`,
				}
			);
		}

		return embed.addFields({ name: "Obtain From:", value: "Shipyard", });
	}

	/**
	 * Generate a stats table for a ship
	 * @param shipStats ship stats
	 * @returns link to stats table
	 */
	private createStatsTable(shipStats) 
	{
		// Structure
		const columns: string[] = [
			"LVL",
			"HP",
			"FP",
			"TRP",
			"AVI",
			"AA",
			"RLD",
			"EVA",
			"SPD",
			"ACC",
			"LCK",
			"ASW",
			"OIL"
		];

		// Stats
		const dataSrc = [
			{
				LVL: "1",
				HP: shipStats.baseStats.health,
				RLD: shipStats.baseStats.reload,
				LCK: shipStats.baseStats.luck,
				FP: shipStats.baseStats.firepower,
				TRP: shipStats.baseStats.torpedo,
				EVA: shipStats.baseStats.evasion,
				SPD: shipStats.baseStats.speed,
				AA: shipStats.baseStats.antiair,
				AVI: shipStats.baseStats.aviation,
				OIL: shipStats.baseStats.oilConsumption,
				ACC: shipStats.baseStats.accuracy,
				ASW: shipStats.baseStats.antisubmarineWarfare,
			},
			{
				LVL: "100",
				HP: shipStats.level100.health,
				RLD: shipStats.level100.reload,
				LCK: shipStats.level100.luck,
				FP: shipStats.level100.firepower,
				TRP: shipStats.level100.torpedo,
				EVA: shipStats.level100.evasion,
				SPD: shipStats.level100.speed,
				AA: shipStats.level100.antiair,
				AVI: shipStats.level100.aviation,
				OIL: shipStats.level100.oilConsumption,
				ACC: shipStats.level100.accuracy,
				ASW: shipStats.level100.antisubmarineWarfare,
			},
			{
				LVL: "120",
				HP: shipStats.level120.health,
				RLD: shipStats.level120.reload,
				LCK: shipStats.level120.luck,
				FP: shipStats.level120.firepower,
				TRP: shipStats.level120.torpedo,
				EVA: shipStats.level120.evasion,
				SPD: shipStats.level120.speed,
				AA: shipStats.level120.antiair,
				AVI: shipStats.level120.aviation,
				OIL: shipStats.level120.oilConsumption,
				ACC: shipStats.level120.accuracy,
				ASW: shipStats.level120.antisubmarineWarfare,
			},
			{
				LVL: "125",
				HP: shipStats.level125.health,
				RLD: shipStats.level125.reload,
				LCK: shipStats.level125.luck,
				FP: shipStats.level125.firepower,
				TRP: shipStats.level125.torpedo,
				EVA: shipStats.level125.evasion,
				SPD: shipStats.level125.speed,
				AA: shipStats.level125.antiair,
				AVI: shipStats.level125.aviation,
				OIL: shipStats.level125.oilConsumption,
				ACC: shipStats.level125.accuracy,
				ASW: shipStats.level125.antisubmarineWarfare,
			}
		];

		// Retrofit Stats
		if (shipStats.level100Retrofit) 
		{
			dataSrc.push(
				{
					LVL: "100 (Retro)",
					HP: shipStats.level100Retrofit.health,
					RLD: shipStats.level100Retrofit.reload,
					LCK: shipStats.level100Retrofit.luck,
					FP: shipStats.level100Retrofit.firepower,
					TRP: shipStats.level100Retrofit.torpedo,
					EVA: shipStats.level100Retrofit.evasion,
					SPD: shipStats.level100Retrofit.speed,
					AA: shipStats.level100Retrofit.antiair,
					AVI: shipStats.level100Retrofit.aviation,
					OIL: shipStats.level100Retrofit.oilConsumption,
					ACC: shipStats.level100Retrofit.accuracy,
					ASW: shipStats.level100Retrofit.antisubmarineWarfare,
				},
				{
					LVL: "120 (Retro)",
					HP: shipStats.level120Retrofit.health,
					RLD: shipStats.level120Retrofit.reload,
					LCK: shipStats.level120Retrofit.luck,
					FP: shipStats.level120Retrofit.firepower,
					TRP: shipStats.level120Retrofit.torpedo,
					EVA: shipStats.level120Retrofit.evasion,
					SPD: shipStats.level120Retrofit.speed,
					AA: shipStats.level120Retrofit.antiair,
					AVI: shipStats.level120Retrofit.aviation,
					OIL: shipStats.level120Retrofit.oilConsumption,
					ACC: shipStats.level120Retrofit.accuracy,
					ASW: shipStats.level120Retrofit.antisubmarineWarfare,
				},
				{
					LVL: "125 (Retro)",
					HP: shipStats.level125Retrofit.health,
					RLD: shipStats.level125Retrofit.reload,
					LCK: shipStats.level125Retrofit.luck,
					FP: shipStats.level125Retrofit.firepower,
					TRP: shipStats.level125Retrofit.torpedo,
					EVA: shipStats.level125Retrofit.evasion,
					SPD: shipStats.level125Retrofit.speed,
					AA: shipStats.level125Retrofit.antiair,
					AVI: shipStats.level125Retrofit.aviation,
					OIL: shipStats.level125Retrofit.oilConsumption,
					ACC: shipStats.level125Retrofit.accuracy,
					ASW: shipStats.level125Retrofit.antisubmarineWarfare,
				}
			);
		}
		return createTable({ columns, dataSrc, });
	}

	/**
	 * Generate ship general info embed
	 */
	private generateGeneralInfoEmbed() 
	{
		const ship = this.ship;

		const generalInfo: EmbedBuilder = new EmbedBuilder()
			.setColor(this.shipColor())
			.setThumbnail(ship.thumbnail)
			.setTitle(`${ship.names.en} | ${ship.names.code}`)
			.setDescription(
				`[Wiki Link](${ship.wikiUrl})\nDrawn by ${
					ship.misc.artist.name
				}\nVoiced by ${ship.misc.voice.name || "Unknown"}`
			)
			.setFields(
				{ name: "Rarity:", value: ship.rarity, },
				{
					name: "Nationality:",
					value: `${ship.nationality || "None"}`,
				},
				{ name: "Class:", value: ship.class, },
				{ name: "Hull Type:", value: ship.hullType, }
			);

		this.pools(generalInfo);
		this.generalInfo = generalInfo;
	}

	/**
	 * Generate ship stats embed
	 */
	private async generateStatsEmbed() 
	{
		const ship = this.ship;

		/**
		 * Limit breaks and dev levels
		 */
		let name: string;
		let limitBreak: string;

		if (!ship.limitBreaks && !ship.devLevels) 
		{
			name = "Limit Breaks:";
			limitBreak = "Ship cannot be limit broken.";
		}
		else if (ship.limitBreaks && !ship.devLevels) 
		{
			name = "Limit Breaks:";
			limitBreak =
				`**First**: ${ship.limitBreaks[0].join("/")}\n` +
				`**Second**: ${ship.limitBreaks[1].join("/")}\n` +
				`**Third**: ${ship.limitBreaks[2].join("/")}\n`;
		}
		else 
		{
			name = "Dev Levels:";
			limitBreak =
				`**Dev 5**: ${ship.devLevels[0].buffs.join("/")}\n` +
				`**Dev 10**: ${ship.devLevels[1].buffs.join("/")}\n` +
				`**Dev 15**: ${ship.devLevels[2].buffs.join("/")}\n` +
				`**Dev 20**: ${ship.devLevels[3].buffs.join("/")}\n` +
				`**Dev 25**: ${ship.devLevels[4].buffs.join("/")}\n` +
				`**Dev 30**: ${ship.devLevels[5].buffs.join("/")}\n`;
		}

		/**
		 * Scrap/Enhance Values
		 */
		let scrapValue: string[] = [];
		let enhanceValue: string[] = [];

		if (ship.rarity !== "Priority" && ship.rarity !== "Decisive") 
		{
			for (let value in ship.scrapValue) 
			{
				scrapValue.push(`**${toTitleCase(value)}**: ${ship.scrapValue[value]}`);
			}

			for (let value in ship.enhanceValue) 
			{
				enhanceValue.push(
					`**${toTitleCase(value)}**: ${ship.enhanceValue[value]}`
				);
			}
		}

		const statsTable = await this.createStatsTable(ship.stats);
		const statsEmbed: EmbedBuilder = new EmbedBuilder()
			.setTitle(`${ship.names.en}'s Stats`)
			.setColor(this.color)
			.setImage(statsTable)
			.setThumbnail(ship.thumbnail)
			.setFields(
				{ name: name, value: limitBreak, },
				{
					name: "Weapon Slots: MinEff%/MaxEff%: ",
					value:
						`**${ship.slots[0].type}**: ${ship.slots[0].minEfficiency}%/${ship.slots[0].maxEfficiency}%\n` +
						`**${ship.slots[1].type}**: ${ship.slots[1].minEfficiency}%/${ship.slots[1].maxEfficiency}%\n` +
						`**${ship.slots[2].type}**: ${ship.slots[2].minEfficiency}%/${ship.slots[2].maxEfficiency}%`,
					inline: false,
				}
			);

		if (scrapValue.length != 0) 
		{
			statsEmbed.addFields(
				{
					name: "Enhance Value:",
					value: enhanceValue.join("\n"),
					inline: true,
				},
				{ name: "Scrap Value: ", value: scrapValue.join("\n"), inline: true, }
			);
		}

		this.stats = statsEmbed;
	}

	/**
	 * Generate ship skills embed
	 */
	private generateSkillsEmbed() 
	{
		const ship = this.ship;

		const skillsEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor(this.color)
			.setThumbnail(ship.thumbnail)
			.setTitle(`${ship.names.en}'s Skills`);

		ship.skills.forEach((skill) => 
		{
			let skillType: string;

			if (skill.color === "pink") skillType = "Offensive Skill";
			if (skill.color === "gold") skillType = "Support Skill";
			if (skill.color === "deepskyblue") skillType = "Defensive Skill";

			skillsEmbed.addFields({
				name: `${skill.names.en} (${skillType})`,
				value: skill.description,
			});
		});

		this.skills = skillsEmbed;
	}

	/**
	 * Generate ship tech embed
	 */
	private generateTechEmbed() 
	{
		const ship = this.ship;

		let techPts: string;
		let statsBonus: string;

		if (!ship.fleetTech.statsBonus.collection || !ship.fleetTech.techPoints) 
		{
			techPts = "N/A";
			statsBonus = "N/A";
		}
		else 
		{
			let collection = ship.fleetTech.statsBonus.collection.stat;
			let maxLevel = ship.fleetTech.statsBonus.maxLevel.stat;

			switch (collection.toLowerCase()) 
			{
				case "antisubmarinewarfare": {
					collection = "ASW";
					break;
				}

				case "antiair": {
					collection = "anti air";
					break;
				}
			}

			switch (maxLevel.toLowerCase()) 
			{
				case "antisubmarinewarfare": {
					maxLevel = "ASW";
					break;
				}

				case "antiair": {
					maxLevel = "anti air";
					break;
				}
			}

			techPts =
				`Unlocking The Ship: **${ship.fleetTech.techPoints.collection}**\n` +
				`Max Limit Break: **${ship.fleetTech.techPoints.maxLimitBreak}**\n` +
				`Reaching Level 120: **${ship.fleetTech.techPoints.maxLevel}**\n` +
				`Total Tech Points: **${ship.fleetTech.techPoints.total}**`;

			statsBonus =
				`Unlocking The Ship: ${
					ship.fleetTech.statsBonus.collection.bonus
				} **${collection}** for ${toTitleCase(
					ship.fleetTech.statsBonus.collection.applicable.join(", ")
				)}s\n\n` +
				`Reaching Level 120: ${
					ship.fleetTech.statsBonus.maxLevel.bonus
				} **${maxLevel}** for ${toTitleCase(
					ship.fleetTech.statsBonus.maxLevel.applicable.join(", ")
				)}s`;
		}

		const tech: EmbedBuilder = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(`${ship.names.en}'s Fleet Stats`)
			.setThumbnail(ship.thumbnail)
			.setFields(
				{ name: "Tech Points:", value: techPts, },
				{ name: "Stats Bonus:", value: statsBonus, }
			);

		this.tech = tech;
	}

	/**
	 * Generate array of ship skin embeds
	 */
	private generateSkinEmbeds() 
	{
		const ship = this.ship;
		let description: string;

		ship.skins.forEach((skin) => 
		{
			switch (skin.info.obtainedFrom.toLowerCase()) 
			{
				case "skin shop": {
					description =
						`**Skin Name**: ${skin.name}\n` +
						"**Obtain From**: Skin Shop\n" +
						`**Cost**: ${skin.info.cost} <:GEAMS:1002198674539036672>\n` +
						`**Live2D?** ${skin.info.live2dModel == false ? "No" : "Yes"}\n` +
						`**Limited or Permanent**: ${
							!skin.info.enLimited
								? `${skin.info.enClient} on EN.`
								: skin.info.enLimited
						}`;

					break;
				}

				case "default": {
					description = `**Skin Name**: ${skin.name}`;

					break;
				}

				default: {
					description =
						`**Skin Name**: ${skin.name}\n ` +
						`**Obtain From**: ${skin.info.obtainedFrom}\n`;

					break;
				}
			}

			this.skins.push(
				new EmbedBuilder()
					.setTitle(`${ship.names.en}'s Skins`)
					.setDescription(description)
					.setColor(this.color)
					.setImage(skin.bg || skin.image)
					.setThumbnail(skin.chibi)
			);
		});
	}

	/**
	 * Generate ship gallery embed
	 */
	private generateGalleryEmbed() 
	{
		const ship = this.ship;

		if (ship.gallery.length != 0) 
		{
			ship.gallery.forEach((image) => 
			{
				this.gallery.push(
					new EmbedBuilder()
						.setColor(this.color)
						.setTitle(`${ship.names.en}'s Image Gallery`)
						.setDescription(`[${image.description}](${image.url})`)
						.setImage(image.url)
				);
			});
		}
	}

	/**
	 * Return all ship embeds
	 * @returns all ship embeds
	 */
	public async getShipEmbeds() 
	{
		this.generateGeneralInfoEmbed();
		await this.generateStatsEmbed();
		this.generateSkillsEmbed();
		this.generateTechEmbed();
		this.generateSkinEmbeds();
		this.generateGalleryEmbed();

		return {
			generalInfo: this.generalInfo,
			stats: this.stats,
			skills: this.skills,
			tech: this.tech,
			skins: this.skins,
			gallery: this.gallery,
		};
	}
}

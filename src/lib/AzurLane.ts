import { AzurAPI } from "@azurapi/azurapi";
import { EmbedBuilder } from "discord.js";
import Fuse from "fuse.js";
import fetch from "node-fetch";
import { toTitleCase } from "./Utils";

/**
 * Get EXP Table
 */
export async function getALEXPTable() 
{
	const response = await fetch(
		"https://Amagi.fuwafuwa08.repl.co/azur-lane/ship-stats",
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);
	return (await response.json()).body;
}

/**
 * Format gear's stats
 * @param gearStats Stats of the gear
 * @param embed Stats embed
 */
export function gearStats(gearStats, embed: EmbedBuilder) 
{
	for (let stat in gearStats) 
	{
		let name: string;
		let st = gearStats[stat].formatted; // Stats of {name}

		if (!st) continue;

		switch (stat.toLowerCase()) 
		{
			case "rof":
				continue;
			case "antiair":
				name = "Anti-Air:";
				break;
			case "volleytime":
				name = "Volley Time:";
				break;
			case "rateoffire":
				name = "Fire Rate:";
				break;
			case "opsdamageboost":
				name = "OPS Damage Boost:";
				break;
			case "ammotype":
				name = "Ammo Type:";
				break;
			case "planehealth":
				name = "Health:";
				break;
			case "dodgelimit":
				name = "Dodge Limit:";
				break;
			case "crashdamage":
				name = "Crash Damage:";
				break;
			case "nooftorpedoes":
				name = "Torpedoes:";
				break;
			case "aaguns": {
				let guns: string[] = [];

				gearStats[stat].stats.forEach((unit) => 
				{
					guns.push(unit.formatted);
				});

				name = "AA Guns";
				st = guns.join("\n");

				break;
			}
			case "ordnance": {
				let ordnances: string[] = [];

				gearStats[stat].stats.forEach((unit) => 
				{
					ordnances.push(unit.formatted);
				});

				name = toTitleCase(stat) + ":";
				st = ordnances.join("\n");

				break;
			}
			default: {
				name = toTitleCase(stat) + ":";
				break;
			}
		}
		embed.addFields({ name, value: st, inline: true, });
	}
}

/**
 * Organize what type of ship can equip the gear
 * @param fits type of ships the gear is equippable on
 * @returns string[]
 */
export function gearFits(fits) 
{
	const fitted: string[] = [];
	for (let ship in fits) 
	{
		if (fits[ship]) 
		{
			const slot = toTitleCase(fits[ship]);
			switch (ship.toLowerCase()) 
			{
				case "destroyer":
					fitted.push(`Destroyer: ${slot}`);
					break;
				case "lightcruiser":
					fitted.push(`Light Cruiser: ${slot}`);
					break;
				case "heavycruiser":
					fitted.push(`Heavy Cruiser: ${slot}`);
					break;
				case "monitor":
					fitted.push(`Monitor: ${slot}`);
					break;
				case "largecruiser":
					fitted.push(`Large Cruiser: ${slot}`);
					break;
				case "battleship":
					fitted.push(`Battleship: ${slot}`);
					break;
				case "battlecruiser":
					fitted.push(`Battlecruiser: ${slot}`);
					break;
				case "aviationbattleship":
					fitted.push(`Aviation Battleship: ${slot}`);
					break;
				case "lightcarrier":
					fitted.push(`Light Carrier: ${slot}`);
					break;
				case "aircraftcarrier":
					fitted.push(`Aircraft Carrier: ${slot}`);
					break;
				case "repairship":
					fitted.push(`Repair Ship: ${slot}`);
					break;
				case "munitionship":
					fitted.push(`Munition Ship: ${slot}`);
					break;
				case "submarine":
					fitted.push(`Submarine: ${slot}`);
					break;
				case "submarinecarrier":
					fitted.push(`Submarine Carrier: ${slot}`);
					break;
			}
		}
	}

	return fitted;
}

/**
 * Generate embeds for chapter information
 * @param chapterInfo chapter information
 * @param chapterMode chapter mode
 * @returns array of embeds about chapter information
 */
export function chapterInfo(chapterInfo, chapterMode) 
{
	const levels: EmbedBuilder[] = [];
	const title = `Chapter ${chapterInfo.id}: ${chapterInfo.names.en}`;

	for (let i = 1; i - 1 < 4; i++) 
	{
		const blueprints: string[] = [];

		chapterInfo[i][chapterMode].blueprintDrops.forEach((blueprint) => 
		{
			const name = blueprint.tier + " " + blueprint.name;
			blueprints.push(name);
		});

		levels.push(
			new EmbedBuilder()
				.setColor(chapterMode === "normal" ? "#2b2d31" : "Red")
				.setTitle(`${title} | ${chapterInfo[i][chapterMode].code}`)
				.setDescription(
					`**${chapterInfo[i][chapterMode].title}**\n` +
						`*${chapterInfo[i][chapterMode].introduction}*`
				)
				.setFields(
					{
						name: "Unlock Requirements:",
						value: `${chapterInfo[i][chapterMode].unlockRequirements.text}`,
						inline: false,
					},

					{
						name: "Airspace Control:",
						value:
							`Actual: ${
								chapterInfo[i][chapterMode].airspaceControl.actual
									? chapterInfo[i][chapterMode].airspaceControl.actual
									: "N/A"
							}\n` +
							`Denial: ${
								chapterInfo[i][chapterMode].airspaceControl.denial
									? chapterInfo[i][chapterMode].airspaceControl.denial
									: "N/A"
							}\n` +
							`Parity: ${
								chapterInfo[i][chapterMode].airspaceControl.parity
									? chapterInfo[i][chapterMode].airspaceControl.parity
									: "N/A"
							}\n` +
							`Superiority: ${
								chapterInfo[i][chapterMode].airspaceControl.superiority
									? chapterInfo[i][chapterMode].airspaceControl.superiority
									: "N/A"
							}\n` +
							`Supremacy: ${
								chapterInfo[i][chapterMode].airspaceControl.supremacy
									? chapterInfo[i][chapterMode].airspaceControl.supremacy
									: "N/A"
							}`,
						inline: false,
					},

					{
						name: "Base XP:",
						value:
							`**Small Fleet**: ${chapterInfo[i][chapterMode].baseXP.smallFleet}\n` +
							`**Medium Fleet**: ${chapterInfo[i][chapterMode].baseXP.mediumFleet}\n` +
							`**Large Fleet**: ${chapterInfo[i][chapterMode].baseXP.largeFleet}\n` +
							`**Boss Fleet**: ${chapterInfo[i][chapterMode].baseXP.bossFleet}`,
						inline: true,
					},

					{
						name: "Enemies Level:",
						value:
							`**Mob Level**: ${chapterInfo[i][chapterMode].enemyLevel.mobLevel}\n` +
							`**Boss Level**: ${chapterInfo[i][chapterMode].enemyLevel.bossLevel}\n` +
							`**Boss Ship**: ${chapterInfo[i][chapterMode].enemyLevel.boss}`,
						inline: true,
					},

					{
						name: "Required Battles:",
						value:
							`**Battles Before Boss**: ${chapterInfo[i][chapterMode].requiredBattles}\n` +
							`**Boss Battles For 100%**: ${chapterInfo[i][chapterMode].bossKillsToClear}`,
						inline: true,
					},

					{
						name: "Drops:",
						value: chapterInfo[i][chapterMode].mapDrops.join("\n"),
						inline: true,
					},
					{
						name: "Blueprints:",
						value: blueprints.length > 0 ? blueprints.join("\n") : "None",
						inline: true,
					}
				)
		);
	}

	return levels;
}

/**
 * Search for gear using fuzzy search
 * @param gearName gear name
 * @param AL AzurAPI
 * @returns gear
 */
export async function gearSearch(gearName: string, AL: AzurAPI) 
{
	const allGears = [];
	AL.equipments.forEach(gear => allGears.push(gear));

	const searcher = new Fuse(allGears, {
		keys: ["names.en", "names.wiki"],
	});

	return searcher.search(gearName);
}

/**
 * Get embed color for gear based on gear's tier
 * @param gear gear
 * @param tier gear's tier
 * @returns embed color
 */
export function gearColor(gear, tier: number) 
{
	let color: any;
	if (gear.tiers[tier].rarity === "Normal") color = "#b0b7b8";
	if (gear.tiers[tier].rarity === "Rare") color = "#03dbfc";
	if (gear.tiers[tier].rarity === "Elite") color = "#ec18f0";
	if (gear.tiers[tier].rarity === "Super Rare") color = "#eff233";
	if (gear.tiers[tier].rarity === "Ultra Rare") color = "#000000";

	return color;
}

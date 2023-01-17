import { EmbedBuilder } from "discord.js";
import { Character } from "genshin-db";
import { color, icon, stars } from "../lib/Genshin";
import genshin from "genshin-db";

export class ShinanoCharacter {
	character: Character;
	icon: string;
	color: any;
	stars: string;
	mc: boolean = false;

	generalInfo: EmbedBuilder;
	travellerConstellations: EmbedBuilder[] = [];
	constellations: EmbedBuilder;
	ascensionCosts: EmbedBuilder[] = [];

	stats: EmbedBuilder;

	constructor(character) {
		this.character = character;

		this.color = color(character);
		this.icon = icon(character);
		this.stars = stars(character);

		if (character.name === "Aether" || character.name === "Lumine") {
			this.mc = true;
			this.color = "Grey";
		}
	}

	/**
	 * Get constellations for a character
	 * @param charName character name
	 * @param embedColor color for embed
	 */
	private queryCons(charName?: string, embedColor?) {
		const character = this.character;

		const charCons = genshin.constellations(
			charName ? charName : character.name
		);
		const consInfo = [];

		for (let cons in charCons) {
			if (!["name", "images", "version"].includes(cons)) {
				consInfo.push({
					name: cons.toUpperCase() + " | " + charCons[cons].name,
					description: charCons[cons].effect,
				});
			}
		}

		this.constellations = new EmbedBuilder()
			.setColor(embedColor ? color(embedColor) : this.color)
			.setTitle(`${charName ? charName : character.name}'s Constellations`)
			.setThumbnail(character.images.icon);

		consInfo.forEach((cons) => {
			this.constellations.addFields({
				name: cons.name,
				value: cons.description,
			});
		});

		return this.constellations;
	}

	/**
	 * Get all traveler's constellations
	 */
	private queryTravellerCons() {
		const currNumOfTravellerElement: number = 4;
		for (let i = 0; i < currNumOfTravellerElement; i++) {
			let element: string;

			switch (i) {
				case 0:
					element = "Anemo";
					break;
				case 1:
					element = "Geo";
					break;
				case 2:
					element = "Electro";
					break;
				case 3:
					element = "Dendro";
					break;
			}

			this.travellerConstellations.push(
				this.queryCons(`Traveler (${element})`, element)
			);
		}
	}

	/**
	 * Generate character general info embed
	 */
	private genGeneralInfoEmbed() {
		const character = this.character;

		this.generalInfo = new EmbedBuilder()
			.setColor(this.color)
			.setTitle(
				`${character.name} | ${this.mc ? "Main Character" : character.title}`
			)
			.setDescription(
				`*${character.description}*\n\n${
					character.url ? `[Wiki Link](${character.url.fandom})` : ""
				}`
			)
			.setThumbnail(character.images.icon)
			.addFields(
				{
					name: "Element:",
					value: this.mc ? "All" : icon(character),
				},
				{
					name: "Rarity:",
					value: stars(character),
				},
				{
					name: "Weapon Type:",
					value: character.weapontype,
				},
				{
					name: "Constellation",
					value: character.constellation,
				},
				{
					name: "Birthday:",
					value: this.mc ? "Player's Birthday" : character.birthday,
				},
				{
					name: "Region | Affiliation",
					value: this.mc
						? "? | Many"
						: `${character.region} | ${character.affiliation}`,
				},
				{
					name: "VAs:",
					value:
						`CN: ${character.cv.chinese}\n` +
						`JP: ${character.cv.japanese}\n` +
						`KR: ${character.cv.korean}\n` +
						`EN: ${character.cv.english}`,
				}
			)
			.setFooter({ text: `Added in Version ${character.version}` });
	}

	/**
	 * Generate character constellations embed(s)
	 */
	private genConstellationsEmbed() {
		this.mc ? this.queryTravellerCons() : this.queryCons();
	}

	/**
	 * Generate character ascension costs embeds
	 */
	private genAscensionCostsEmbeds() {
		const character = this.character;
		const ascensionCosts = [];

		for (let ascensionLevel in character.costs) {
			let materials = [];

			character.costs[ascensionLevel].forEach((material) => {
				materials.push(`${material.count}x **${material.name}**`);
			});

			ascensionCosts.push(materials.join("\n"));
		}

		for (let i = 0; i < ascensionCosts.length; i++) {
			this.ascensionCosts.push(
				new EmbedBuilder()
					.setColor(this.color)
					.setTitle(`${character.name}'s Ascension Costs`)
					.setThumbnail(character.images.icon)
					.addFields({ name: `Ascension ${i + 1}:`, value: ascensionCosts[i] })
			);
		}
	}

	/**
	 * Get all character embeds
	 */
	public getCharacterEmbeds() {
		this.genGeneralInfoEmbed();
		this.genConstellationsEmbed();
		this.genAscensionCostsEmbeds();

		return {
			generalInfo: this.generalInfo,
			constellations: this.constellations,
			travellerConstellations: this.travellerConstellations,
			ascensionCosts: this.ascensionCosts,
		};
	}

	/**
	 * Get character stats embed
	 * @param level character level
	 * @param ascension character ascension phase
	 */
	public getCharaterStatsEmbed(level: number, ascension?: string) {
		const character = this.character;
		let characterStats = character.stats(level);

		if (ascension)
			characterStats = character.stats(level, parseInt(ascension, 10));

		let characterSpecializedStat: string | number = characterStats.specialized;
		if (characterStats.specialized && characterStats.specialized % 1 != 0)
			characterSpecializedStat =
				(characterStats.specialized * 100).toFixed(2) + "%";

		this.stats = new EmbedBuilder()
			.setColor(this.color)
			.setThumbnail(character.images.icon)
			.setTitle(`${character.name}'s Stats | Level ${level}`)
			.addFields(
				{
					name: "Level & Ascensions:",
					value:
						`Level: **${characterStats.level}**\n` +
						`Ascensions: **${characterStats.ascension}**`,
				},
				{
					name: "Character's Stats:",
					value:
						`HP: **${
							characterStats.hp ? `${characterStats.hp.toFixed(2)} HP` : "N/A"
						}**\n` +
						`ATK: **${
							characterStats.attack
								? `${characterStats.attack.toFixed(2)} ATK`
								: "N/A"
						}**\n` +
						`DEF: **${
							characterStats.defense
								? `${characterStats.defense.toFixed(2)} DEF`
								: "N/A"
						}**\n` +
						`Ascension Stat: **${
							characterStats.specialized
								? `${characterSpecializedStat} ${character.substat}`
								: "N/A"
						}**\n`,
				}
			);

		return this.stats;
	}
}

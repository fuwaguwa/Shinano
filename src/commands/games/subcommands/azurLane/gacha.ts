import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder
} from "discord.js";
import Fuse from "fuse.js";
import fs from "fs/promises";
import path from "path";
import { WeightedPicker } from "../../../../structures/WeightedPicker";
import { collectors } from "../../../../events/cmdInteraction";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const banners = JSON.parse(
		await fs.readFile(
			path.join(__dirname, "..", "..", "..", "..", "..", "data", "banner.json"),
			"utf-8"
		)
	);

	/**
	 * Acquiring Info
	 */
	const bannerName: string = interaction.options.getString("banner-name");
	const bannerSearch = new Fuse(banners.allBanners, { keys: ["name"], });
	const reqBanner: any = bannerSearch.search(bannerName);

	let pullResults = [];
	let pity = 0;
	let totalPulls = 0;
	let coins = 0;
	let cubes = 0;
	let bannerInfo = {
		name: null,
		URBanner: false,
		image: null,
		type: 1,
		rateUps: [],
		rateUpsRaw: [],
		pool: [],
	};

	/**
	 * Creating pool
	 */
	if (["Light", "Heavy", "Special"].includes(reqBanner[0].item.name)) 
	{
		bannerInfo.name = reqBanner[0].item.name;
		bannerInfo.pool = reqBanner[0].item.pool;
		bannerInfo.image = reqBanner[0].item.image;

		if (reqBanner[0].item.name !== "Light") bannerInfo.type = 2;
	}
	else 
	{
		const result = reqBanner[0].item;
		const baseBanner = banners.allBanners[result.add];

		bannerInfo.name = result.name;
		bannerInfo.pool = baseBanner.pool;
		bannerInfo.image = result.image;

		if (result.add != 0) bannerInfo.type = 2;

		if (result.pool[0].rarity === "UR") bannerInfo.URBanner = true;

		result.pool.forEach((ship) => 
		{
			bannerInfo.rateUps.push(
				`${ship.rarity} | ${ship.name} (+${ship.weight}%)`
			);
			bannerInfo.rateUpsRaw.push(ship.name);

			const exist = bannerInfo.pool.find(bShip => bShip.name === ship.name);

			if (exist) 
			{
				bannerInfo.pool[bannerInfo.pool.indexOf(exist)].weight =
					baseBanner.rates[ship.rarity] + ship.weight;
			}
			else 
			{
				bannerInfo.pool.push({
					name: ship.name,
					rarity: ship.rarity,
					weight: baseBanner.rates[ship.rarity] + ship.weight,
				});
			}
		});
	}

	const gacha = new WeightedPicker(bannerInfo.pool);

	/**
	 * Outputting
	 */
	const bannerEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle(`${bannerInfo.name} Banner`);
	if (bannerInfo.image) bannerEmbed.setImage(bannerInfo.image);
	if (bannerInfo.rateUps.length > 0)
		bannerEmbed.setFields({
			name: "Rate-Ups",
			value: bannerInfo.rateUps.join("\n"),
		});

	const buildButtons: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setEmoji({ name: "🔨", })
				.setLabel("Build x1")
				.setCustomId(`BUILD1-${interaction.user.id}`),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setEmoji({ name: "⚒️", })
				.setLabel("Build x10")
				.setCustomId(`BUILD10-${interaction.user.id}`)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [bannerEmbed],
		components: [buildButtons],
	});
	const collector = await message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 120000,
	});

	collectors.set(interaction.user.id, collector);

	collector.on("collect", async (i) => 
	{
		const customId = i.customId.split("-")[0];
		if (!i.customId.endsWith(i.user.id)) 
		{
			await i.reply({
				content: "This button is not for you!",
				ephemeral: true,
			});
		}
		else 
		{
			await i.deferUpdate();

			if (totalPulls >= 300) return collector.stop();

			// Pulling
			const numPulls = parseInt(customId.split("BUILD")[1]);
			for (let i = 0; i < numPulls; i++) 
			{
				totalPulls++;

				if (bannerInfo.URBanner) 
				{
					pity++;

					if (pity >= 200) 
					{
						pullResults.push(
							Object.assign(
								bannerInfo.pool.find(ship => ship.rarity === "UR"),
								{ times: 1, }
							)
						);
						pity = 0;
						continue;
					}
				}
				pullResults.push(Object.assign(gacha.pick(), { times: 1, }));
			}

			// Filtering Pull
			const filteredPulls = [];
			pullResults.forEach((pull) => 
			{
				const appeared = filteredPulls.find(fPull => fPull.name === pull.name);
				appeared
					? filteredPulls[filteredPulls.indexOf(appeared)].times++
					: filteredPulls.push(pull);
			});

			// Formatting into description
			let description: string = "";
			filteredPulls.forEach((pull) => 
			{
				const text = `${pull.times}x ${pull.name} (${pull.rarity})`;

				if (
					["SSR", "UR"].includes(pull.rarity) ||
					bannerInfo.rateUpsRaw.includes(pull.name)
				) 
				{
					description += `**${text}**\n`;
				}
				else 
				{
					description += text + "\n";
				}
			});

			// Banner type => banner spendings
			if (bannerInfo.type == 1) 
			{
				cubes += 1 * numPulls;
				coins += 600 * numPulls;
			}
			else 
			{
				cubes += 2 * numPulls;
				coins += 1500 * numPulls;
			}

			const result: EmbedBuilder = new EmbedBuilder()
				.setColor("#2b2d31")
				.setTitle(`${bannerInfo.name} Banner | Build Results`)
				.setDescription(description)
				.setFooter({
					text: `Pity: ${
						bannerInfo.URBanner ? pity : "N/A"
					} | Total: ${totalPulls} | Cubes: ${cubes} | Coins: ${coins.toLocaleString()}`,
				});

			await interaction.editReply({
				embeds: [result],
				components: [buildButtons],
			});

			collector.resetTimer();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		for (let i = 0; i < buildButtons.components.length; i++)
			buildButtons.components[i].setDisabled(true);
		await interaction.editReply({ components: [buildButtons], });
	});
};

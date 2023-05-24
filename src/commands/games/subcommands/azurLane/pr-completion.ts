import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getALEXPTable } from "../../../../lib/AzurLane";
import { closest } from "../../../../lib/Utils";

export = async (interaction: ChatInputCommandInteraction, AL: any) => 
{
	/**
	 * Processing Data
	 */
	const shipName: string = interaction.options
		.getString("ship-name")
		.toLowerCase();

	let devLevel: number = interaction.options.getInteger("dev-level");
	const unusedBPs: number = interaction.options.getInteger("unused-bps");

	let fateSimLevel: number;
	let totalPRBPs: number;
	let prTable: number[];
	let prFSTable: number[];
	let prFSTableTotal: number[];
	let color: any;

	const data = await getALEXPTable();

	/**
	 * Filtering
	 */
	if (!interaction.options.getString("fate-sim-level")) 
	{
		fateSimLevel = 0;
	}
	else 
	{
		fateSimLevel = parseInt(
			interaction.options.getString("fate-sim-level"),
			10
		);
		devLevel = 30;
	}

	const ship: any = await AL.ships.get(shipName);
	if (!ship) 
	{
		const shipNotFound: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | I couldn't find that ship...");
		return interaction.reply({ embeds: [shipNotFound], ephemeral: true, });
	}

	if (ship.rarity !== "Priority" && ship.rarity !== "Decisive") 
	{
		const shipNotPR: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				`❌ | I apologize, but \`${ship.names.en}\` does not have the PR/DR classsification...`
			);
		return interaction.reply({ embeds: [shipNotPR], });
	}

	if (ship.rarity === "Priority") 
	{
		color = "Gold";
		prTable = data.PR;
		prFSTable = data["PR-FS"];
		prFSTableTotal = data["PR-FS-TOTAL"];
		totalPRBPs = prTable[30] + prFSTable[5];
	}
	else 
	{
		color = "#2b2d31";
		prTable = data.DR;
		prFSTable = data["DR-FS"];
		prFSTableTotal = data["DR-FS-TOTAL"];
		totalPRBPs = prTable[30] + prFSTable[5];
	}

	if (
		unusedBPs < 0 ||
		devLevel < 0 ||
		fateSimLevel < 0 ||
		(unusedBPs > totalPRBPs && devLevel > 0) ||
		devLevel > 30
	) 
	{
		const impossible: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | Pardon me, but your input data appears to be erroneous. Kindly verify them once more, I beseech you."
			);
		return interaction.reply({ embeds: [impossible], });
	}

	/**
	 * Math (I forgor what I was doing 💀)
	 */
	const totalBPs: number =
		fateSimLevel > 0
			? prTable[30] + prFSTable[fateSimLevel] + unusedBPs
			: prTable[devLevel] + unusedBPs;
	const BPsAwayFromDev30: number =
		prTable[30] - totalBPs < 0 ? 0 : prTable[30] - totalBPs;
	const BPsAwayFromFS5: number = prTable[30] + prFSTable[5] - totalBPs;
	const PRcompletionPercentage: number =
		fateSimLevel > 0 ? 100 : (totalBPs / prTable[30]) * 100;
	const PRcompletionPercentageFS: number =
		(totalBPs / (prTable[30] + prFSTable[5])) * 100;
	let finalDevLevel: number = closest(totalBPs, prTable);
	let finalFSLevel: number = closest(totalBPs, prFSTableTotal);

	if (prTable[finalDevLevel] > totalBPs && finalDevLevel != 0)
		finalDevLevel -= 1;
	if (prFSTableTotal[finalFSLevel] > totalBPs && finalFSLevel != 0)
		finalFSLevel -= 1;

	/**
	 * Displaying data
	 */
	const completion: EmbedBuilder = new EmbedBuilder()
		.setColor(color)
		.setTitle(`PR Completion | ${ship.rarity} | ${ship.names.en}`)
		.setThumbnail(ship.thumbnail)
		.setFields(
			{
				name: "Ship Info:",
				value:
					`Dev Level: **${devLevel}**\n` +
					`Fate Sim Level: **${fateSimLevel}**\n` +
					`Unused BPs: **${unusedBPs}**\n`,
			},

			{
				name: "Current PR Progress:",
				value:
					`Total BPs: **${totalBPs}**\n` +
					`BPs until Dev 30: **${BPsAwayFromDev30}**\n` +
					`BPs until Fate Sim 5: **${BPsAwayFromFS5}**\n\n` +
					`Final Dev Level: **${finalDevLevel}**\n` +
					`Final Fate Sim Level: **${finalFSLevel}**\n\n` +
					`PR Completion: **${PRcompletionPercentage.toFixed(2)}%**\n` +
					`PR Completion (w/Fate Sim): **${PRcompletionPercentageFS.toFixed(
						2
					)}%**`,
			}
		)
		.setFooter({
			text: "Fate Sim is included regardless even if the ship does not have Fate Sim in game.",
		});
	await interaction.editReply({ embeds: [completion], });
};

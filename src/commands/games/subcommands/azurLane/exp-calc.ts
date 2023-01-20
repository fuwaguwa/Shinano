import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getALEXPTable } from "../../../../lib/AzurLane";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Filtering Input
	 */
	let currentLevel = interaction.options.getInteger("current-level");
	let targetLevel = interaction.options.getInteger("target-level");
	const rarity = interaction.options.getString("rarity");

	if (currentLevel > 125) currentLevel = 125;
	if (targetLevel > 125) targetLevel = 125;

	if (currentLevel > targetLevel) 
	{
		const overboard: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | Current level cannot be bigger than target level!");
		return interaction.editReply({ embeds: [overboard], });
	}

	/**
	 * Special Case and Error
	 */
	const expNeeded: EmbedBuilder = new EmbedBuilder()
		.setTitle("Experience Calculator")
		.setColor("#2f3136");
	if (currentLevel == targetLevel) 
	{
		expNeeded.setDescription(
			`You will need **0 EXP** to get ${
				rarity === "normal" ? "a Normal ship" : "an Ultra Rare ship"
			} from LV${currentLevel} to LV${targetLevel}`
		);
		return interaction.editReply({ embeds: [expNeeded], });
	}

	if (currentLevel == 0 || targetLevel == 0) 
	{
		const tooLow: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				`${
					currentLevel == 0 ? "Ship's current level" : "Target level"
				} must be bigger than 0!`
			);
		return interaction.editReply({ embeds: [tooLow], });
	}

	/**
	 * Calculating EXP Difference
	 */
	const data = await getALEXPTable();

	let table: number[];
	rarity === "normal" ? (table = data.normal) : (table = data.ultraRare);

	const expDifference = table[targetLevel - 1] - table[currentLevel - 1];

	expNeeded.setDescription(
		`You will need **${expDifference.toLocaleString()} EXP** to get ${
			rarity === "normal" ? "a Normal ship" : "an Ultra Rare ship"
		} from level **${currentLevel}** to level **${targetLevel}**`
	);
	return interaction.editReply({ embeds: [expNeeded], });
};

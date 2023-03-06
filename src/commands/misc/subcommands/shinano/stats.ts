import fetch from "node-fetch";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.deferred) await interaction.deferReply();

	/**
	 * Top.gg Stats
	 */
	const response = await fetch("https://top.gg/api/bots/1002193298229829682", {
		method: "GET",
		headers: {
			Authorization: process.env.topggApiKey,
		},
	});
	const topggStats = await response.json();

	/**
	 * API Stats
	 */
	const apiResponse = await fetch("https://Amagi.fuwafuwa08.repl.co");
	const apiStatus = await apiResponse.json();

	/**
	 * Uptime
	 */
	let totalSeconds = client.uptime / 1000;
	totalSeconds %= 86400;

	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;

	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);

	/**
	 * Output
	 */
	// Outputting Data
	const performance: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Shinano's Stats")
		.addFields(
			{
				name: "Uptime:",
				value: `${hours} hours, ${minutes} minutes, ${seconds} seconds`,
			},
			{
				name: "Bot Stats:",
				value:
					`Total Guilds: **${client.guilds.cache.size}**\n` +
					`Current Votes: **${topggStats.monthlyPoints}**\n` +
					`Total Votes: **${topggStats.points}**\n`,
			},
			{
				name: "API Status:",
				value:
					`Connected to Database: **${apiStatus.connectedToDatabase}**`,
			}
		);
	await interaction.editReply({ embeds: [performance], });
};

import os from "os";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => {
	const memory = process.memoryUsage();
	const performance: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Memory Stats")
		.addFields(
			{
				name: "Memory Usage:",
				value:
					`RSS: ${(memory.rss / 1024 ** 2).toFixed(2)}MB\n` +
					`External: ${(memory.external / 1024 ** 2).toFixed(2)}MB\n` +
					`Heap Total Used: ${(memory.heapUsed / 1024 ** 2).toFixed(2)}MB\n` +
					`Heap Total Mem: ${(memory.heapTotal / 1024 ** 2).toFixed(2)}MB`,
			},
			{
				name: "Server Information:",
				value:
					`Free Mem: ${(os.freemem() / 1024 ** 2).toFixed(2)}MB\n` +
					`Total Mem: ${(os.totalmem() / 1024 ** 2).toFixed(2)}MB`,
			}
		);
	await interaction.editReply({ embeds: [performance] });
};

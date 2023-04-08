import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const pingEmbed: EmbedBuilder = new EmbedBuilder()
		.setTitle("Pong 🏓")
		.setDescription(
			`Latency: ${
				Date.now() - interaction.createdTimestamp
			}ms\nAPI Latency: ${Math.round(client.ws.ping)}ms`
		)
		.setColor("#2b2d31");
	await interaction.reply({ embeds: [pingEmbed], });
};

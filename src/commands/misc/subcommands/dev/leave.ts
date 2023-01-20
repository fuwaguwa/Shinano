import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const guild = await client.guilds.fetch(
		interaction.options.getString("guild-id")
	);
	await guild.leave();

	const left: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(`Shinano has left \`${guild.name}\``);
	await interaction.editReply({ embeds: [left], });
};

import { Event } from "../structures/Event";
import { client } from "../index";
import { EmbedBuilder, TextChannel } from "discord.js";
import { codeBlock } from "discord.js";

const owner = "836215956346634270";
export default new Event("interactionCreate", async (interaction) => 
{
	if (!interaction.isStringSelectMenu()) return;

	/**
	 * Logging menu interaction
	 */
	if (interaction.user.id === owner) return;

	const mainGuild = await client.guilds.fetch("1002188088942022807");
	const commandLogsChannel = await mainGuild.channels.fetch(
		"1092449495171735612"
	);

	const fullCommand = interaction.customId;
	const commandExecuted: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle("Command Executed!")
		.setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, }))
		.addFields(
			{ name: "Command Name: ", value: `\`${fullCommand}\``, },
			{
				name: "Guild Name | Guild ID",
				value: `${interaction.guild.name} | ${interaction.guild.id}`,
			},
			{
				name: "Channel Name | Channel ID",
				value: `#${interaction.channel.name} | ${interaction.channel.id}`,
			},
			{
				name: "User | User ID",
				value: `${interaction.user.username}#${interaction.user.discriminator} | ${interaction.user.id}`,
			},
			{
				name: "Values",
				value: codeBlock(interaction.values.join(", ")),
			}
		)
		.setTimestamp();
	await (commandLogsChannel as TextChannel).send({
		embeds: [commandExecuted],
	});
});

import { EmbedBuilder, Guild, TextChannel } from "discord.js";
import { client } from "..";
import { updateServerCount } from "../lib/Utils";
import { Event } from "../structures/Event";

export default new Event("guildDelete", async (guild) => 
{
	if (["1068135541360578590", "260978723455631373"].includes(guild.id)) return;

	const logGuild: Guild = await client.guilds.fetch("1002188088942022807");
	const ioChannel: TextChannel = (await logGuild.channels.fetch(
		"1017463107737628732"
	)) as TextChannel;

	const kickedEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Red")
		.setTitle("Shinano left a server!")
		.setFields({
			name: "Guild Name | Guild ID",
			value: `${guild.name} | ${guild.id}`,
		})
		.setTimestamp();
	await ioChannel.send({ embeds: [kickedEmbed], });
	await updateServerCount();
});

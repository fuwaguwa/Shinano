import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Embed,
	EmbedBuilder,
	Guild,
	TextChannel,
} from "discord.js";
import { client } from "..";
import { updateServerCount } from "../lib/Utils";
import { Event } from "../structures/Event";

export default new Event("guildCreate", async (guild) => {
	await guild
		.fetchAuditLogs({
			type: 28,
			limit: 1,
		})
		.then(async (log) => {
			const logGuild: Guild = await client.guilds.fetch("1002188088942022807");
			const ioChannel: TextChannel = (await logGuild.channels.fetch(
				"1017463107737628732"
			)) as TextChannel;
			const adder = log.entries.first().executor;

			const botAddEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Green")
				.setTitle("Shinano joined a server!")
				.setThumbnail(adder.displayAvatarURL({ forceStatic: false }))
				.setImage(guild.iconURL({ forceStatic: false }))
				.setFields(
					{
						name: "Guild Name | Guild ID",
						value: `${guild.name} | ${guild.id}`,
					},
					{
						name: "User | User ID",
						value: `${adder.username}#${adder.discriminator} | ${adder.id}`,
					}
				)
				.setTimestamp();
			await ioChannel.send({ embeds: [botAddEmbed] });

			await updateServerCount();
		});

	/**
	 * Join message
	 */
	await guild.channels.cache.some((channel) => {
		if (
			channel.name.includes("general") ||
			channel.name.includes("lobby") ||
			channel.name.includes("chat")
		) {
			const helloEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setDescription(
					"I am Shinano, a multi-purpose Discord bot designed to serve shikikans all over the world. " +
						"Whether it is providing information about shipfus, query information in Genshin, or to entertain you, I can do it all while being half-asleep...zzz\n\n" +
						"You can learn more about what I can do by using `/shinano help`. If you're experiencing any trouble with the bot, please join the support server down below!"
				)
				.setThumbnail(
					"https://cdn.discordapp.com/avatars/1002193298229829682/14d86d9092130bb9b6dfc49af0a110b2.webp?size=1024"
				);
			const supportServer: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL("https://discord.gg/NFkMxFeEWr")
						.setLabel("Support Server")
						.setEmoji({ name: "⚙️" }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setURL("https://top.gg/bot/1002193298229829682")
						.setLabel("Top.gg")
						.setEmoji({ id: "1002849574517477447" })
				);
			(async () =>
				await (channel as TextChannel).send({
					embeds: [helloEmbed],
					components: [supportServer],
				}))();

			return true;
		}
		return false;
	});
});

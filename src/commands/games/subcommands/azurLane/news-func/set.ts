import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from "discord.js";
import News from "../../../../../schemas/ALNews";

export = async (interaction: ChatInputCommandInteraction) => {
	/**
	 * Perm Check
	 */
	const guildUserPerms = (
		await interaction.guild.members.fetch(interaction.user)
	).permissions;

	if (
		!guildUserPerms.has("Administrator") &&
		!guildUserPerms.has("ManageWebhooks")
	) {
		const noPerm: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | You need `Manage Webhooks` permission to use this command!"
			);
		return interaction.editReply({ embeds: [noPerm] });
	}

	const channel =
		interaction.options.getChannel("channel") || interaction.channel;

	if (
		!interaction.guild.members.me
			.permissionsIn(channel as TextChannel)
			.has("SendMessages")
	) {
		const noPerm: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | Shinano does not have permission to send message in this channel"
			);
		return interaction.reply({ embeds: [noPerm] });
	}

	/**
	 * Setting the channel to post news
	 */
	const dbChannel = await News.findOne({ guildId: interaction.guild.id });
	dbChannel
		? await dbChannel.updateOne({ channelId: channel.id })
		: await News.create({
				guildId: interaction.guild.id,
				channelId: channel.id,
		  });
	const done: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			`✅ | Shinano will now send the latest news/tweets about the game in <#${channel.id}>`
		);
	await interaction.editReply({ embeds: [done] });
};

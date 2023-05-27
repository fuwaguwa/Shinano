import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import Guild from "../../../../../schemas/AutoLewd";

export = async (interaction: ChatInputCommandInteraction) => 
{
	/**
	 * Perm Check
	 */
	const guildUserPerms = (
		await interaction.guild.members.fetch(interaction.user)
	).permissions;

	if (
		!guildUserPerms.has("Administrator") &&
		!guildUserPerms.has("ManageWebhooks")
	) 
	{
		const noPerm: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | I humbly apologize, but you devoid of the `Manage Webhooks` permission..."
			);
		return interaction.editReply({ embeds: [noPerm], });
	}

	const channel = interaction.options.getChannel("channel") as TextChannel;

	if (
		!interaction.guild.members.me.permissionsIn(channel).has("SendMessages")
	) 
	{
		const noPerm: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | I seem to lack the permission to `Send Messages` in this channel..."
			);
		return interaction.editReply({ embeds: [noPerm], });
	}

	if (!channel.nsfw) 
	{
		const nsfw: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("NSFW Command")
			.setDescription(
				"I apologize, but commands of NSFW nature are exclusively permissible within NSFW-designated channels..."
			);
		return interaction.editReply({ embeds: [nsfw], });
	}

	/**
	 * Setting channel for autohentai
	 */
	const dbChannel = await Guild.findOne({ guildId: interaction.guild.id, });
	dbChannel
		? await dbChannel.update({
			channelId: channel.id,
			identifier: `${interaction.guild.id}|${interaction.user.id}`,
		  })
		: await Guild.create({
			guildId: interaction.guild.id,
			channelId: channel.id,
			identifier: `${interaction.guild.id}|${interaction.user.id}`,
		  });
	const done: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			`✅ | Shinano will now post lewdies into <#${channel.id}> every 5 minutes! She won't start posting right away, and please make sure she has permission to send message in that channel!`
		);
	await interaction.editReply({ embeds: [done], });
};

import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import News from "../../../../../schemas/ALNews";

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
				"❌ | Ah, my apologies, Shikikan. It seems I am unable to fulfill your request without the necessary permission to `Send Messages` in the channel..."
			);
		return interaction.editReply({ embeds: [noPerm], });
	}

	/**
	 * Setting the channel to post news
	 */
	const dbChannel = await News.findOne({ guildId: interaction.guild.id, });
	dbChannel
		? await dbChannel.updateOne({ channelId: channel.id, })
		: await News.create({
			guildId: interaction.guild.id,
			channelId: channel.id,
		  });
	const done: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			`✅ | I shall send you the most recent news in <#${channel.id}>...`
		);
	await interaction.editReply({ embeds: [done], });
};

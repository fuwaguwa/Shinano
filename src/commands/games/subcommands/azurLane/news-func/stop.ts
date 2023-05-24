import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
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
				"❌ | \"I humbly apologize, but you devoid of the `Manage Webhooks` permission...\""
			);
		return interaction.editReply({ embeds: [noPerm], });
	}

	/**
	 * Channel Check
	 */
	const dbChannel = await News.findOne({ guildId: interaction.guild.id, });
	if (!dbChannel) 
	{
		const none: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | \"Alas, you have yet to establish any arrangement of channel for this one to deliver thy news...\""
			);
		return interaction.editReply({ embeds: [none], });
	}

	/**
	 * Stop posting news
	 */
	dbChannel.deleteOne({ guildId: interaction.guild.id, });
	const deleted: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			"✅ | \"I shall cease from disseminating the news forthwith...\""
		);
	await interaction.editReply({ embeds: [deleted], });
};

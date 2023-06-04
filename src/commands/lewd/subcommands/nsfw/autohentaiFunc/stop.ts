import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
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

	/**
	 * Channel Check
	 */
	const dbChannel = await Guild.findOne({ guildId: interaction.guild.id, });
	if (!dbChannel) 
	{
		const none: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(
				"❌ | Alas, you have yet to establish any arrangement for this one to post...lewd stuff..."
			);
		return interaction.editReply({ embeds: [none], });
	}

	/**
	 * Stop posting news
	 */
	await dbChannel.deleteOne({ guildId: interaction.guild.id, });

	const deleted: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription(
			"✅ | Shinano will no longer send lewdies into the server!"
		);
	await interaction.editReply({ embeds: [deleted], });
};

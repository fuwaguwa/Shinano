import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	GuildPremiumTier
} from "discord.js";
import { client } from "../../../../..";

function guildTier(guild: Guild) 
{
	if (guild.premiumTier === GuildPremiumTier.None) return "**None**";
	if (guild.premiumTier === GuildPremiumTier.Tier1) return "**Tier 1**";
	if (guild.premiumTier === GuildPremiumTier.Tier2) return "**Tier 2**";
	return "**Tier 3**";
}

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.isChatInputCommand()) return;

	const guild: Guild = await client.guilds.fetch(
		interaction.options.getString("guild-id")
	);

	if (!guild) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No guild of that ID can be found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	const guildEmbed = new EmbedBuilder()
		.setTitle(`${guild.name}`)
		.setColor("#2b2d31")
		.setFields(
			{
				name: "Registered",
				value: `<t:${Math.floor(new Date(guild.createdAt).getTime() / 1000)}>`,
			},
			{ name: "Current Owner", value: `<@${guild.ownerId}>`, },
			{
				name: "Boost Status",
				value: `${guildTier(guild)} [${guild.premiumSubscriptionCount}/14]`,
			},
			{
				name: "Role Count",
				value: `**${guild.name}** has **${guild.roles.cache.size} roles**.`,
			},
			{
				name: "Member Count",
				value: `**${guild.memberCount} Members**`,
			}
		)
		.setFooter({ text: `Guild ID: ${guild.id}`, });
	if (guild.iconURL())
		guildEmbed.setThumbnail(guild.iconURL({ forceStatic: false, size: 512, }));

	await interaction.editReply({ embeds: [guildEmbed], });
};

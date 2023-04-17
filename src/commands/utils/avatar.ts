import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	GuildMember,
	User
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "avatar",
	description: "Get user's avatar.",
	cooldown: 3000,
	category: "Utilities",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "global",
			description: "Get an user's global avatar.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The user you want the avatar from.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "guild",
			description: "Get an user's server/guild avatar.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The user you want the avatar from.",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		const user: User = interaction.options.getUser("user") || interaction.user;
		let link;

		if (interaction.options.getSubcommand() === "global") 
		{
			link = user.displayAvatarURL({ forceStatic: false, size: 1024, });
		}
		else 
		{
			try 
			{
				const guildUser: GuildMember = await interaction.guild.members.fetch(
					user
				);
				link = guildUser.displayAvatarURL({ forceStatic: false, size: 1024, });
			}
			catch (error) 
			{
				const errorEmbed: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setDescription(
						"❌ | User is not in the guild, please use `/avatar global` instead!"
					);
				return interaction.reply({ embeds: [errorEmbed], });
			}
		}

		const avatarEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2b2d31")
			.setDescription(`${user}'s avatar`)
			.setImage(link)
			.setFooter({ text: `UID: ${user.id}`, });

		await interaction.reply({ embeds: [avatarEmbed], });
	},
});

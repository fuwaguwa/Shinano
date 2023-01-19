import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getNekoReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "highfive",
	description: "Highfive!",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to highfive.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setDescription(
				user
					? `${interaction.user} highfived ${user}`
					: "You highfived yourself?"
			)
			.setImage(await getNekoReactionGIF(interaction.commandName));

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

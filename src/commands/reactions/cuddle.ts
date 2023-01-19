import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getWaifuReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "cuddle",
	description: "Cuddle with someone!",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to cuddle with.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(await getWaifuReactionGIF(interaction.commandName))
			.setDescription(
				user
					? `${interaction.user} cuddled with ${user}!`
					: `You cuddled with yourself?`
			);

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

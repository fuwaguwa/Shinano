import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getWaifuReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "lick",
	description: "Lick someone...",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to lick.",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(await getWaifuReactionGIF(interaction.commandName))
			.setDescription(
				user
					? `${interaction.user} licked ${user}...ew`
					: `You hugged yourself?`
			);

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

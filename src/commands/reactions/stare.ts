import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getNekoReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "stare",
	description: "👀",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to stare at.",
		},
	],
	run: async ({ interaction }) => {
		await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setDescription(
				user
					? `${interaction.user} is staring at ${user}!`
					: "You are staring at yourself?"
			)
			.setImage(await getNekoReactionGIF(interaction.commandName));

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

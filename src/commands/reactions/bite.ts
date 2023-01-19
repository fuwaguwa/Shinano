import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getWaifuReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "bite",
	description: "Chomp!",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to bite.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(await getWaifuReactionGIF(interaction.commandName))
			.setDescription(
				user ? `${interaction.user} bit ${user}!` : `You bit yourself...wtf?`
			);

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

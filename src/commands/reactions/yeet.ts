import { ApplicationCommandOptionType, EmbedBuilder, User } from "discord.js";
import { getNekoReactionGIF } from "../../lib/Utils";
import { ChatInputCommand } from "../../structures/Command";

export default new ChatInputCommand({
	name: "yeet",
	description: "Yeet!",
	cooldown: 4000,
	category: "Reactions",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "Person to yeet.",
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.deferred) await interaction.deferReply();

		const user: User = interaction.options.getUser("user");
		const reactionEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setDescription(
				user ? `${interaction.user} yeeted ${user}!` : "You yeeted yourself?"
			)
			.setImage(await getNekoReactionGIF(interaction.commandName));

		await interaction.editReply({ embeds: [reactionEmbed] });
	},
});

import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel,
} from "discord.js";
import nsfwSubs from "../../../lewd/subcommands/nsfwSubs";

export = async (interaction: ChatInputCommandInteraction) => {
	if (!(interaction.channel as TextChannel).nsfw) {
		const nsfwCommand: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("NSFW Command")
			.setDescription("NSFW commands can only be used in NSFW channels.");
		return interaction.reply({ embeds: [nsfwCommand] });
	}

	await interaction.deferReply();
	const embed: EmbedBuilder = new EmbedBuilder().setColor("#2f3136");

	await nsfwSubs.privateColle(interaction, embed, "shinano");
};

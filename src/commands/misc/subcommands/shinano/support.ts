import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => {
	const supportEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setDescription(
			"If you got any issue with the bot, please contact us in the support server down below!"
		);

	const supportButton: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Support Server")
				.setEmoji({ name: "⚙️" })
				.setURL("https://discord.gg/NFkMxFeEWr")
		);

	await interaction.reply({
		embeds: [supportEmbed],
		components: [supportButton],
	});
};

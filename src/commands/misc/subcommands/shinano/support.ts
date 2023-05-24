import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const supportEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setDescription(
			"If you encounter any issues pertaining to my services, kindly reach out to my creator through the support server provided below..."
		);

	const supportButton: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Support Server")
				.setEmoji({ name: "⚙️", })
				.setURL("https://discord.gg/NFkMxFeEWr")
		);

	await interaction.reply({
		embeds: [supportEmbed],
		components: [supportButton],
	});
};

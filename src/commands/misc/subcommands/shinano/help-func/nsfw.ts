import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!(interaction.channel as TextChannel).nsfw) 
	{
		const nsfwErrorEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("NSFW Command")
			.setDescription("NSFW commands can only be used in NSFW channels!");
		return interaction.reply({ embeds: [nsfwErrorEmbed], });
	}

	const noNSFW: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Can't see NSFW commands?")
				.setCustomId("NO-NSFW")
		);

	const nsfwHelpEmbed: EmbedBuilder = new EmbedBuilder()
		.setTitle("NSFW Commands")
		.setColor("#2f3136")
		.setDescription(
			"Tip: You can quickly type `/<tag>` or `/<category>` for the commands. E.g `/thighs`, `/irl`\n" +
				"You could also use the **up arrow key** to quickly type in the previous command that you have executed!"
		)
		.setFields(
			{
				name: "Sauce Lookup Command:",
				value: "`sauce`",
			},
			{
				name: "/nsfw anime | H-Animations:",
				value: "`animation`, `animation-bomb`",
			},
			{
				name: "/nsfw anime | Hentai Commands:",
				value:
					"`ass`, `anal`, `bomb`, `fanbox-bomb`, `blowjob`, `boobs`, `cum`, `feet`, `gif`, `nekomimi`, `paizuri`, `pussy`, `random`, `thighs`",
			},
			{
				name: "/nsfw anime | Private Collection (High-Quality):",
				value:
					"`elf`, `fanbox`, `genshin`, `kemonomimi`, `misc`, `shipgirls`, `undies`",
			},
			{
				name: "/nsfw irl | Porn Commands:",
				value:
					"Run `/nsfw irl` for all categories.",
			},
			{
				name: "Doujin",
				value: "`code`, `search`, `random`",
			}
		)
		.setFooter({
			text: "All characters displayed are 18 years old and above.",
		});

	await interaction.reply({
		embeds: [nsfwHelpEmbed],
		components: [noNSFW],
	});
};

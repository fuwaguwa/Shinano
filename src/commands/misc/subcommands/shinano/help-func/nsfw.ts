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
			.setDescription(
				"I apologize, but commands of NSFW nature are exclusively permissible within NSFW-designated channels..."
			);
		return interaction.reply({ embeds: [nsfwErrorEmbed], });
	}

	const nsfwHelpEmbed: EmbedBuilder = new EmbedBuilder()
		.setTitle("NSFW Commands")
		.setColor("#2b2d31")
		.setDescription(
			"Tip: You can quickly type `/<tag>` for the commands. E.g `/thighs`, `/irl`\n" +
				"You could also use the **up arrow key** to quickly type in the previous command that you have executed!"
		)
		.setFields(
			{
				name: "Sauce Lookup Command:",
				value: "`sauce`",
			},
			{
				name: "Searching on Boorus",
				value: "`gelbooru`, `realbooru`, `r34`, `safebooru`",
			},
			{
				name: "H-Animations:",
				value: "`animation`, `animation-bomb`",
			},
			{
				name: "Hentai Commands:",
				value:
					"`autohentai`, `ass`, `anal`, `bomb`, `hquality-bomb`, `blowjob`, `boobs`, `cum`, `feet`, `nekomimi`, `paizuri`, `pussy`, `random`, `thighs`",
			},
			{
				name: "Private Collection (High-Quality):",
				value:
					"`hquality`, `genshin`, `honkai`, `kemonomimi`, `misc`, `shipgirls`, `undies`",
			},
			{
				name: "Porn Commands:",
				value: "Run `/nsfw irl` for all categories.",
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
	});
};

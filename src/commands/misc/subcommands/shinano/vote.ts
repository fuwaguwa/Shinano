import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	if (!interaction.deferred) await interaction.deferReply();

	const voteEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setDescription(
			"You may cast your vote for me down below. I express my gratitude for your unwavering support!\n"
		);

	const links1: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Vote on top.gg")
				.setEmoji({ id: "1002849574517477447", })
				.setURL("https://top.gg/bot/1002193298229829682/vote"),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Check top.gg Vote")
				.setEmoji({ name: "🔍", })
				.setCustomId("VOTE-CHECK")
		);
	const links2: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Vote on discordbotlist.com")
				.setURL("https://discordbotlist.com/bots/shinano/upvote")
				.setEmoji({ name: "🤖", }),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Vote on discordservices.net")
				.setURL("https://discordservices.net/bot/1002193298229829682")
				.setEmoji({ name: "🔨", })
		);

	await interaction.editReply({
		embeds: [voteEmbed],
		components: [links1, links2],
	});
};

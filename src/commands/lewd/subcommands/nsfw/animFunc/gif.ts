import fetch from "node-fetch";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

export = async (
	interaction: ChatInputCommandInteraction,
	category?: string
) => 
{
	const lewdEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("Random")
		.setFooter({
			text: `Requested by ${interaction.user.tag}`,
			iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
		});

	let url;
	if (!category) 
	{
		const response = await fetch(
			"https://Amagi.fuwafuwa08.repl.co/nsfw/public/gif",
			{
				method: "GET",
				headers: {
					Authorization: process.env.amagiApiKey,
				},
			}
		);

		const waifu = await response.json();
		url = waifu.body.link;
	}
	else 
	{
		const response = await fetch(
			`https://Amagi.fuwafuwa08.repl.co/nsfw/private/${category}?type=gif`,
			{
				method: "GET",
				headers: {
					Authorization: process.env.amagiApiKey,
				},
			}
		);

		const waifu = await response.json();
		url = waifu.body.link;
	}

	const imageLink: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(url)
		);
	lewdEmbed.setImage(url);

	return interaction.editReply({
		embeds: [lewdEmbed],
		components: [imageLink],
	});
};

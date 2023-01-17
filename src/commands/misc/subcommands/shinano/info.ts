import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => {
	const APIs = [
		"[AzurAPI](https://github.com/AzurAPI/azurapi-js)",
		"[RapidAPI](https://rapidapi.com/)",
		"The [Cat](https://thecatapi.com/)/[Dog](https://thecatapi.com/) API",
		"[SauceNAO](https://saucenao.com/)",
		"[Some Random API](https://some-random-api.ml/)",
		"[waifu.pics](https://waifu.pics)",
		"[nekos.fun](https://nekos.fun)",
		"[nekos.life](https://nekos.life)",
		"[jikan.moe](https://jikan.moe)",
		"[genshin-db](genshin-db](https://github.com/theBowja/genshin-db)",
	];

	const shinanoEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Shinano")
		.setDescription(
			"The Multi-Purpose Azur Lane/Genshin Bot!\n" +
				"Developed and Maintained by **Fuwafuwa#2272**\n" +
				"Contributor: **LaziestBoy#7543**\n\n" +
				`**APIs**: ${APIs.join(", ")}\n\n` +
				"Liking the bot so far? Please **vote** and leave Shinano a **rating** on **top.gg**!"
		);

	const mainButtons: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "⚙️" })
				.setLabel("Invite Shinano!")
				.setURL(
					"https://discord.com/api/oauth2/authorize?client_id=1002193298229829682&permissions=137439332480&scope=bot%20applications.commands"
				),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "⚙️" })
				.setLabel("Support Server")
				.setURL("https://discord.gg/NFkMxFeEWr")
		);
	const linkButtons: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ id: "1002849574517477447" })
				.setLabel("top.gg")
				.setURL("https://top.gg/bot/1002193298229829682"),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🤖" })
				.setLabel("discordbotlist.com")
				.setURL("https://discord.ly/shinano"),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔨" })
				.setLabel("discordservices.net")
				.setURL("https://discordservices.net/bot/1002193298229829682")
		);

	await interaction.reply({
		embeds: [shinanoEmbed],
		components: [mainButtons, linkButtons],
	});
};

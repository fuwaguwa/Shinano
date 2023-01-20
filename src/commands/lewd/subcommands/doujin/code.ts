import fetch from "node-fetch";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { displayDoujin } from "../../../../lib/Doujin";
import { getNHentaiIP } from "../../../../lib/Utils";

export = async (
	interaction: ChatInputCommandInteraction,
	nuclearLaunchCode?
) => 
{
	const code =
		nuclearLaunchCode || interaction.options.getInteger("doujin-code");
	const nhentaiIP = await getNHentaiIP();

	const response = await fetch(`${nhentaiIP}/api/gallery/${code}`, {
		method: "GET",
	});
	const doujin = await response.json();

	if (doujin.error) 
	{
		const notFound: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | Doujin not found!");
		return interaction.editReply({ embeds: [notFound], });
	}

	await displayDoujin(interaction, doujin);
};

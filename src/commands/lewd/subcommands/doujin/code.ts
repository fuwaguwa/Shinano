import fetch from "node-fetch";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { displayDoujin } from "../../../../lib/Doujin";

export = async (
	interaction: ChatInputCommandInteraction,
	nuclearLaunchCode?
) => 
{
	const code =
		nuclearLaunchCode || interaction.options.getInteger("doujin-code");

	const response = await fetch(`https://amagi.fuwafuwa08.repl.co/doujin/get/?id=${code}`);
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

import { ChatInputCommandInteraction } from "discord.js";
import { queryPrivateImage } from "../../../../lib/Lewdies";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let category = interaction.options.getString("category") || "random";
	const type = interaction.options.getString("type") || "random";
	const bomb = await queryPrivateImage(category, type, 5);

	return interaction.editReply({
		content: bomb.map(item => item.link).join("\n"),
	});
};

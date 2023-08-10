import { ChatInputCommandInteraction } from "discord.js";
import { queryPrivateImage } from "../../../../lib/Lewdies";

export = async (interaction: ChatInputCommandInteraction) => 
{
	let category = interaction.options.getString("category") || "random";
	const bomb = await queryPrivateImage(category, null, 5, true);

	return interaction.editReply({
		content: bomb.map(item => item.link).join("\n"),
	});
};

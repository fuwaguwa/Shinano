import { ChatInputCommandInteraction } from "discord.js";
import gif from "./animFunc/gif";
import video from "./animFunc/video";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const fileType: string =
		interaction.options.getString("type") === "random"
			? ["video", "gif"][Math.floor(Math.random() * 2)]
			: interaction.options.getString("type");
	const category: string =
		interaction.options.getString("category") || "random";
	if (fileType === "video") 
	{
		return video(interaction, category);
	}
	else 
	{
		if (category === "random") return gif(interaction);
		return gif(interaction, category);
	}
};

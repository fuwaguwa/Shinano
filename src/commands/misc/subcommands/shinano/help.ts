import { ChatInputCommandInteraction } from "discord.js";
import nsfw from "./help-func/nsfw";
import sfw from "./help-func/sfw";

export = async (interaction: ChatInputCommandInteraction) => 
{
	switch (interaction.options.getString("command-type")) 
	{
		case "sfw": {
			return sfw(interaction);
		}

		case "nsfw": {
			return nsfw(interaction);
		}
	}
};

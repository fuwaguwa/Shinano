import { ChatInputCommandInteraction } from "discord.js";
import set from "./autohentaiFunc/set";
import stop from "./autohentaiFunc/stop";

export = async (interaction: ChatInputCommandInteraction) => 
{
	switch (interaction.options.getSubcommand()) 
	{
		case "set": {
			return set(interaction);
		}

		case "stop": {
			return stop(interaction);
		}
	}
};

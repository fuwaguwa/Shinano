import { ChatInputCommandInteraction } from "discord.js";
import add from "./blacklist-func/add";
import check from "./blacklist-func/check";
import remove from "./blacklist-func/remove";

export = async (interaction: ChatInputCommandInteraction) => 
{
	switch (interaction.options.getSubcommand()) 
	{
		case "add": {
			return add(interaction);
		}

		case "check": {
			return check(interaction);
		}

		case "remove": {
			return remove(interaction);
		}
	}
};

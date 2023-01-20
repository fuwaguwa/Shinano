import { ChatInputCommandInteraction } from "discord.js";
import guild from "./inspect-func/guild";
import user from "./inspect-func/user";

export = async (interaction: ChatInputCommandInteraction) => 
{
	switch (interaction.options.getSubcommand()) 
	{
		case "guild": {
			return guild(interaction);
		}

		case "user": {
			return user(interaction);
		}
	}
};

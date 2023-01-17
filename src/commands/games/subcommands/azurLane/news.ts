import { ChatInputCommandInteraction } from "discord.js";
import set from "./news-func/set";
import stop from "./news-func/stop";

export = async (interaction: ChatInputCommandInteraction) => {
	switch (interaction.options.getSubcommand()) {
		case "set": {
			return set(interaction);
		}

		case "stop": {
			return stop(interaction);
		}
	}
};

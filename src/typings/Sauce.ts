import {
	ChatInputCommandInteraction,
	MessageContextMenuCommandInteraction
} from "discord.js";

export interface SauceOptions {
	interaction:
		| ChatInputCommandInteraction
		| MessageContextMenuCommandInteraction;
	link: string;
	ephemeral: boolean;
}

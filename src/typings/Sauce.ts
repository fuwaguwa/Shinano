import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	MessageContextMenuCommandInteraction
} from "discord.js";

export interface SauceOptions {
	interaction:
	| ChatInputCommandInteraction
	| MessageContextMenuCommandInteraction
	| ButtonInteraction;
	link: string;
	ephemeral: boolean;
}

export type LoadableNSFWInteraction = ChatInputCommandInteraction | ButtonInteraction;

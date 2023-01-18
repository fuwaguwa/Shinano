import {
	ChatInputApplicationCommandData,
	ChatInputCommandInteraction,
	CommandInteractionOptionResolver,
	EmbedBuilder,
	MessageApplicationCommandData,
	MessageContextMenuCommandInteraction,
	UserApplicationCommandData,
	UserContextMenuCommandInteraction,
} from "discord.js";
import { Shinano } from "../structures/Client";

export type ChatInputCommandCategories =
	| "Anime"
	| "Fun"
	| "AzurLane"
	| "GenshinImpact"
	| "Miscellaneous"
	| "Utilities"
	| "Reactions"
	| "Image"
	| "NSFW"
	| "Dev";

export interface ChatInputCommandCategoryList {
	Anime: EmbedBuilder[];
	Fun: EmbedBuilder[];
	AzurLane: EmbedBuilder[];
	GenshinImpact: EmbedBuilder[];
	Miscellaneous: EmbedBuilder[];
	Utilities: EmbedBuilder[];
	Reactions: EmbedBuilder[];
	Image: EmbedBuilder[];
}

interface ChatInputCommandRunOptions {
	client: Shinano;
	interaction: ChatInputCommandInteraction;
}

interface MessageCommandRunOptions {
	client: Shinano;
	interaction: MessageContextMenuCommandInteraction;
}

interface UserCommandRunOptions {
	client: Shinano;
	interaction: UserContextMenuCommandInteraction;
}

type ChatInputCommandRunFunction = (options: ChatInputCommandRunOptions) => any;

type MessageCommandRunFunction = (options: MessageCommandRunOptions) => any;

type UserCommandRunFunction = (options: UserCommandRunOptions) => any;

export type ChatInputCommandType = {
	cooldown: number;
	nsfw?: boolean;
	ownerOnly?: boolean;
	voteRequired?: boolean;
	category: ChatInputCommandCategories;
	run: ChatInputCommandRunFunction;
} & ChatInputApplicationCommandData;

export type MessageCommandType = {
	cooldown: number;
	run: MessageCommandRunFunction;
} & MessageApplicationCommandData;

export type UserCommandType = {
	cooldown: number;
	run: UserCommandRunFunction;
} & UserApplicationCommandData;

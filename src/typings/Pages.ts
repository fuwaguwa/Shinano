import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	InteractionEditReplyOptions,
	InteractionReplyOptions,
	MessagePayloadOption,
	StringSelectMenuBuilder
} from "discord.js";

export interface ShinanoPaginatorOptions {
	interaction: ChatInputCommandInteraction;
	lastPage?: number;
	pages?: EmbedBuilder[];
	messagePayloads?:
	| MessagePayloadOption[]
	| InteractionReplyOptions[]
	| InteractionEditReplyOptions[];
	menu?: ActionRowBuilder<StringSelectMenuBuilder>;
	interactorOnly: boolean;
	time: number;
}

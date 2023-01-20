import {
	ActionRowBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	StringSelectMenuBuilder
} from "discord.js";

export interface ShinanoPaginatorOptions {
	interaction: ChatInputCommandInteraction;
	lastPage?: number;
	pages: EmbedBuilder[];
	menu?: ActionRowBuilder<StringSelectMenuBuilder>;
	interactorOnly: boolean;
	time: number;
}

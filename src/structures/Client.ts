import glob from "glob";
import mongoose from "mongoose";
import { Event } from "./Event";
import { promisify } from "util";
import {
	ChatInputCommandCategoryList,
	ChatInputCommandType,
	MessageCommandType,
	UserCommandType
} from "../typings/Command";
import { RegisterCommandsOptions } from "../typings/CommandRegistration";
import {
	ApplicationCommandDataResolvable,
	Client,
	ClientEvents,
	Collection,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import { startTweetListener } from "../lib/Twitter";

const promiseGlob = promisify(glob);

export class Shinano extends Client 
{
	commands: Collection<string, ChatInputCommandType> = new Collection();
	messageCommands: Collection<string, MessageCommandType> = new Collection();
	userCommands: Collection<string, UserCommandType> = new Collection();

	catagorizedCommands = {
		Anime: [],
		Fun: [],
		AzurLane: [],
		GenshinImpact: [],
		Miscellaneous: [],
		Utilities: [],
		Reactions: [],
		Image: [],
		Dev: [],
	};

	constructor() 
	{
		super({
			intents: 513,
		});
	}

	start() 
	{
		this.registerModules();
		this.connectToDatabase();
		this.login(process.env.botToken);

		// Error Catcher
		process.on("unhandledRejection", async err => 
		{
			console.error("Unhandled Promise Rejection:\n", err);
		});

		process.on("uncaughtException", async err => 
		{
			console.error("Uncaught Promise Exception:\n", err);
		});

		process.on("uncaughtExceptionMonitor", async err => 
		{
			console.error("Uncaught Promise Exception (Monitor):\n", err);
		});

		process.on("multipleResolves", async (type, promise, reason) => 
		{
			if (!reason) return;
			if (
				reason.toLocaleString() ===
				"Error: Cannot perform IP discovery - socket closed"
			)
				return;
			if (reason.toLocaleString() === "AbortError: The operation was aborted")
				return;

			console.error("Multiple Resolves:\n", type, promise, reason);
		});

		(async () => 
		{
			// Heartbeat
			const guild = await this.guilds.fetch("1002188088942022807");
			const channel = await guild.channels.fetch("1027973574801227776");

			const startEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("Green")
				.setDescription("Shinano has been started!")
				.setTimestamp();
			await (channel as TextChannel).send({ embeds: [startEmbed], });

			let uptime = 300000;
			setInterval(async () => 
			{
				let totalSeconds = uptime / 1000;
				totalSeconds %= 86400;

				let hours = Math.floor(totalSeconds / 3600);
				totalSeconds %= 3600;

				let minutes = Math.floor(totalSeconds / 60);
				let seconds = Math.floor(totalSeconds % 60);

				const heartbeatEmbed: EmbedBuilder = new EmbedBuilder()
					.setColor("Grey")
					.setDescription(
						`Shinano has been running for \`${hours} hours, ${minutes} minutes, ${seconds} seconds\``
					)
					.setTimestamp();
				await (channel as TextChannel).send({ embeds: [heartbeatEmbed], });

				uptime += 300000;
			}, 300000);

			// Azur Lane News
			if (!process.env.guildId) 
			{
				await startTweetListener();
				console.log("Connected to Twitter stream!");
			}
		})();
	}

	private connectToDatabase() 
	{
		mongoose
			.connect(process.env.mongoDB)
			.then(() => 
			{
				console.log("Connected to database!");
			})
			.catch(err => 
			{
				console.log(err);
			});
	}

	private async importFile(filePath: string) 
	{
		return (await import(filePath))?.default;
	}

	private async registerCommands({
		commands,
		guildId,
	}: RegisterCommandsOptions) 
	{
		if (guildId) 
		{
			this.guilds.cache.get(guildId)?.commands.set(commands);
			console.log(`Registering Commands | Guild: ${guildId}`);
		}
		else 
		{
			this.application?.commands.set(commands);
			console.log("Registering Commands | Global");
		}
	}

	public async generateCommandList(): Promise<ChatInputCommandCategoryList> 
	{
		let commandsEmbed: ChatInputCommandCategoryList = {
			Anime: [],
			Fun: [],
			AzurLane: [],
			GenshinImpact: [],
			Miscellaneous: [],
			Utilities: [],
			Reactions: [],
			Image: [],
		};

		for (const category in this.catagorizedCommands) 
		{
			let arr = [];
			const embedArr: EmbedBuilder[] = [];

			if (
				[
					"Image",
					"AzurLane",
					"GenshinImpact",
					"Anime",
					"Miscellaneous"
				].includes(category)
			) 
			{
				this.catagorizedCommands[category].forEach(command => 
				{
					if (!command.options) 
					{
						arr.push(command);
					}
					else 
					{
						command.options.forEach(option => 
						{
							arr.push({
								name: option.name,
								description: option.description,
							});
						});
					}
				});
			}
			else 
			{
				arr = this.catagorizedCommands[category];
			}

			for (let i = 0; i < arr.length; i += 7) 
			{
				const arrChunk = arr.slice(i, i + 7);

				let text: string = "/<command>\n\n";

				switch (category) 
				{
					case "AzurLane":
						text = "/azur-lane <command>\n\n";
						break;
					case "GenshinImpact":
						text = "/genshin <command>\n\n";
						break;
					case "Anime":
						text = "/anime <command>\n\n";
						break;
					case "Miscellaneous":
						text = "/shinano <command>\n\n";
						break;
				}

				for (let i = 0; i < arrChunk.length; i++) 
				{
					const command = arrChunk[i];
					text +=
						`**${command.name}**\n` +
						`<:curve:1021036738161950800>${command.description}\n`;
				}

				embedArr.push(
					new EmbedBuilder().setColor("#2f3136").setDescription(text)
				);
			}

			commandsEmbed[category] = embedArr;
		}
		return commandsEmbed;
	}

	private async registerModules() 
	{
		// Registering Commands
		const shinanoCommands: ApplicationCommandDataResolvable[] = [];

		const commandFiles = await promiseGlob(
			`${__dirname}/../commands/*/*{.ts,.js}`
		);
		const messageFiles = await promiseGlob(
			`${__dirname}/../menu/message/*/*{.ts,.js}`
		);
		const userFiles = await promiseGlob(
			`${__dirname}/../menu/user/*/*{.ts,.js}`
		);

		commandFiles.forEach(async filePath => 
		{
			const command: ChatInputCommandType = await this.importFile(filePath);
			if (!command.name) return;

			if (command.category !== "NSFW" && command.category !== "Dev")
				this.catagorizedCommands[command.category].push(command);

			this.commands.set(command.name, command);
			shinanoCommands.push(command);
		});

		messageFiles.forEach(async filePath => 
		{
			const command: MessageCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.messageCommands.set(command.name, command);
			shinanoCommands.push(command);
		});

		userFiles.forEach(async filePath => 
		{
			const command: UserCommandType = await this.importFile(filePath);
			if (!command.name) return;

			this.userCommands.set(command.name, command);
			shinanoCommands.push(command);
		});

		this.on("ready", () => 
		{
			this.registerCommands({
				commands: shinanoCommands,
				guildId: process.env.guildId,
			});
		});

		// Initiating Event Listeners
		const eventFiles = await promiseGlob(`${__dirname}/../events/*{.ts,.js}`);

		eventFiles.forEach(async filePath => 
		{
			const event: Event<keyof ClientEvents> = await this.importFile(filePath);
			this.on(event.event, event.run);
		});
	}
}

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
import { fetchTweets } from "../lib/News";
import { restartBot } from "../lib/Utils";
import { postLewd } from "../lib/AutoLewd";

const promiseGlob = promisify(glob);

export class Shinano extends Client 
{
	commands: Collection<string, ChatInputCommandType> = new Collection();
	messageCommands: Collection<string, MessageCommandType> = new Collection();
	userCommands: Collection<string, UserCommandType> = new Collection();

	connectedToDatabase: boolean = false;

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
		this.startCatchingErrors();
		this.registerModules();
		this.connectToDatabase();
		this.login(process.env.botToken);

		(async () => 
		{
			await this.startHeartbeatAndLewd();
			await this.startFetchingTweets();
		})();
	}

	private connectToDatabase() 
	{
		mongoose
			.connect(process.env.mongoDB, {
				keepAlive: true,
				keepAliveInitialDelay: 300000,
			})
			.catch((err) => 
			{
				console.log(err);
			});
	}

	private async startFetchingTweets() 
	{
		if (!process.env.guildId) 
		{
			setInterval(async () => 
			{
				await fetchTweets();
			}, 120000);
			console.log("Started tweet checker!");
		}
	}

	private async startHeartbeatAndLewd()
	{
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

			if (!process.env.guildId)
			{
				await postLewd();
			}

			uptime += 300000;
		}, 300000 );

		console.log("Started heartbeat!");
	}

	private startCatchingErrors() 
	{
		process.on("unhandledRejection", async (err: any) => 
		{
			/**
			 * Unknow interaction and unknown message error
			 * Usually caused by connection error in the VPS, haven't found any perma fix yet :(
			 */
			if (
				["DiscordAPIError[10062]", "DiscordAPIError[10008]"].includes(err.name)
			) 
			{
				console.error(err);
				return restartBot();
			}
			console.error("Unhandled Promise Rejection:\n", err);
		});

		process.on("uncaughtException", async (err) => 
		{
			console.error("Uncaught Promise Exception:\n", err);
		});

		process.on("uncaughtExceptionMonitor", async (err) => 
		{
			console.error("Uncaught Promise Exception (Monitor):\n", err);
		});

		mongoose.connection.on("connecting", () => 
		{
			this.connectedToDatabase = true;
			console.log("Connecting to the database...");
		});

		mongoose.connection.on("connected", () => 
		{
			console.log("Connected to the database!");
		});

		mongoose.connection.on("disconnected", () => 
		{
			console.log("Lost database connection...");
			if (this.connectedToDatabase == false) 
			{
				console.log("Attempting to reconnect to the database...");
				this.connectToDatabase();
			}
		});

		mongoose.connection.on("reconnected", () => 
		{
			console.log("Reconnected to the database!");
		});
	}

	private static async importFile(filePath: string) 
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
				this.catagorizedCommands[category].forEach((command) => 
				{
					if (!command.options) 
					{
						arr.push(command);
					}
					else 
					{
						command.options.forEach((option) => 
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

		commandFiles.forEach(async (filePath) => 
		{
			const command: ChatInputCommandType = await Shinano.importFile(filePath);
			if (!command.name) return;

			if (command.category !== "NSFW" && command.category !== "Dev")
				this.catagorizedCommands[command.category].push(command);

			this.commands.set(command.name, command);
			shinanoCommands.push(command);
		});

		messageFiles.forEach(async (filePath) => 
		{
			const command: MessageCommandType = await Shinano.importFile(filePath);
			if (!command.name) return;

			this.messageCommands.set(command.name, command);
			shinanoCommands.push(command);
		});

		userFiles.forEach(async (filePath) => 
		{
			const command: UserCommandType = await Shinano.importFile(filePath);
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

		eventFiles.forEach(async (filePath) => 
		{
			const event: Event<keyof ClientEvents> = await Shinano.importFile(
				filePath
			);
			this.on(event.event, event.run);
		});
	}
}

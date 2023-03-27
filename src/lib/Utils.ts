import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	Guild,
	TextChannel,
	VoiceChannel
} from "discord.js";
import fetch from "node-fetch";
import { client } from "..";
import t2c from "table2canvas";
import { Canvas } from "canvas";
import pm2 from "pm2";

/**
 * Check if a link is a direct image link
 * @param url image url
 * @returns boolean
 */
export function isImage(url) 
{
	return url.match(/^http[^\?]*.(jpg|jpeg|png)(\?(.*))?$/gim) != null;
}

/**
 * Check if a link is a direct image/GIF link
 * @param url image/GIF url
 * @returns boolean
 */
export function isImageAndGif(url) 
{
	return url.match(/^http[^\?]*.(jpg|jpeg|png|gif)(\?(.*))?$/gim) != null;
}

/**
 * Title case a string
 * @param str string to turn into title case
 * @returns title cased str
 */
export function toTitleCase(str: string) 
{
	return str
		.toLowerCase()
		.split(" ")
		.map((word) => 
		{
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

/**
 * Convert time in ms to a HH:MM:SS format
 * @param duration ms
 * @returns HH:MM:SS
 */
export function msToHmsFormat(duration) 
{
	let seconds: string | number = Math.floor((duration / 1000) % 60);
	let minutes: string | number = Math.floor((duration / (1000 * 60)) % 60);
	let hours: string | number = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = hours < 10 ? "0" + hours : hours;
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	return hours + ":" + minutes + ":" + seconds;
}

/**
 * Check if value is a number
 * @param value boolean
 * @returns boolean
 */
export function isNum(value) 
{
	return !isNaN(value);
}

/**
 * it's like printf
 * @param str string
 * @param obj obj
 * @returns formatted string
 */
export function strFormat(str: string, obj: any[]) 
{
	return str.replace(/\{\s*([^}\s]+)\s*\}/g, (m, p1) => 
	{
		return obj[p1];
	});
}

/**
 * Return closest number match in array
 * @param num number
 * @param array array of numbers
 * @returns closest number
 */
export function closest(num: number, array: number[]) 
{
	let curr = array[0];
	for (let i = 0; i < array.length; i++) 
	{
		if (Math.abs(num - array[i]) < Math.abs(num - curr)) 
		{
			curr = array[i];
		}
	}
	return array.indexOf(curr);
}

/**
 * Update server count on bot listings
 */
export async function updateServerCount() 
{
	if (client.user.id === "1002189046619045908") return "Not Main Bot";
	// On Discord Services
	await fetch("https://api.discordservices.net/bot/1002193298229829682/stats", {
		method: "POST",
		headers: {
			Authorization: process.env.discordServicesApiKey,
		},
		body: JSON.stringify({
			servers: client.guilds.cache.size,
		}),
	});

	// On Top.gg
	await fetch("https://top.gg/api/bots/1002193298229829682/stats", {
		method: "POST",
		headers: {
			"content-type": "application/json",
			Authorization: process.env.topggApiKey,
		},
		body: JSON.stringify({
			server_count: client.guilds.cache.size,
		}),
	});

	// On Logging Server
	const guild: Guild = await client.guilds.fetch("1002188088942022807");
	const channel = (await guild.channels.fetch(
		"1017460364658610306"
	)) as VoiceChannel;

	channel.setName(`Server Count: ${client.guilds.cache.size}`);
}

/**
 * Generate a table in canvas
 * @returns message
 */
export async function createTable(options: {
	columns: string[];
	dataSrc: any[];
	columnSize?: number;
	firstColumnSize?: number;
}) 
{
	// Structure
	const tableColumns: any[] = [];
	for (let i = 0; i < options.columns.length; i++) 
	{
		let column = {
			title: options.columns[i],
			dataIndex: options.columns[i],
			textAlign: "center",
			textColor: "rgba(255, 255, 255, 1)",
			titleColor: "rgba(255, 255, 255, 1)",
			titleFontSize: "29px",
			textFontSize: "29px",
		};

		if (i == 1 && options.firstColumnSize) 
		{
			column = Object.assign({ width: options.firstColumnSize, }, column);
		}
		else if (options.columnSize) 
		{
			column = Object.assign({ width: options.columnSize, }, column);
		}

		tableColumns.push(column);
	}

	const table = new t2c({
		canvas: new Canvas(4, 4),
		columns: tableColumns,
		dataSource: options.dataSrc,
		bgColor: "#2f3136",
	});

	// Uploading the image + returning the link
	const guild: Guild = await client.guilds.fetch("1002188088942022807");
	const channel = await guild.channels.fetch("1022191350835331203");

	const statsMessage = await (channel as TextChannel).send({
		files: [
			new AttachmentBuilder(table.canvas.toBuffer(), { name: "image.png", })
		],
	});
	return statsMessage.attachments.first().url;
}

/**
 * Pause for x ms
 * @param ms ms
 */
export function sleep(ms: number) 
{
	let start = new Date().getTime();
	for (let i = 0; i < 1e7; i++) 
	{
		if (new Date().getTime() - start > ms) 
		{
			break;
		}
	}
}

/**
 * Get reaction gif from waifu.pics
 * @param category gif category
 * @returns reaction url
 */
export async function getWaifuReactionGIF(category) 
{
	const response = await fetch(`https://waifu.pics/api/sfw/${category}`, {
		method: "GET",
	});

	const rep = await response.json();

	return rep.url;
}

/**
 * Get reaction gif from nekos.fun
 * @param category gif category
 * @returns reaction url
 */
export async function getNekoReactionGIF(category) 
{
	const response = await fetch(`https://nekos.best/api/v2/${category}`);
	const rep = await response.json();

	return rep.results[0].url;
}

/**
 * Restart process with pm2
 */
export function restartBot() 
{
	pm2.connect((err) => 
	{
		if (err) return console.error(err);

		pm2.restart("Shinano", (err, apps) => 
		{
			if (err) 
			{
				console.error(err);
				return pm2.disconnect();
			}
			return pm2.disconnect();
		});
	});
}

/**
 * Check channel NSFW
 * @param interaction interaction
 */
export async function checkNSFW(
	interaction: ChatInputCommandInteraction | ButtonInteraction
) 
{
	if (!(interaction.channel as TextChannel).nsfw) 
	{
		const nsfwCommand: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setTitle("NSFW Command")
			.setDescription("NSFW commands can only be used in NSFW channels.");
		interaction.deferred
			? await interaction.editReply({ embeds: [nsfwCommand], })
			: await interaction.reply({ embeds: [nsfwCommand], ephemeral: true, });
		return false;
	}

	return true;
}

/**
 * Check if an user is in the Shinano server
 * @param interaction
 * @returns boolean
 */
export async function checkMutual(interaction: ChatInputCommandInteraction) 
{
	if (interaction.user.id !== "836215956346634270") 
	{
		try 
		{
			const guild = await client.guilds.fetch(
				process.env.guildId || "1020960562710052895"
			);
			await guild.members.fetch(interaction.user.id);

			return true;
		}
		catch (err) 
		{
			const exclusive: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setTitle("Exclusive Command!")
				.setDescription(
					"You have used a command exclusive to the members of the Shrine of Shinano server, join the server to use the command anywhere!"
				);
			const button: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().addComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Link)
						.setLabel("Join Server!")
						.setEmoji({ name: "🔗", })
						.setURL("https://discord.gg/NFkMxFeEWr")
				);
			await interaction.editReply({
				embeds: [exclusive],
				components: [button],
			});

			return false;
		}
	}
}

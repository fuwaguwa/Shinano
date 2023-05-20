import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	MessageCreateOptions,
	TextChannel
} from "discord.js";
import News from "../../../../schemas/ALNews";
import { client } from "../../../..";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const url = interaction.options.getString("url");
	const server = url.includes("azurlane_staff") ? "JP" : "EN";
	const messageOptions: MessageCreateOptions = {
		content: `__Shikikans, there's a new message from ${server} HQ!__\n` + url,
	};

	for await (const doc of News.find()) 
	{
		try 
		{
			const guild = await client.guilds.fetch(doc.guildId);
			const channel = await guild.channels.fetch(doc.channelId);

			await (channel as TextChannel).send(messageOptions);
		}
		catch (error) 
		{
			console.warn(error);
			continue;
		}
	}

	const confirmed: EmbedBuilder = new EmbedBuilder()
		.setColor("Green")
		.setDescription("✅ | Sent out tweets to all server!");
	await interaction.editReply({ embeds: [confirmed], });
};

import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Collection,
	EmbedBuilder,
	MessageContextMenuCommandInteraction, TextChannel
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import ms from "ms";
import User from "../schemas/User";
import { MessageCommandType } from "../typings/Command";

const Cooldown: Collection<string, number> = new Collection();
const owner = "836215956346634270";

let EHOSTRetries: number = 0;
function runCommand(
	command: MessageCommandType,
	interaction: MessageContextMenuCommandInteraction
) 
{
	command.run({ client, interaction, }).catch(async (err) => 
	{
		console.error(err);

		if (err.message.includes("EHOSTUNREACH") && EHOSTRetries < 3) 
		{
			EHOSTRetries += 1;
			return runCommand(command, interaction);
		}

		EHOSTRetries = 0;
		const errorEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription(`**${err.name}**: ${err.message}`)
			.setFooter({
				text: "Please use the command again or contact support!",
			});
		const button: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel("Support Server")
					.setEmoji({ name: "⚙️", })
					.setURL("https://discord.gg/NFkMxFeEWr")
			);

		interaction.deferred
			? await interaction.editReply({
				embeds: [errorEmbed],
				components: [button],
			  })
			: await interaction.reply({
				embeds: [errorEmbed],
				components: [button],
			  });
	});
}

export default new Event("interactionCreate", async (interaction) => 
{
	if (!interaction.guild) return;
	if (!interaction.isMessageContextMenuCommand()) return;

	const command = client.messageCommands.get(interaction.commandName);
	if (!command)
		return interaction.reply("You have used a non existent command");

	if (command.cooldown) 
	{
		/**
		 * Cooldown Check
		 */
		if (Cooldown.has(`${command.name}${owner}`))
			Cooldown.delete(`${command.name}${owner}`);

		if (Cooldown.has(`${command.name}${interaction.user.id}`)) 
		{
			const cms = Cooldown.get(`${command.name}${interaction.user.id}`);
			const onChillOut = new EmbedBuilder()
				.setTitle("Slow Down!")
				.setColor("Red")
				.setDescription(
					`You are on a \`${ms(cms - Date.now(), { long: true, })}\` cooldown.`
				);
			return interaction.reply({ embeds: [onChillOut], ephemeral: true, });
		}

		/**
		 * Getting user and blacklist check
		 */
		let user = await User.findOne({ userId: interaction.user.id, });
		if (!user) 
		{
			user = await User.create({
				userId: interaction.user.id,
				commandsExecuted: 0,
			});
		}
		if (user.blacklisted) 
		{
			const blacklisted: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setTitle("You have been blacklisted!")
				.setDescription(
					"Please contact us at the [support server](https://discord.gg/NFkMxFeEWr) for more information about your blacklist."
				);
			return interaction.reply({ embeds: [blacklisted], });
		}

		/**
		 * Executing Command
		 */
		runCommand(command, interaction);
		await user.updateOne({ commandsExecuted: user.commandsExecuted + 1, });

		/**
		 * Applying Cooldown
		 */
		Cooldown.set(
			`${command.name}${interaction.user.id}`,
			Date.now() + command.cooldown
		);
		setTimeout(() => 
		{
			Cooldown.delete(`${command.name}${interaction.user.id}`);
		}, command.cooldown);
	}


	/**
	 * Logging message interaction
	 */
	if (interaction.user.id === owner) return;

	const mainGuild = await client.guilds.fetch("1002188088942022807");
	const commandLogsChannel = await mainGuild.channels.fetch(
		"1092449427068817448"
	);

	const fullCommand = interaction.commandName;
	const commandExecuted: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Command Executed!")
		.setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, }))
		.addFields(
			{ name: "Command Name: ", value: `\`${fullCommand}\``, },
			{
				name: "Guild Name | Guild ID",
				value: `${interaction.guild.name} | ${interaction.guild.id}`,
			},
			{
				name: "Channel Name | Channel ID",
				value: `#${interaction.channel.name} | ${interaction.channel.id}`,
			},
			{
				name: "User | User ID",
				value: `${interaction.user.username}#${interaction.user.discriminator} | ${interaction.user.id}`,
			},
			{
				name: "Message Link",
				value: `https://discord.com/channels/${interaction.guild.id}/${interaction.channelId}/${interaction.targetId}`,
			}
		)
		.setTimestamp();
	await (commandLogsChannel as TextChannel).send({
		embeds: [commandExecuted],
	});
});

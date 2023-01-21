import {
	Collection,
	EmbedBuilder,
	TextChannel,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import User from "../schemas/User";
import ms from "ms";
import { ChatInputCommandType } from "../typings/Command";

const Cooldown: Collection<string, number> = new Collection();
const owner = "836215956346634270";

let EHOSTRetries: number = 0;
function runCommand(
	command: ChatInputCommandType,
	interaction: ChatInputCommandInteraction
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
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
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
		if (user.blacklisted == true) 
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
		 * NSFW Check
		 */
		if (command.nsfw) 
		{
			if (!(interaction.channel as TextChannel).nsfw) 
			{
				const nsfwCommand: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setTitle("NSFW Command")
					.setDescription("NSFW commands can only be used in NSFW channels.");
				return interaction.deferred
					? interaction.editReply({ embeds: [nsfwCommand], })
					: interaction.reply({ embeds: [nsfwCommand], ephemeral: true, });
			}

			/**
			 * Vote Checking
			 */
			if (command.voteRequired) 
			{
				if (
					interaction.user.id !== owner &&
					interaction.guild.id !== "1020960562710052895"
				) 
				{
					const voteEmbed: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setTitle("Hold on...")
						.setImage("https://i.imgur.com/ca5zzXB.png");
					const voteLink: ActionRowBuilder<ButtonBuilder> =
						new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setStyle(ButtonStyle.Link)
								.setLabel("Vote for Shinano!")
								.setEmoji({ id: "1002849574517477447", })
								.setURL("https://top.gg/bot/1002193298229829682/vote"),
							new ButtonBuilder()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Check Vote")
								.setCustomId("VOTE-CHECK")
								.setEmoji({ name: "🔍", })
						);

					if (!user.lastVoteTimestamp) 
					{
						voteEmbed.setDescription(
							"To **use NSFW commands**, you'll have to **vote for Shinano on top.gg** using the button below!\n" +
								"It only takes **a few seconds to vote**, after which you will have access to **premium quality NSFW commands until you are able vote again (12 hours!)**\n\n" +
								"Run the `/support` command if you have any problem with voting!"
						);

						return interaction.deferred
							? interaction.editReply({
								embeds: [voteEmbed],
								components: [voteLink],
							  })
							: interaction.reply({
								embeds: [voteEmbed],
								components: [voteLink],
							  });
					}
					else if (
						Math.floor(Date.now() / 1000) - user.lastVoteTimestamp >
						43200
					) 
					{
						// Voted before but 12 hours has passed
						voteEmbed.setDescription(
							"Your **12 hours** access to NSFW commands ran out!\n" +
								"Please **vote again** if you want to continue using **Shinano's NSFW features**"
						);
						return interaction.deferred
							? interaction.editReply({
								embeds: [voteEmbed],
								components: [voteLink],
							  })
							: interaction.reply({
								embeds: [voteEmbed],
								components: [voteLink],
							  });
					}
				}
			}
		}

		/**
		 * Owner Check
		 */
		if (command.ownerOnly) 
		{
			if (owner !== interaction.user.id) 
			{
				const notForYou: EmbedBuilder = new EmbedBuilder()
					.setColor("Red")
					.setDescription("This command is for owners only!");
				return interaction.deferred
					? interaction.editReply({ embeds: [notForYou], })
					: interaction.reply({ embeds: [notForYou], ephemeral: true, });
			}
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
	 * Logging command execution
	 */
	if (interaction.user.id === owner) return;

	const mainGuild = await client.guilds.fetch("1002188088942022807");
	const commandLogsChannel = await mainGuild.channels.fetch(
		"1002189434797707304"
	);

	let fullCommand = interaction.commandName;
	const options: any = interaction.options;
	if (options._group) fullCommand = fullCommand + " " + options._group;
	if (options._subcommand)
		fullCommand = fullCommand + " " + options._subcommand;
	if (options._hoistedOptions.length > 0) 
	{
		options._hoistedOptions.forEach((option) => 
		{
			option.attachment
				? (fullCommand = `${fullCommand} ${option.name}:${option.attachment.proxyURL}`)
				: (fullCommand = `${fullCommand} ${option.name}:${option.value}`);
		});
	}

	const commandExecuted: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.setTitle("Command Executed!")
		.setThumbnail(interaction.user.displayAvatarURL({ forceStatic: false, }))
		.addFields(
			{ name: "Command Name: ", value: `\`/${fullCommand}\``, },
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
			}
		)
		.setTimestamp();
	await (commandLogsChannel as TextChannel).send({
		embeds: [commandExecuted],
	});
});

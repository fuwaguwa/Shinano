import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	Message,
	User
} from "discord.js";
import { ChatInputCommand } from "../../structures/Command";

function choiceToEmoji(choice) 
{
	switch (choice) 
	{
		case "ROCK":
			return "👊";
		case "PAPER":
			return "🖐️";
		case "SCISSOR":
			return "✌️";
	}
}

async function startDuel(
	interaction: ChatInputCommandInteraction,
	opponent: User,
	message: Message,
	rpsButtons: ActionRowBuilder<ButtonBuilder>
) 
{
	let challengerChoice: string;
	let opponentChoice: string;

	const duel: InteractionCollector<ButtonInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 30000,
		});

	duel.on("collect", async (i) => 
	{
		const choice = i.customId.split("-")[0];
		const challengerId = i.customId.split("-")[1];
		const opponentId = i.customId.split("-")[2];

		/**
		 * Opponent Turn
		 */
		if (!opponentChoice) 
		{
			if (i.user.id !== opponentId) 
			{
				await i.reply({
					content: "This button is not for you!",
					ephemeral: true,
				});
			}
			else 
			{
				await i.deferUpdate();
				opponentChoice = choice;

				const res: EmbedBuilder = new EmbedBuilder()
					.setColor("#2f3136")
					.setDescription(
						`\`${interaction.user.username}\` vs \`${opponent.username}\`\n\n${interaction.user}, make your choice!`
					);

				await i.editReply({
					content: `${interaction.user}`,
					embeds: [res],
					components: [rpsButtons],
				});

				return duel.resetTimer();
			}
		}

		/**
		 * Challenger Turn
		 */
		if (i.user.id !== challengerId) 
		{
			await i.reply({
				content: "This button is not for you!",
				ephemeral: true,
			});
		}
		else 
		{
			await i.deferUpdate();
			challengerChoice = choice;

			const emojiChallengerChoice: string = choiceToEmoji(challengerChoice);
			const emojiOpponentChoice: string = choiceToEmoji(opponentChoice);

			/**
			 * Result
			 */
			const finalResult: EmbedBuilder = new EmbedBuilder().setColor("#2f3136");
			if (challengerChoice === opponentChoice) 
			{
				finalResult.setDescription(
					`\`${interaction.user.username}\` vs \`${opponent.username}\`\n\n` +
						`${opponent.username} picked ${emojiOpponentChoice}\n` +
						`${interaction.user.username} picked ${emojiChallengerChoice}\n` +
						"It's a draw!"
				);
			}
			else 
			{
				if (challengerChoice === opponentChoice) 
				{
					finalResult.setDescription(
						`\`${interaction.user.username}\` vs \`${opponent.username}\`\n\n` +
							`${opponent.username} picked ${emojiOpponentChoice}\n` +
							`${interaction.user.username} picked ${emojiChallengerChoice}\n` +
							"It's a draw!"
					);
				}
				else 
				{
					if (
						(challengerChoice === "ROCK" && opponentChoice === "PAPER") ||
						(challengerChoice === "PAPER" && opponentChoice === "SCISSOR") ||
						(challengerChoice === "SCISSOR" && opponentChoice === "ROCK")
					) 
					{
						finalResult.setDescription(
							`\`${interaction.user.username}\` vs \`${opponent.username}\`\n\n` +
								`${opponent.username} picked ${emojiOpponentChoice}\n` +
								`${interaction.user.username} picked ${emojiChallengerChoice}\n` +
								`${opponent.username} wins!`
						);
					}
					else 
					{
						finalResult.setDescription(
							`\`${interaction.user.username}\` vs \`${opponent.username}\`\n\n` +
								`${opponent.username} picked ${emojiOpponentChoice}\n` +
								`${interaction.user.username} picked ${emojiChallengerChoice}\n` +
								`${interaction.user.username} wins!`
						);
					}
				}

				/**
				 * Disable Buttons
				 */
				for (let i = 0; i < 3; i++) 
				{
					rpsButtons.components[i]
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(true);
				}

				await i.editReply({
					embeds: [finalResult],
					components: [rpsButtons],
				});
			}
		}
	});

	duel.on("end", async (collected, reason) => 
	{
		// Timeout
		if (reason !== "Finished!") 
		{
			await interaction.editReply({
				content: "❌ | No interaction from user, duel ended!",
			});
		}
	});
}

export default new ChatInputCommand({
	name: "rps",
	description: "Play a game of rock paper scissor against someone or the bot!",
	cooldown: 4500,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: "The user you want to play against.",
		}
	],
	run: async ({ interaction, }) => 
	{
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		const user: User = interaction.options.getUser("user");

		if (
			user &&
			user.id !== "1002193298229829682" &&
			user.id !== interaction.user.id
		) 
		{
			await interaction.reply(`<@${user.id}>`);

			/**
			 * Buttons
			 */
			const choiceButtons: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Success)
						.setLabel("Accept")
						.setCustomId(`ACCEPT-${user.id}`)
						.setDisabled(false),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Danger)
						.setLabel("Decline")
						.setCustomId(`DECLINE-${user.id}`)
						.setDisabled(false)
				);
			const rpsButtons: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`ROCK-${interaction.user.id}-${user.id}`)
						.setEmoji({ name: "👊", }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`PAPER-${interaction.user.id}-${user.id}`)
						.setEmoji({ name: "🖐", }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`SCISSOR-${interaction.user.id}-${user.id}`)
						.setEmoji({ name: "✌", })
				);

			/**
			 * Accepting/Declining The Duel
			 */
			const AoDEmbed: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setTitle("⚔ It's Time To D-D-D-DUEL!")
				.setDescription(
					`${user}\n**${interaction.user.username} challenged you to a game of RPS!**\nReact to this message to accept or decline the duel!`
				);

			const message = await interaction.editReply({
				embeds: [AoDEmbed],
				components: [choiceButtons],
			});

			const acceptor: InteractionCollector<ButtonInteraction> =
				await message.createMessageComponentCollector({
					componentType: ComponentType.Button,
					time: 30000,
				});

			acceptor.on("collect", async (i) => 
			{
				const customId = i.customId.split("-")[0];

				if (!i.customId.endsWith(i.user.id)) 
				{
					await i.reply({
						content: "This button is not for you!",
						ephemeral: true,
					});
				}
				else 
				{
					await i.deferUpdate();
					switch (customId) 
					{
						case "ACCEPT": {
							const res: EmbedBuilder = new EmbedBuilder()
								.setColor("#2f3136")
								.setDescription(
									`\`${interaction.user.username}\` vs \`${user.username}\`\n\n${user}, make your choice!`
								);

							await i.editReply({
								content: `${user}`,
								embeds: [res],
								components: [choiceButtons],
							});

							acceptor.stop("ACCEPTED");
							break;
						}

						case "DECLINE": {
							const declined: EmbedBuilder = new EmbedBuilder()
								.setColor("Red")
								.setDescription(`❌ \`${user.username}\` declined the duel!`);

							await i.editReply({
								content: "",
								embeds: [declined],
								components: [],
							});

							acceptor.stop("DECLINED");
							break;
						}
					}
				}
			});

			acceptor.on("end", async (collected, reason) => 
			{
				if (reason !== "ACCEPTED" && reason !== "DECLINED") 
				{
					const timeoutEmbed: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setDescription(`❌ \`${user}\` did not respond!`);
					await interaction.editReply({ embeds: [timeoutEmbed], });
				}
				else if (reason === "ACCEPTED") 
				{
					await startDuel(interaction, user, message, rpsButtons);
				}
			});
		}
		else 
		{
			if (!interaction.deferred) await interaction.deferReply();

			/**
			 * Button
			 */
			const rpsButtons: ActionRowBuilder<ButtonBuilder> =
				new ActionRowBuilder<ButtonBuilder>().setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`ROCK-${interaction.user.id}`)
						.setEmoji({ name: "👊", }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`PAPER-${interaction.user.id}`)
						.setEmoji({ name: "🖐", }),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setDisabled(false)
						.setCustomId(`SCISSOR-${interaction.user.id}`)
						.setEmoji({ name: "✌", })
				);

			/**
			 * Collector
			 */
			const res: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setDescription(
					`\`${interaction.user.username}\` vs \`Shinano\`\n\nMake your choice!`
				);

			const message = await interaction.editReply({
				embeds: [res],
				components: [rpsButtons],
			});

			const collector: InteractionCollector<ButtonInteraction> =
				await message.createMessageComponentCollector({
					componentType: ComponentType.Button,
					time: 30000,
				});

			collector.on("collect", async (i) => 
			{
				const customId = i.customId.split("-")[0];

				if (!i.customId.endsWith(i.user.id)) 
				{
					await i.reply({
						content: "This button is not for you!",
						ephemeral: true,
					});
				}
				else 
				{
					const allChoices = ["ROCK", "PAPER", "SCISSOR"];
					const botChoice =
						allChoices[Math.floor(Math.random() * allChoices.length)];

					const emojiChallengerChoice = choiceToEmoji(customId);
					const convertedBotChoice = choiceToEmoji(botChoice);

					await i.deferUpdate();
					for (let i = 0; i < 3; i++) 
					{
						rpsButtons.components[i].setDisabled(true);
						if (
							customId ===
							rpsButtons.components[i].data["custom_id"].split("-")[0]
						) 
						{
							rpsButtons.components[i].setStyle(ButtonStyle.Success);
						}
						else 
						{
							rpsButtons.components[i].setStyle(ButtonStyle.Secondary);
						}
					}

					if (customId === botChoice) 
					{
						res.setDescription(
							`\`${interaction.user.username}\` vs \`Shinano\`\n\n` +
								` I picked ${convertedBotChoice}\n` +
								`You picked ${emojiChallengerChoice}\n` +
								"It's a draw!"
						);
					}
					else 
					{
						if (
							(customId === "ROCK" && botChoice === "PAPER") ||
							(customId === "PAPER" && botChoice === "SCISSOR") ||
							(customId === "SCISSOR" && botChoice === "ROCK")
						) 
						{
							res.setDescription(
								`\`${interaction.user.username}\` vs \`Shinano\`\n\n` +
									`I picked ${convertedBotChoice}\n` +
									`You picked ${emojiChallengerChoice}\n` +
									"I won!"
							);
						}
						else 
						{
							res.setDescription(
								`\`${interaction.user.username}\` vs \`Shinano\`\n\n` +
									`I picked ${convertedBotChoice}\n` +
									`You picked ${emojiChallengerChoice}\n` +
									"You won!"
							);
						}
					}

					await i.editReply({
						embeds: [res],
						components: [rpsButtons],
					});

					collector.stop("picked");
				}
			});

			collector.on("end", async (collected, reason) => 
			{
				// Timeout
				if (reason !== "picked") 
				{
					for (let i = 0; i < 3; i++) 
					{
						rpsButtons.components[i]
							.setDisabled(true)
							.setStyle(ButtonStyle.Secondary);
					}
					const res: EmbedBuilder = new EmbedBuilder()
						.setColor("#2f3136")
						.setDescription(
							`\`${interaction.user.username}\` vs \`Shinano\`\n\nUser didn't make a choice!`
						);

					await interaction.editReply({
						embeds: [res],
						components: [rpsButtons],
					});
				}
			});
		}
	},
});

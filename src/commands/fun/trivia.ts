import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
} from "discord.js";
import fetch from "node-fetch";
import { ChatInputCommand } from "../../structures/Command";

async function getQuestion(category: string, difficulty: string) {
	// Fetching question and making sure it is under the text limit
	let response = await fetch(
		`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`,
		{ method: "GET" }
	);
	let trivia = await response.json();

	let answers = [
		trivia[0].correctAnswer,
		trivia[0].incorrectAnswers[0],
		trivia[0].incorrectAnswers[1],
		trivia[0].incorrectAnswers[2],
	];

	console.log(`Trivia Answer: ${trivia[0].correctAnswer}`);

	while (
		answers[0].length > 60 ||
		answers[1].length > 60 ||
		answers[2].length > 60 ||
		answers[3].length > 60
	) {
		response = await fetch(
			`https://the-trivia-api.com/api/questions?categories=${category}&limit=1&difficulty=${difficulty}`,
			{ method: "GET" }
		);
		trivia = await response.json();
		console.log(`Trivia Answer: ${trivia[0]["correctAnswer"]}`);

		answers = [
			trivia[0].correctAnswer,
			trivia[0].incorrectAnswers[0],
			trivia[0].incorrectAnswers[1],
			trivia[0].incorrectAnswers[2],
		];
	}

	// Randomizing Answers
	const randchoice = [];
	while (randchoice.length < 4) {
		const r = Math.floor(Math.random() * 4);
		if (randchoice.indexOf(r) === -1) randchoice.push(r);
	}

	return {
		question: trivia[0].question,
		difficulty: trivia[0].difficulty,
		category: trivia[0].category,
		correctAnswer: answers[0],
		answer1: answers[randchoice[0]],
		answer2: answers[randchoice[1]],
		answer3: answers[randchoice[2]],
		answer4: answers[randchoice[3]],
	};
}

export default new ChatInputCommand({
	name: "trivia",
	description: "Trivia Questions!",
	cooldown: 5000,
	category: "Fun",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "category",
			description: "Category of the trivia question.",
			choices: [
				{ name: "Random Category", value: "random" },
				{ name: "Arts and Literature", value: "arts_and_literature" },
				{ name: "Film and TV", value: "film_and_tv" },
				{ name: "Food and Drink", value: "food_and_drink" },
				{ name: "General Knowledge", value: "general_knowledge" },
				{ name: "Geography", value: "geography" },
				{ name: "History", value: "history" },
				{ name: "Music", value: "music" },
				{ name: "Science", value: "science" },
				{ name: "Society and Culture", value: "society_and_culture" },
				{ name: "Sport and Leisure", value: "sport_and_leisure" },
			],
		},
		{
			type: ApplicationCommandOptionType.String,
			required: true,
			name: "difficulty",
			description: "Difficulty of the question.",
			choices: [
				{ name: "Random Difficulty", value: "random" },
				{ name: "Easy", value: "easy" },
				{ name: "Medium", value: "medium" },
				{ name: "Hard", value: "hard" },
			],
		},
	],
	run: async ({ interaction }) => {
		if (!interaction.isChatInputCommand())
			throw new Error("Interaction is not from chat!");

		if (!interaction.deferred) await interaction.deferReply();

		/**
		 * Processing category and difficulty
		 */
		const categoryChoice: string = interaction.options.getString("category");
		const difficultyChoice: string =
			interaction.options.getString("difficulty");

		let category = categoryChoice;
		if (categoryChoice === "random") {
			const all_category = [
				"arts_and_literature",
				"film_and_tv",
				"food_and_drink",
				"general_knowledge",
				"geography",
				"history",
				"music",
				"science",
				"society_and_culture",
				"sport_and_leisure",
			];
			category = all_category[Math.floor(Math.random() * all_category.length)];
		}

		let difficulty = difficultyChoice;
		if (difficultyChoice === "random") {
			const allDiff = ["easy", "medium", "hard"];
			difficulty = allDiff[Math.floor(Math.random() * allDiff.length)];
		}

		const trivia = await getQuestion(category, difficulty);

		/**
		 * Buttons and Embed
		 */
		const answersRow: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.answer1)
					.setCustomId(`${trivia.answer1}-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.answer2)
					.setCustomId(`${trivia.answer2}-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.answer3)
					.setCustomId(`${trivia.answer3}-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Primary)
					.setLabel(trivia.answer4)
					.setCustomId(`${trivia.answer4}-${interaction.user.id}`)
			);

		const question: EmbedBuilder = new EmbedBuilder()
			.setAuthor({
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
				name: `${interaction.user.username}'s Trivia Question:`,
			})
			.setDescription(`${trivia.question}\u200b\n\u200b`)
			.setColor("Random")
			.setFields(
				{
					name: "Difficulty",
					value: `${trivia.difficulty.toUpperCase()}`,
					inline: true,
				},
				{
					name: "Category",
					value: `${trivia.category.toUpperCase()}`,
					inline: true,
				}
			)
			.setFooter({ text: "You have 15s to answer!" });

		/**
		 * Collector
		 */
		const message = await interaction.editReply({
			embeds: [question],
			components: [answersRow],
		});
		const collector = await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 15000,
		});

		collector.on("collect", async (i) => {
			const answer = i.customId.split("-")[0];

			if (!i.customId.endsWith(i.user.id)) {
				await i.reply({
					content: "This button is not for you!",
					ephemeral: true,
				});
			} else {
				await i.deferUpdate();

				if (answer === trivia.correctAnswer) {
					for (let i = 0; i < answersRow.components.length; i++) {
						answersRow.components[i].data["custom_id"].split("-")[0] ===
						trivia.correctAnswer
							? answersRow.components[i]
									.setStyle(ButtonStyle.Success)
									.setDisabled(true)
							: answersRow.components[i]
									.setStyle(ButtonStyle.Secondary)
									.setDisabled(true);
					}

					question.setColor("Green");

					collector.stop("End");

					await i.editReply({
						embeds: [question],
						components: [answersRow],
						content: "You are correct!",
					});
				} else {
					for (let i = 0; i < answersRow.components.length; i++) {
						const btnId: string =
							answersRow.components[i].data["custom_id"].split("-")[0];
						switch (true) {
							case btnId === trivia.correctAnswer: {
								answersRow.components[i]
									.setStyle(ButtonStyle.Success)
									.setDisabled(true);
								break;
							}

							case btnId === answer: {
								answersRow.components[i]
									.setStyle(ButtonStyle.Danger)
									.setDisabled(true);
								break;
							}

							default: {
								answersRow.components[i]
									.setStyle(ButtonStyle.Secondary)
									.setDisabled(true);
								break;
							}
						}
					}

					question.setColor("Red");

					collector.stop("End");

					await i.editReply({
						embeds: [question],
						components: [answersRow],
						content: `That was incorrect, the answer was \`${trivia.correctAnswer}\`.`,
					});
				}
			}
		});

		collector.on("end", async (collected, reason) => {
			// Timed Out
			if (reason && reason !== "End") {
				for (let i = 0; i < 4; i++) {
					const btnId: string =
						answersRow.components[i].data["custom_id"].split("-")[0];

					btnId === trivia.correctAnswer
						? answersRow.components[i].setStyle(ButtonStyle.Success)
						: answersRow.components[i].setStyle(ButtonStyle.Secondary);

					answersRow.components[i].setDisabled(true);
				}

				question.setColor("Red");
				question.setFooter({ text: "Timed out!" });

				await interaction.editReply({
					embeds: [question],
					components: [answersRow],
					content: `Timed out! The answer was \`${trivia.correctAnswer}\`.`,
				});
			}
		});
	},
});

import { ChatInputCommand } from "../../structures/Command";
import Canvas from "canvas";
import {
	ApplicationCommandOptionType,
	AttachmentBuilder,
	EmbedBuilder
} from "discord.js";
import SRA, { CanvasMiscTweetTheme, CanvasMiscOogwayQuoteType } from "somerandomapi.js";

Canvas.registerFont("Upright.otf", { family: "Upright", });

export default new ChatInputCommand({
	name: "image",
	description: "Image Generation & Manipulation Commands",
	cooldown: 7000,
	category: "Image",
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "bronya",
			description: "Bronya's certificate.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "text",
					description: "Text to put on the certificate.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "gay",
			description: "Apply a rainbow filter to an user or yourself.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to turn gay.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "jail",
			description: "Put an user or yourself behind bars.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to put behind bars.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "sigma",
			description: "Sigma Grindset.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "text",
					description: "Sigma Mindset.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "wasted",
			description: "Wasted.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "Wasted user.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "triggered",
			description: "Triggered.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "Triggered user.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "horni-card",
			description: "Grant someone the horni card",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User that will get the card.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "simp-card",
			description: "Give someone the simp card. Shame on them",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User that will get the card.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "namecard",
			description: "Generate a Genshin namecard.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "birthday",
					description: "The birthday to display on the namecard",
				},
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The user on the namecard.",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "signature",
					description: "The signature of the namecard.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "comment",
			description: "Generate a fake picture of a YouTube comment.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "content",
					description: "The content of the comment.",
				},
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The author of the comment.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "tweet",
			description: "Generate a fake tweet.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "display-name",
					description: "Display name of the tweet.",
				},
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "content",
					description: "Content of the tweet.",
				},
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The author of the tweet.",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "replies",
					description: "The number of replies.",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "retweets",
					description: "The number of retweets.",
				},
				{
					type: ApplicationCommandOptionType.Integer,
					name: "likes",
					description: "The number of likes.",
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "theme",
					description: "Theme of the tweet.",
					choices: [
						{ name: "Dark Mode", value: "dark", },
						{ name: "Light Mode", value: "light", }
					],
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "pixelate",
			description: "Make someone avatar looks lewd",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to pixelate.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "border",
			description: "Add a LGBT+ border to someone avatar.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "border-type",
					description: "Border Type.",
					choices: [
						{ name: "LGBT", value: "lgbt", },
						{ name: "Bisexual", value: "bisexual", },
						{ name: "Non-binary", value: "nonbinary", },
						{ name: "Pansexual", value: "pansexual", },
						{ name: "Transgender", value: "transgender", },
						{ name: "Lesbian", value: "lesbian", }
					],
				},
				{
					type: ApplicationCommandOptionType.String,
					name: "user",
					description: "User you want to add the border to.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "jpg",
			description: "Feel the artifacts.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to be jpg-ify.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "heart-crop",
			description: "Crop someone avatar into a heart!",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to be cropped.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "lolice",
			description: "Anti-PDF file gang.",
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "The lolicon police.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "filter",
			description: "Add some color filter to an avatar.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "filter",
					description: "The filter to be added over.",
					choices: [
						{ name: "Blurple", value: "discordBlurpify", },
						{ name: "Sepia", value: "sepia", },
						{ name: "Red", value: "redify", },
						{ name: "Green", value: "greenify", },
						{ name: "Blue", value: "blueify", },
						{ name: "Invert", value: "invert", },
						{ name: "Greyscale", value: "greyscale", },
						{ name: "Invert and Greyscale", value: "invertGreyscale", }
					],
				},
				{
					type: ApplicationCommandOptionType.User,
					name: "user",
					description: "User to add the filter over.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "no",
			description: "No <item>?",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "item",
					description: "Item.",
				}
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "oogway",
			description: "Master Oogway's Wisdom.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					required: true,
					name: "wisdom",
					description: "His wisdom.",
				}
			],
		}
	],
	run: async ({ interaction, }) => 
	{
		const target = interaction.options.getUser("user") || interaction.user;
		const avatar = target.displayAvatarURL({
			size: 512,
			extension: "png",
			forceStatic: false,
		});

		if (!interaction.deferred) await interaction.deferReply();
		let image: Buffer;
		let link: string;

		switch (interaction.options.getSubcommand()) 
		{
			default: {
				link = (
					await SRA.canvas.overlay[interaction.options.getSubcommand()]({
						imgUrl: avatar,
					})
				).imgUrl;
				break;
			}

			case "pixelate": {
				link = (await SRA.canvas.misc.pixelate({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "border": {
				const borderType = interaction.options.getString("border-type");
				link = (await SRA.canvas.misc[borderType]({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "jpg": {
				link = (await SRA.canvas.misc.jpg({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "no": {
				const text: string = interaction.options.getString("item");
				link = (await SRA.canvas.misc.noBitches({ item: text, })).imgUrl;
				break;
			}

			case "heart-crop": {
				link = (await SRA.canvas.misc.heartCrop({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "lolice": {
				link = (await SRA.canvas.misc.lolice({ imgUrl: avatar, })).imgUrl;
				break;
			}
			
			case "filter": {
				const filter = interaction.options.getString("filter");
				link = (await SRA.canvas.filter[filter]({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "oogway": {
				const type = ["1", "2"][Math.floor(Math.random() * 2)];
				const text = interaction.options.getString("wisdom");
				link = (await SRA.canvas.misc.oogwayQuote({ type: type as CanvasMiscOogwayQuoteType, quote: text, })).imgUrl;
				break;
			}

			case "horni-card": {
				link = (await SRA.canvas.misc.hornyCard({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "simp-card": {
				link = (await SRA.canvas.misc.simpCard({ imgUrl: avatar, })).imgUrl;
				break;
			}

			case "bronya": {
				let canvas = Canvas.createCanvas(1547, 1920);
				let context = canvas.getContext("2d");
				let background = await Canvas.loadImage(
					"https://i.imgur.com/EH71R7O.png"
				);

				let applyText = (canvas, text) => 
				{
					const context = canvas.getContext("2d");
					let fontSize = 120;
					do 
					{
						context.font = `${(fontSize -= 5)}px upright`;
					} while (context.measureText(text).width > 847);
					return context.font;
				};

				context.drawImage(background, 0, 0, canvas.width, canvas.height);
				context.font = applyText(canvas, interaction.options.getString("text"));
				context.fillStyle = "#000000";
				context.textAlign = "center";
				context.fillText(
					interaction.options.getString("text"),
					canvas.width / 2 + 5,
					1485
				);

				image = canvas.toBuffer();
				break;
			}

			case "sigma": {
				let canvas = Canvas.createCanvas(750, 750);
				let context = canvas.getContext("2d");

				const sigmaImages = [
					"https://i.imgur.com/G7i9yyS.jpg",
					"https://i.imgur.com/jEFhMKd.png",
					"https://i.imgur.com/MZCirY7.jpg",
					"https://i.imgur.com/6YvbFX5.jpg",
					"https://i.imgur.com/LM9Tpfb.png",
					"https://i.imgur.com/bL1sqcf.png",
					"https://i.imgur.com/DKuRMcU.png"
				];
				let background = await Canvas.loadImage(
					sigmaImages[Math.floor(Math.random() * sigmaImages.length)]
				);

				let applyText = (canvas, text) => 
				{
					const context = canvas.getContext("2d");
					let fontSize = 130;
					do 
					{
						context.font = `${(fontSize -= 5)}px upright`;
					} while (context.measureText(text).width > 720);
					return context.font;
				};

				context.drawImage(background, 0, 0, canvas.width, canvas.height);
				context.font = applyText(canvas, interaction.options.getString("text"));
				context.fillStyle = "#ffffff";
				context.strokeStyle = "#000000";
				context.lineWidth = 3.5;
				context.textAlign = "center";
				context.fillText(
					interaction.options.getString("text"),
					canvas.width / 2,
					canvas.height / 2 + 30
				);
				context.strokeText(
					interaction.options.getString("text"),
					canvas.width / 2,
					canvas.height / 2 + 30
				);

				image = canvas.toBuffer();
				break;
			}

			case "namecard": {
				const birthday = interaction.options.getString("birthday");
				const description = interaction.options.getString("signature");
				const username = target.username;

				if (
					birthday.match(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|[1][0-2])$/i) ==
					null
				) 
				{
					const failed: EmbedBuilder = new EmbedBuilder()
						.setColor("Red")
						.setDescription("❌ | Birthday must be in `DD/MM` format!");
					return interaction.editReply({ embeds: [failed], });
				}

				link = SRA.canvas.misc.genshinNamecard({
					imgUrl: avatar,
					birthday,
					username,
					description,
				}).imgUrl;
				break;
			}

			case "comment": {
				const content = interaction.options.getString("content");
				const username = target.username;

				link = SRA.canvas.misc.youtubeComment({
					username,
					imgUrl: avatar,
					comment: content,
				}).imgUrl;
				break;
			}

			case "tweet": {
				const displayName = interaction.options.getString("display-name");
				const username = target.username.toLowerCase();
				const content = interaction.options.getString("content");
				const replies = interaction.options.getInteger("replies");
				const retweets = interaction.options.getInteger("retweets");
				const likes = interaction.options.getInteger("likes");
				const theme = interaction.options.getString("theme") || "light";

				link = SRA.canvas.misc.tweet({
					displayName,
					username,
					content,
					imgUrl: avatar,
					repliesCount: replies,
					retweetsCount: retweets,
					likesCount: likes,
					theme: theme as CanvasMiscTweetTheme,
				}).imgUrl;
				break;
			}
		}

		if (image) 
		{
			let attachment = new AttachmentBuilder(image, { name: "image.gif", });
			await interaction.editReply({ files: [attachment], });
		}
		else 
		{
			const embed: EmbedBuilder = new EmbedBuilder()
				.setColor("#2f3136")
				.setImage(link);
			await interaction.editReply({ embeds: [embed], });
		}
	},
});

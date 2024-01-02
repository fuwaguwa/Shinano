import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	EmbedBuilder,
	TextChannel
} from "discord.js";
import { Page, Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import Canvas, { createCanvas, loadImage } from "canvas";
import { client } from "../../../..";
import path from "path";
import { toTitleCase } from "../../../../lib/Utils";

puppeteer.use(Stealth());
Canvas.registerFont("QuireSansSemiBold.ttf", { family: "QuireSans", });

export = async (interaction: ChatInputCommandInteraction, AL: any) => 
{
	const wait: EmbedBuilder = new EmbedBuilder()
		.setTitle("Processing...")
		.setColor("Green")
		.setDescription(
			"<a:lod:1021265223707000923> | Validating Ship...\n" +
				"<a:lod:1021265223707000923> | Fetching Build...\n" +
				"<a:lod:1021265223707000923> | Processing Gear Images...\n" +
				"<a:lod:1021265223707000923> | Creating Infographic...\n"
		);
	await interaction.editReply({ embeds: [wait], });

	const shipName: string = interaction.options.getString("ship-name");
	const shipInfo = await AL.ships.get(shipName);
	let name: string;
	let validationResponse: string;

	if (shipInfo) 
	{
		name = shipInfo.names.en;
		validationResponse = "✅ | Valid Ship!\n";
	}
	else 
	{
		name = shipName;
		validationResponse =
			"❓ | Ship not found in database, looking up ship build regardless, make sure you spell their name **fully and correctly**!\n";
	}

	wait.setDescription(
		validationResponse +
			"<a:lod:1021265223707000923> | Fetching Build...\n" +
			"<a:lod:1021265223707000923> | Processing Gear Images...\n" +
			"<a:lod:1021265223707000923> | Creating Infographic...\n"
	);
	await interaction.editReply({ embeds: [wait], });

	const slot = [];
	const gears = [];

	name = name.toLowerCase().split(" ").join("_").replace("μ", "%C2%B5");
	const link = `https://slaimuda.github.io/ectl/#/home?ship=${name}`;

	/**
	 * Fetching data and generate image
	 */
	const browser: Browser = await puppeteer.launch({
		headless: "new",
		args: ["--no-sandbox"],
	});
	const page: Page = await browser.newPage();

	await page.goto(link);
	await page.waitForSelector(".col-4.col-sm-4.col-md-2");

	const containerDivs = await page.$$(
		".modal-body > div:nth-child(1) > div:nth-child(1)"
	);

	if (!containerDivs || containerDivs.length == 0) 
	{
		wait.setDescription(
			validationResponse +
				"❌ | Build not found, please make sure you spell the ship name right!\n" +
				"❌ | Failed to process gear images...\n" +
				"❌ | Failed to create infographic\n"
		);
		return interaction.editReply({ embeds: [wait], });
	}

	wait.setDescription(
		validationResponse +
			"✅ | Build Fetched!\n" +
			"<a:lod:1021265223707000923> | Processing Gear Images...\n" +
			"<a:lod:1021265223707000923> | Creating Infographic...\n"
	);
	await interaction.editReply({ embeds: [wait], });

	for (const containerDiv of containerDivs) 
	{
		const cols = await containerDiv.$$(".col-4.col-sm-4.col-md-2");

		const canvas = createCanvas(50, 50);
		const ctx = canvas.getContext("2d");

		for (const col of cols) 
		{
			const h6Text = await col.evaluate((element) => 
			{
				const h6Element = element.querySelector("h6");
				return h6Element.textContent.trim();
			});
			slot.push(h6Text);

			const images = await col.$$("img");
			const gearSrc = [];

			for (const image of images) 
			{
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				const imageSrc = await image.evaluate(elm => elm.src);
				const imageClass = await image.evaluate(elm => elm.className);
				const imageData = imageSrc.startsWith("data:image")
					? Buffer.from(
						imageSrc.replace(/^data:image\/\w+;base64,/, ""),
						"base64"
					  )
					: imageSrc;

				let fillStyle;

				switch (true) 
				{
					case imageClass.includes("rarity-ultra-rare"): {
						const gradient = ctx.createLinearGradient(
							0,
							0,
							Math.cos(Math.PI / 3) * 100,
							Math.sin(Math.PI / 3) * 100
						);
						gradient.addColorStop(0, "#fbffca");
						gradient.addColorStop(0.25, "#baffbf");
						gradient.addColorStop(0.5, "#a7efff");
						gradient.addColorStop(1, "#ffabff");

						fillStyle = gradient;
						break;
					}

					case imageClass.includes("rarity-super-rare"): {
						fillStyle = "#ee9";
						break;
					}

					case imageClass.includes("rarity-elite"): {
						fillStyle = "#c4adff";
						break;
					}

					case imageClass.includes("rarity-rare"): {
						fillStyle = "#9fe8ff";
						break;
					}
				}

				ctx.fillStyle = fillStyle;
				ctx.fillRect(0, 0, 50, 50);

				const cImage = await loadImage(imageData);
				const aspectRatio = cImage.width / cImage.height;
				let drawWidth = cImage.width;
				let drawHeight = cImage.height;
				let drawX = 0;
				let drawY = 0;

				if (cImage.width > 50 || cImage.height > 50) 
				{
					if (aspectRatio > 1) 
					{
						drawWidth = 50;
						drawHeight = drawWidth / aspectRatio;
						drawY = (50 - drawHeight) / 2;
					}
					else 
					{
						drawHeight = 50;
						drawWidth = drawHeight * aspectRatio;
						drawX = (50 - drawWidth) / 2;
					}
				}
				else 
				{
					drawX = (50 - drawWidth) / 2;
					drawY = (50 - drawHeight) / 2;
				}

				ctx.drawImage(cImage, drawX, drawY, drawWidth, drawHeight);
				gearSrc.push(canvas.toBuffer());
			}

			gears.push(gearSrc);
		}
	}

	await browser.close();

	wait.setDescription(
		validationResponse +
			"✅ | Build Fetched!\n" +
			"✅ | Processed Gear Images!\n" +
			"<a:lod:1021265223707000923> | Creating Infographic...\n"
	);
	await interaction.editReply({ embeds: [wait], });

	/**
	 * Create build image
	 */
	const shipImage = await loadImage(
		shipInfo
			? shipInfo.skins[0].image
			: "https://media.discordapp.net/attachments/1110132419484454935/1191690824422015037/Manjuu_logo1.png"
	);
	const bgImage = await loadImage(
		path.join(__dirname, "..", "..", "..", "..", "..", "data", "buildBG.png")
	);

	const canvas = await createCanvas(1280, 720);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(bgImage, 0, 0);

	// Adding ship image
	const rectangleWidth = canvas.width * 0.57;
	const rectangleHeight = canvas.height;

	const partWidth = Math.round(canvas.width - rectangleWidth);
	const partHeight = canvas.height;

	let resizedHeight = canvas.height;
	let resizedWidth = Math.floor(
		resizedHeight * (shipImage.width / shipImage.height)
	);

	if (shipImage.height - canvas.height >= 1500) 
	{
		resizedHeight = Math.round(canvas.height * 1.5);
		resizedWidth = Math.floor(
			resizedHeight * (shipImage.width / shipImage.height)
		);
	}

	const imageX = Math.floor((partWidth - resizedWidth) / 2);
	const imageY = Math.floor((partHeight - resizedHeight) / 2);

	ctx.drawImage(
		shipImage,
		rectangleWidth + imageX,
		imageY,
		resizedWidth,
		resizedHeight
	);

	ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
	ctx.fillRect(0, 0, rectangleWidth, rectangleHeight);

	// Setting Text
	let fontSize = 30;
	const textX = 20;
	const textY = 25 + fontSize;

	const text = shipInfo ? shipInfo.names.code : toTitleCase(name);
	ctx.font = `${fontSize}px QuireSans`;
	ctx.fillStyle = "white";
	ctx.fillText(text, textX, textY);

	// Adding gear images
	let rowX = 150;
	let rowY = 85;

	let tX = 20;
	let tY = rowY + 25;

	const imageGap = 5;

	fontSize = 15;
	ctx.font = `${fontSize}px QuireSans`;
	for (let i = 0; i < gears.length; i++) 
	{
		if (i >= 1) 
		{
			// Extra pixels to make the rows look more seperated
			rowY += 3;
		}

		const buffers = gears[i];

		let imagesInRow = 0;

		for (let j = 0; j < buffers.length; j++) 
		{
			const buffer = buffers[j];
			const image = await loadImage(buffer);

			const imageX = rowX + imagesInRow * (image.width + imageGap);
			const imageY = rowY + i * (image.height + imageGap);

			if (i > 0 && j == 0) tY = imageY + 28;

			ctx.drawImage(image, imageX, imageY);
			imagesInRow++;

			if (imagesInRow >= 10 && j != buffers.length - 1) 
			{
				imagesInRow = 0;
				rowY += image.height + imageGap;
			}
		}

		// Text Processing
		let gearName: string;

		switch (true) 
		{
			case slot[i].includes("(Dev.30)") || slot[i].includes("(Dev.10)"): {
				gearName = slot[i]
					.split("/")
					.join(".\n")
					.replace(/\(Dev\.(30|10)\)/i, "");
				break;
			}

			case slot[i].includes("(LB"): {
				gearName = "Aircraft (Any Type)";
				break;
			}

			case slot[i].includes("Submarine Torpedoes"): {
				gearName = "Submarine Torps.";
				break;
			}

			default: {
				gearName = slot[i];
				break;
			}
		}

		ctx.fillText(gearName, tX, tY);
	}

	const guild = await client.guilds.fetch("1002188088942022807");
	const channel = await guild.channels.fetch("1022191350835331203");

	const message = await (channel as TextChannel).send({
		files: [new AttachmentBuilder(canvas.toBuffer(), { name: "image.png", })],
	});

	const img = message.attachments.first().url;

	const buildEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setTitle(
			`${
				shipInfo
					? `${shipInfo.names.en} | ${shipInfo.names.code}`
					: toTitleCase(name)
			}`
		)
		.setDescription(`[Overview of the Ship & Gears Explanation](${link})`)
		.setImage(img)
		.setFooter({
			text: "Community TL @ https://slaimuda.github.io/ectl/#/home",
		});
	if (shipInfo) buildEmbed.setURL(shipInfo.wikiUrl);
	await interaction.editReply({ embeds: [buildEmbed], });
};

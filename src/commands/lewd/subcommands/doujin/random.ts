import { ChatInputCommandInteraction } from "discord.js";
import { displayDoujin, getDoujinTags } from "../../../../lib/Doujin";
import { getNHentaiIP } from "../../../../lib/Utils";

async function getRandomDoujin(nhentaiIP) {
	const randomCode = Math.floor(Math.random() * 400000);
	const response = await fetch(`${nhentaiIP}/api/gallery/${randomCode}`, {
		method: "GET",
	});
	return await response.json();
}

async function filterTag(doujin) {
	const tagInfo = getDoujinTags(doujin);
	const filter = tagInfo.tags.find((tag) => {
		return (
			tag.includes("Lolicon") ||
			tag.includes("Guro") ||
			tag.includes("Scat") ||
			tag.includes("Insect") ||
			tag.includes("Shotacon") ||
			tag.includes("Amputee") ||
			tag.includes("Vomit") ||
			tag.includes("Vore")
		);
	});

	return filter;
}

export = async (interaction: ChatInputCommandInteraction) => {
	const nhentaiIP = await getNHentaiIP();
	let doujin = await getRandomDoujin(nhentaiIP);

	while (filterTag(doujin)) doujin = await getRandomDoujin(nhentaiIP);

	await displayDoujin(interaction, doujin);
};

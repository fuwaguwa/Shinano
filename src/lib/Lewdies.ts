import Image from "../schemas/Image";
import akaneko from "akaneko";
import fetch from "node-fetch";

export async function queryPrivateImage(
	imageCategory?,
	imageFormat?,
	size?,
	fanbox?
) 
{
	if (imageCategory === "random") 
	{
		if (
			!["gif", "mp4"].includes(imageFormat) &&
			!fanbox &&
			![undefined, "animation", "random"].includes(imageCategory)
		)
			return queryRandom(size);
	}

	switch (true) 
	{
		case fanbox == true: {
			let match = { fanbox: true, };
			if (imageCategory !== "random")
				match = Object.assign(match, { category: imageCategory, });

			const result = await Image.aggregate([
				{ $match: match, },
				{ $sample: { size: size || 1, }, }
			]);

			return result.length > 1 ? result : result[0];
		}

		default: {
			let result;

			if (imageFormat === "animation") 
			{
				const formatType = ["gif", "mp4"];

				let match = { format: { $in: formatType, }, };
				if (imageCategory !== "random")
					match = Object.assign(match, { category: imageCategory, });

				result = await Image.aggregate([
					{ $match: match, },
					{ $sample: { size: size || 1, }, }
				]);
			}
			else if (imageFormat === "random" || imageFormat == undefined) 
			{
				const aggregate: any = [{ $sample: { size: size || 1, }, }];
				if (imageCategory !== "random")
					aggregate.unshift({ $match: { category: imageCategory, }, });

				result = await Image.aggregate(aggregate);
			}
			else 
			{
				let match = { format: imageFormat, };
				if (imageCategory !== "random")
					match = Object.assign(match, { category: imageCategory, });

				result = await Image.aggregate([
					{ $match: match, },
					{ $sample: { size: size || 1, }, }
				]);
			}
			return result.length > 1 ? result : result[0];
		}
	}
}

export async function queryRandom(size) 
{
	const content = await Image.aggregate([{ $sample: { size: size || 1, }, }]);
	return size > 1 ? content : content[0];
}

export async function queryDefault(tag): Promise<string> 
{
	let link: string;
	switch (tag) 
	{
		case "nekomimi": {
			const response = await fetch("https://api.waifu.pics/nsfw/neko");
			const neko = await response.json();

			link = neko.url;
			break;
		}

		case "anal": {
			const response = await fetch("https://hmtai.hatsunia.cfd/v2/anal");
			const json = await response.json();

			link = json.url;
			break;
		}

		case "paizuri": {
			const response = await fetch("https://hmtai.hatsunia.cfd/v2/boobjob");
			const json = await response.json();

			link = json.url;

			break;
		}

		case "gif": {
			if ([1, 2][Math.floor(Math.random() * 2)] == 1) 
			{
				const requestHentai = async () => 
				{
					const choice = ["cum", "anal", "blowjob", "paizuri"];
					const botChoice = choice[Math.floor(Math.random() * choice.length)];
					
					const response = await fetch(`https://hmtai.hatsunia.cfd/v2/${botChoice}`);
					const json = await response.json();

					return json.url;
				};

				let image = await requestHentai();
				while (!(image as string).endsWith("gif"))
					image = await requestHentai();

				link = image;
			}
			else 
			{
				link = (await queryPrivateImage("random", "gif")).link;
			}

			break;
		}

		default: {
			link = await akaneko.nsfw[tag]();
			break;
		}
	}

	return link;
}

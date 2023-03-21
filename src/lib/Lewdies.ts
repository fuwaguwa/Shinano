import Image from "../schemas/Image";

const privateGifTags = [
	"shipgirls",
	"undies",
	"genshin",
	"kemonomimi",
	"misc",
	"uniform"
];

export async function queryPrivateImage(
	imageCategory?,
	imageFormat?,
	size?,
	fanbox?
) 
{
	if (imageCategory === "random") 
	{
		if (!["gif", "mp4"].includes(imageFormat) && !fanbox)
			return queryRandom(size);
		imageCategory =
			privateGifTags[Math.floor(Math.random() * privateGifTags.length)];
	}

	switch (true) 
	{
		case fanbox == true: {
			const result = await Image.aggregate([
				{ $match: { category: imageCategory, fanbox: true, }, },
				{ $sample: { size: size || 1, }, }
			]);

			return result.length > 1 ? result : result[0];
		}

		case imageFormat != undefined: {
			const result = await Image.aggregate([
				{ $match: { category: imageCategory, format: imageFormat, }, },
				{ $sample: { size: size || 1, }, }
			]);

			return result.length > 1 ? result : result[0];
		}

		default: {
			const result = await Image.aggregate([
				{ $match: { category: imageCategory, }, },
				{ $sample: { size: size || 5, }, }
			]);

			return result.length > 1 ? result : result[0];
		}
	}
}

export async function queryRandom(size) 
{
	const content = await Image.aggregate([{ $sample: { size: size || 1, }, }]);
	return size > 1 ? content : content[0];
}

import Image from "../schemas/Image";

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
				const aggregate: any = [{ $sample: { size: size || 5, }, }];
				if (imageCategory !== "random")
					aggregate.push({ $match: { category: imageCategory, }, });

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

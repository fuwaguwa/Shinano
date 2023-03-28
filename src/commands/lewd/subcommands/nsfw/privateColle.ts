import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	InteractionCollector,
	Message
} from "discord.js";
import { LoadableNSFWInteraction } from "../../../../typings/Sauce";
import nsfwSubs from "../nsfwSubs";
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import Image from "../../../../schemas/Image";

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	category: string,
	mode?: string
) => 
{
	let image;

	if (category === "random") 
	{
		image = (await Image.aggregate([{ $sample: { size: 1, }, }]))[0];
	}
	else 
	{
		image = (
			await Image.aggregate([
				{ $match: { category: category, }, },
				{ $sample: { size: 1, }, }
			])
		)[0];
	}

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	let message: Message;
	let imageInfo: ActionRowBuilder<ButtonBuilder>;

	if (!(image.link as string).endsWith("mp4")) 
	{
		lewdEmbed.setImage(image.link).setColor("Random");

		imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(image.link),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setEmoji({ name: "🔍", })
				.setLabel("Get Sauce")
				.setCustomId("SAUCE")
		);

		message =
			mode === "followUp"
				? await interaction.followUp({
					embeds: [lewdEmbed],
					components: [imageInfo, load],
				  })
				: await interaction.editReply({
					embeds: [lewdEmbed],
					components: [imageInfo, load],
				  });
	}
	else 
	{
		message =
			mode === "followUp"
				? await interaction.followUp({
					content: image.link,
					components: [load],
				  })
				: await interaction.editReply({
					content: image.link,
					components: [load],
				  });
	}

	const collector: InteractionCollector<ButtonInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 40000,
		});

	collector.on("collect", async (i) => 
	{
		if (!i.customId.endsWith(i.user.id)) 
		{
			await i.reply({
				content: "This button is not for you!",
				ephemeral: true,
			});
		}
		else 
		{
			if (await cooldownCheck("LMORE", i)) return;

			await i.deferUpdate();

			load.components[0].setDisabled(true);
			await message.edit({
				components: imageInfo ? [imageInfo, load] : [load],
			});

			await nsfwSubs.privateColle(i, lewdEmbed, category, "followUp");

			setCooldown("LMORE", i);

			return collector.stop("done");
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		if (reason !== "done") 
		{
			load.components[0].setDisabled(true);
			await message.edit({
				components: imageInfo ? [imageInfo, load] : [load],
			});
		}
	});
};

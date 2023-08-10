import {
	ActionRowBuilder,
	ButtonStyle,
	EmbedBuilder,
	ButtonBuilder,
	Message,
	InteractionCollector,
	ButtonInteraction,
	ComponentType
} from "discord.js";
import { LoadableNSFWInteraction } from "../../../../typings/Sauce";
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import nsfwSubs from "../nsfwSubs";
import Image from "../../../../schemas/Image";
import { collectors } from "../../../../events/cmdInteraction";

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	tag: string,
	mode?: string
) => 
{
	const item = (
		await Image.aggregate([
			{ $match: { category: tag, fanbox: true, }, },
			{ $sample: { size: 1, }, }
		])
	)[0];

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	lewdEmbed.setImage(item.link).setColor("Random");
	const imageLink: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setEmoji({ name: "🔗", })
				.setLabel("Image Link")
				.setURL(item.link)
		);

	const message: Message =
		mode === "followUp"
			? await interaction.followUp({
				embeds: [lewdEmbed],
				components: [imageLink, load],
			  })
			: await interaction.editReply({
				embeds: [lewdEmbed],
				components: [imageLink, load],
			  });

	const collector: InteractionCollector<ButtonInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 40000,
		});

	collectors.set(interaction.user.id, collector);

	collector.on("collect", async (i) => 
	{
		if (!i.customId.endsWith(i.user.id)) 
		{
			await i.reply({
				content: "\"This button does not pertain to you!\"",
				ephemeral: true,
			});
		}
		else if (i.customId.includes("LMORE")) 
		{
			if (await cooldownCheck("LMORE", i)) return;

			await i.deferUpdate();

			load.components[0].setDisabled(true);
			await message.edit({ components: [imageLink, load], });

			await nsfwSubs.hquality(i, lewdEmbed, tag, "followUp");

			setCooldown("LMORE", i);

			return collector.stop("done");
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		if (reason !== "done") 
		{
			load.components[0].setDisabled(true);
			await message.edit({ components: [load], });
		}
	});
};

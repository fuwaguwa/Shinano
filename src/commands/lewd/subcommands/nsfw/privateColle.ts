import Collection from "../../../../schemas/PrivateCollection";
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

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	category: string,
	mode?: string
) => 
{
	if (category === "random") 
	{
		const allCategories = [
			"elf",
			"genshin",
			"misc",
			"shipgirls",
			"undies",
			"uniform",
			"kemonomimi"
		];

		category = allCategories[Math.floor(Math.random() * allCategories.length)];
	}

	const data = await Collection.findOne({ type: category, });
	const image = data.links[Math.floor(Math.random() * data.size)];

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
		lewdEmbed.setImage(image.link);

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
			time: 25000,
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
			await message.edit({ components: imageInfo ? [imageInfo, load] : [load], });

			await nsfwSubs.privateColle(i, lewdEmbed, category, "followUp");

			setCooldown("LMORE", i);

			return collector.stop();
		}
	});
};

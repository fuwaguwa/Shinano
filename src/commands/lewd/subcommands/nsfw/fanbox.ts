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
import Collection from "../../../../schemas/PrivateCollection";
import { LoadableNSFWInteraction } from "../../../../typings/Sauce";
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import nsfwSubs from "../nsfwSubs";

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	tag: string,
	mode?: string
) => 
{
	const data = await Collection.findOne({ type: tag, });
	const response = data.links.filter(item => item.link.includes("_FANBOX"));
	const item = response[Math.floor(Math.random() * response.length)];

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	lewdEmbed.setImage(item.link);
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
			await nsfwSubs.fanbox(i, lewdEmbed, tag, "followUp");

			setCooldown("LMORE", i);

			return collector.stop();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		load.components[0].setDisabled(true);
		await message.edit({ components: [imageLink, load], });
	});
};

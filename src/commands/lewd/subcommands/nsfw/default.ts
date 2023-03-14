import { LoadableNSFWInteraction } from "../../../../typings/Sauce";
import fetch from "node-fetch";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle, ComponentType,
	EmbedBuilder,
	InteractionCollector,
	Message
} from "discord.js";
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import nsfwSubs from "../nsfwSubs";

export = async (interaction: LoadableNSFWInteraction, lewdEmbed: EmbedBuilder, tag: string, mode?: string) => 
{
	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/public/${tag}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);
	const waifu = await response.json();
	lewdEmbed.setImage(waifu.body.link);

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);
	const imageInfo = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setStyle(ButtonStyle.Link)
			.setEmoji({ name: "🔗", })
			.setLabel("Image Link")
			.setURL(waifu.body.link),
		new ButtonBuilder()
			.setStyle(ButtonStyle.Secondary)
			.setEmoji({ name: "🔍", })
			.setLabel("Get Sauce")
			.setCustomId("SAUCE")
	);

	const message: Message = mode === "followUp"
		? await interaction.followUp({
			embeds: [lewdEmbed],
			components: [imageInfo, load],
		})
		: await interaction.editReply({
			embeds: [lewdEmbed],
			components: [imageInfo, load],
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
			await nsfwSubs.def(i, lewdEmbed, tag, "followUp");

			setCooldown("LMORE", i);

			return collector.stop();
		}
	});

	collector.on("end", async (collected, reason) =>
	{
		load.components[0].setDisabled(true);
		await message.edit({ components: [imageInfo, load], });
	});

}
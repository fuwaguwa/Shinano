import { LoadableNSFWInteraction } from "../../../../typings/Sauce";
import fetch from "node-fetch";
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
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import nsfwSubs from "../nsfwSubs";

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	tag: string,
	mode?: string
) => 
{
	const response = await fetch(
		`https://Amagi.fuwafuwa08.repl.co/nsfw/porn/${tag}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.amagiApiKey,
			},
		}
	);
	const result = await response.json();

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	let message: Message;

	if (
		(result.body.link as string).includes("redgifs") ||
		(result.body.link as string).includes(".gifv")
	) 
	{
		message =
			mode === "followUp"
				? await interaction.followUp({
					content: result.body.link,
					components: [load],
				  })
				: await interaction.editReply({
					content: result.body.link,
					components: [load],
				  });
	}
	else 
	{
		lewdEmbed.setImage(result.body.link).setColor("Random");
		message =
			mode === "followUp"
				? await interaction.followUp({
					embeds: [lewdEmbed],
					components: [load],
				  })
				: await interaction.editReply({
					embeds: [lewdEmbed],
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
			await message.edit({ components: [load], });

			await nsfwSubs.irl(i, lewdEmbed, tag, "followUp");

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

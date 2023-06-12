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
import { collectors } from "../../../../events/cmdInteraction";

const allTags = [
	"thigh",
	"ass",
	"anal",
	"blowjob",
	"boobs",
	"feet",
	"gonewild",
	"pussy"
];

export = async (
	interaction: LoadableNSFWInteraction,
	lewdEmbed: EmbedBuilder,
	tag: string,
	mode?: string
) => 
{
	// Fetching
	if (tag === "random")
		tag = allTags[Math.floor(Math.random() * allTags.length)];
	const response = await fetch(`https://nekobot.xyz/api/image?type=${tag}`);
	const result = await response.json();

	if (!result.success) throw new Error("Fetch failed!");

	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	lewdEmbed.setImage(result.message).setColor("Random");
	const message: Message =
		mode === "followUp"
			? await interaction.followUp({
				embeds: [lewdEmbed],
				components: [load],
			  })
			: await interaction.editReply({
				embeds: [lewdEmbed],
				components: [load],
			  });

	// Load More
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

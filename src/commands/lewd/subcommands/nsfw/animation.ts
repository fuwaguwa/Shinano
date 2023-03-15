import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	InteractionCollector,
	Message
} from "discord.js";
import gif from "./animFunc/gif";
import video from "./animFunc/video";
import { cooldownCheck, setCooldown } from "../../../../events/btnInteraction";
import nsfwSubs from "../nsfwSubs";
import { LoadableNSFWInteraction } from "../../../../typings/Sauce";

export = async (
	interaction: LoadableNSFWInteraction,
	fileType: string,
	category: string,
	mode?: string
) => 
{
	let message: Message;
	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	if (fileType === "video") 
	{
		message = await video(interaction, category, load, mode);
	}
	else 
	{
		if (category === "random") 
		{
			message = await gif(interaction, load, null, mode);
		}
		else 
		{
			message = await gif(interaction, load, category, mode);
		}
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

			const components = [];
			if (message.components[0].components[0].data["url"]) 
			{
				components.push(
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Link)
							.setEmoji({ name: "🔗", })
							.setLabel("Image Link")
							.setURL(message.components[0].components[0].data["url"])
					)
				);
			}

			components.push(load);

			await message.edit({ components: components, });

			await nsfwSubs.animation(i, fileType, category, "followUp");

			setCooldown("LMORE", i);

			return collector.stop();
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		if (reason !== "done") 
		{
			load.components[0].setDisabled(true);

			const components = [];
			if (message.components[0].components[0].data["url"]) 
			{
				components.push(
					new ActionRowBuilder<ButtonBuilder>().addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Link)
							.setEmoji({ name: "🔗", })
							.setLabel("Image Link")
							.setURL(message.components[0].components[0].data["url"])
					)
				);
			}

			components.push(load);

			await message.edit({ components: components, });
		}
	});
};

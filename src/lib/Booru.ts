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
import User from "../schemas/User";
import { LoadableNSFWInteraction } from "../typings/Sauce";
import { cooldownCheck, setCooldown } from "../events/btnInteraction";
import { collectors } from "../events/cmdInteraction";
const booru = require("booru");

export async function searchBooru(
	interaction: LoadableNSFWInteraction,
	query: string[],
	site: string,
	mode?: string
) 
{
	let siteUrl;
	switch (site) 
	{
		case "gelbooru":
			siteUrl = "https://gelbooru.com/index.php?page=post&s=view&id=";
			break;
		case "r34":
			siteUrl = "https://rule34.xxx/index.php?page=post&s=view&id=";
			break;
		case "realbooru":
			siteUrl = "https://realbooru.com/index.php?page=post&s=view&id=";
			break;
		case "safebooru":
			siteUrl = "https://safebooru.org/index.php?page=post&s=view&id=";
			break;
	}

	/**
	 * Filtering results
	 */
	// Tried my best since blue archive content is used quite a lot
	const obligatory: string[] = [
		"sort:score",
		"-loli",
		"-shota",
		"-furry",
		"-scat",
		"-amputee",
		"-vomit",
		"-insect",
		"-bestiality",
		"-futanari",
		"-ryona",
		"-death",
		"-vore",
		"-torture",
		"-pokephilia",
		"-koharu_(blue_archive)",
		"-miyu_(blue_archive)",
		"-mutsuki_(blue_archive)",
		"-hina_(blue_archive)",
		"-neru_(blue_archive)",
		"-hoshino_(blue_archive)",
		"-kisaki_(blue_archive)",
		"-mari_(blue_archive)",
		"-chisa_(blue_archive)",
		"-shizuko_(blue_archive)",
		"-iori_(blue_archive)",
		"-hifumi_(blue_archive)",
		"-iroha_(blue_archive)",
		"-aris_(blue_archive)",
		"-klee_(genshin_impact)",
		"-nahida_(genshin_impact)",
		"-diona_(genshin_impact)",
		"-sayu_(genshin_impact)",
		"-hilichurl_(genshin_impact)"
	];
	const booruResult = await booru.search(site, query.concat(obligatory), {
		limit: 1,
		random: true,
	});

	if (booruResult.length == 0) 
	{
		const noResult: EmbedBuilder = new EmbedBuilder()
			.setColor("Red")
			.setDescription("❌ | No result found!");
		return interaction.editReply({ embeds: [noResult], });
	}

	const result = booruResult[0];
	let message = "**Requested Tag(s)**:";
	query.forEach((tag, i) => 
	{
		message += ` \`${tag}\``;
		if (i != query.length - 1) message += ", ";
	});

	// message += "\n\n**Post Tags**: ||";
	// result.tags.forEach((tag) =>
	// {
	// 	message += ` \`${tag}\` `;
	// });
	// message += "||";

	/**
	 * Preparing buttons
	 */
	const links: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Post Link")
				.setEmoji({ name: "🔗", })
				.setURL(siteUrl + result.id)
		);
	const load: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setLabel("Load More")
				.setCustomId(`LMORE-${interaction.user.id}`)
		);

	// god i hate regex
	if (
		result.source &&
		result.source.match(
			new RegExp(
				/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
			)
		)
	) 
	{
		if (result.source.length <= 512)
		{
			links.addComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Link)
					.setLabel("Sauce Link")
					.setEmoji({ name: "🔍", })
					.setURL(
						result.source.includes("https://")
							? result.source
							: "https://" + result.source
					)
			);
		}
	}
	else 
	{
		links.addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("SAUCE")
				.setLabel("Get Sauce")
				.setEmoji({ name: "🔍", })
		);
	}

	const user = await User.findOne({ userId: interaction.user.id, });
	if (
		!user ||
		!user.lastVoteTimestamp ||
		Math.floor(Date.now() / 1000) - user.lastVoteTimestamp > 43200
	) 
	{
		load.components[0].setLabel("Load More (Vote to Use)").setDisabled(true);
		load.addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel("Vote for Shinano!")
				.setEmoji({ id: "1002849574517477447", })
				.setURL("https://top.gg/bot/1002193298229829682/vote")
		);
	}

	/**
	 * Sending
	 */
	let chatMessage: Message;
	if ([".mp4", "webm"].includes(result.fileUrl.slice(-4))) 
	{
		chatMessage =
			mode === "followUp"
				? await interaction.followUp({
					content: message + "\n\n" + result.fileUrl,
					components: [links, load],
				  })
				: await interaction.editReply({
					content: message + "\n\n" + result.fileUrl,
					components: [links, load],
				  });
	}
	else 
	{
		const booruEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage(result.fileUrl)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		if (message.length >= 2000) 
		{
			chatMessage =
				mode === "followUp"
					? await interaction.followUp({
						content: message,
						embeds: [booruEmbed],
						components: [links, load],
					  })
					: await interaction.editReply({
						content: message,
						embeds: [booruEmbed],
						components: [links, load],
					  });
		}
		else 
		{
			booruEmbed.setDescription(message);
			chatMessage =
				mode === "followUp"
					? await interaction.followUp({
						embeds: [booruEmbed],
						components: [links, load],
					  })
					: await interaction.editReply({
						embeds: [booruEmbed],
						components: [links, load],
					  });
		}
	}

	/**
	 * Processing loadmore requests
	 */
	const collector: InteractionCollector<ButtonInteraction> =
		await chatMessage.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 40000,
		});

	collectors.set(interaction.user.id, collector);

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
			await chatMessage.edit({ components: [links, load], });

			await searchBooru(interaction, query, site, "followUp");

			setCooldown("LMORE", i);

			return collector.stop("done");
		}
	});

	collector.on("end", async (collected, reason) => 
	{
		if (reason !== "done") 
		{
			load.components[0].setDisabled(true);
			await chatMessage.edit({ components: [links, load], });
		}
	});
}

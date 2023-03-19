import User from "../../../../schemas/User";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder,
	InteractionCollector
} from "discord.js";
import fetch from "node-fetch";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const user = interaction.options.getUser("user");

	/**
	 * Database Info
	 */
	let voteTime: number | string;
	let voteStatus: boolean | string = true;

	const voteUser = await User.findOne({ userId: user.id, });

	if (voteUser.lastVoteTimestamp) 
	{
		const currentTime = Math.floor(Date.now() / 1000);
		voteTime = voteUser.lastVoteTimestamp;

		if (currentTime - voteUser.lastVoteTimestamp >= 43200) voteStatus = false;
	}
	else 
	{
		voteStatus = "N/A";
		voteTime = "N/A";
	}

	/**
	 * Top.gg Database
	 */
	let topggVoteStatus: boolean = false;

	const response = await fetch(
		`https://top.gg/api/bots/1002193298229829682/check?userId=${user.id}`,
		{
			method: "GET",
			headers: {
				Authorization: process.env.topggApiKey,
			},
		}
	);
	const topggResult = await response.json();
	if (topggResult.voted == 1) topggVoteStatus = true;

	const voteEmbed: EmbedBuilder = new EmbedBuilder()
		.setColor("#2f3136")
		.addFields(
			{
				name: "Top.gg Database:",
				value: `Voted: ${topggVoteStatus}`,
			},
			{
				name: "Shinano Database:",
				value:
					`Voted: ${voteStatus}\n` +
					`Last Voted: ${
						typeof voteTime != "string"
							? `<t:${voteTime}:R> | <t:${voteTime}>`
							: "N/A"
					}`,
			}
		);
	const dbUpdate: ActionRowBuilder<ButtonBuilder> =
		new ActionRowBuilder<ButtonBuilder>().setComponents(
			new ButtonBuilder()
				.setLabel("Update user in database")
				.setEmoji({ name: "✅", })
				.setStyle(ButtonStyle.Success)
				.setCustomId("ADB")
				.setDisabled(false)
		);

	/**
	 * Collector
	 */
	const message = await interaction.editReply({
		embeds: [voteEmbed],
		components: [dbUpdate],
	});

	const collector: InteractionCollector<ButtonInteraction> =
		await message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 60000,
		});

	collector.on("collect", async (i) => 
	{
		if (i.user.id !== "836215956346634270") 
		{
			await i.reply({
				content: "This button is only for developers!",
				ephemeral: true,
			});
		}
		else 
		{
			if (!voteUser) 
			{
				await User.create({
					userId: user.id,
					commandsExecuted: 0,
					lastVoteTimestamp: Math.floor(Date.now() / 1000),
				});
			}
			else 
			{
				await voteUser.updateOne({
					lastVoteTimestamp: Math.floor(Date.now() / 1000),
				});
			}
		}

		const updatedEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Green")
			.setDescription("✅ | Updated the database!");
		await i.reply({
			embeds: [updatedEmbed],
			ephemeral: true,
		});

		collector.stop();
	});

	collector.on("end", async (collected, reason) => 
	{
		dbUpdate.components[0].setDisabled(true);
		await interaction.editReply({ components: [dbUpdate], });
	});
};

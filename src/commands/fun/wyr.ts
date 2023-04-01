import { ChatInputCommand } from "../../structures/Command";
import fetch from "node-fetch";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ComponentType,
	EmbedBuilder,
	InteractionCollector
} from "discord.js";
import { collectors } from "../../events/cmdInteraction";

export default new ChatInputCommand({
	name: "would-you-rather",
	description: "Would you rather...",
	cooldown: 5000,
	category: "Fun",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const response = await fetch("https://amagi.fuwafuwa08.repl.co/wyr");
		const wyr = await response.json();

		const wyrEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("#2f3136")
			.setTitle("Would you rather...")
			.setDescription(`🅰️ ${wyr.optionA}\n\n` + `🅱️ ${wyr.optionB}`);

		const choices: ActionRowBuilder<ButtonBuilder> =
			new ActionRowBuilder<ButtonBuilder>().setComponents(
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setEmoji({ name: "🅰️", })
					.setCustomId(`A-${interaction.user.id}`),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setEmoji({ name: "🅱️", })
					.setCustomId(`B-${interaction.user.id}`)
			);

		const message = await interaction.editReply({
			embeds: [wyrEmbed],
			components: [choices],
		});
		const collector: InteractionCollector<ButtonInteraction> =
			await message.createMessageComponentCollector({
				componentType: ComponentType.Button,
				time: 20000,
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
				await i.deferUpdate();

				const customId = i.customId.split("-")[0];

				let percentageA;
				let percentageB;

				if (wyr.votesA == 0 || wyr.votesB == 0) 
				{
					switch (customId) 
					{
						case "A": {
							percentageA = 100;
							percentageB = 0;
							break;
						}

						case "B": {
							percentageA = 0;
							percentageB = 100;
							break;
						}
					}
				}
				else 
				{
					percentageA = (
						(wyr.votesA / (wyr.votesA + wyr.votesB)) *
						100
					).toFixed(1);
					percentageB = (
						(wyr.votesB / (wyr.votesA + wyr.votesB)) *
						100
					).toFixed(1);
				}

				switch (customId) 
				{
					case "A": {
						choices.components[0]
							.setLabel(`${percentageA}%`)
							.setStyle(ButtonStyle.Success);
						choices.components[1].setLabel(`${percentageB}%`);
						break;
					}

					case "B": {
						choices.components[0].setLabel(`${percentageA}%`);
						choices.components[1]
							.setLabel(`${percentageB}%`)
							.setStyle(ButtonStyle.Success);
						break;
					}
				}

				await interaction.editReply({ components: [choices], });

				collector.stop();
			}
		});

		collector.on("end", async (collected, reason) => 
		{
			choices.components[0].setDisabled(true);
			choices.components[1].setDisabled(true);

			await interaction.editReply({ components: [choices], });
		});
	},
});

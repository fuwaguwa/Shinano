import { ApplicationCommandType, EmbedBuilder, TextChannel } from "discord.js";
import { getSauce } from "../../../lib/Sauce";
import { MessageCommand } from "../../../structures/Command";

export default new MessageCommand({
	name: "Get Sauce",
	cooldown: 5000,
	type: ApplicationCommandType.Message,
	run: async ({ interaction }) => {
		let ephemeral: boolean = true;
		if ((interaction.channel as TextChannel).nsfw) ephemeral = false;

		let link: string;
		interaction.options.data[0].message.attachments.size > 0
			? (link = interaction.options.data[0].message.attachments.first().url)
			: (link = interaction.options.data[0].message.content);

		if (!link) {
			const noImg: EmbedBuilder = new EmbedBuilder()
				.setColor("Red")
				.setDescription(
					"❌ | There's no image to be searched for! If the image is inside an embed, you can copy the image link and use `/sauce link` instead! "
				);
			return interaction.reply({ embeds: [noImg], ephemeral: true });
		}

		await getSauce({ interaction, link, ephemeral });
	},
});

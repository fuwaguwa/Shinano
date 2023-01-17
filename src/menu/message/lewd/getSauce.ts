import { ApplicationCommandType, TextChannel } from "discord.js";
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
		interaction.options.data[0].attachment
			? (link =
					interaction.options.data[0].message.attachments.first().proxyURL)
			: (link = interaction.options.data[0].message.content);
		await getSauce({ interaction, link, ephemeral });
	},
});

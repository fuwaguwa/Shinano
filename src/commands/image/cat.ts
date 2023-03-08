import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import SRA from "somerandomapi.js";

export default new ChatInputCommand({
	name: "cat",
	description: "Get an image of a cat!",
	cooldown: 4000,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const catEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage((await SRA.animal.image({ animal: "cat", })).imgUrl)
			.setFooter({
				text: `Requested by ${interaction.user.tag}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		await interaction.editReply({ embeds: [catEmbed], });
	},
});

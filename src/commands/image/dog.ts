import { EmbedBuilder } from "discord.js";
import { ChatInputCommand } from "../../structures/Command";
import SRA from "somerandomapi.js";

export default new ChatInputCommand({
	name: "dog",
	description: "Get an image of a dog!",
	cooldown: 4500,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const dogEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage((await SRA.animal.image({ animal: "dog", })).imgUrl)
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: true, }),
			});

		await interaction.editReply({ embeds: [dogEmbed], });
	},
});

import SRA from "somerandomapi.js";
import { ChatInputCommand } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new ChatInputCommand({
	name: "panda",
	description: "Incredibly stupid and cute!",
	cooldown: 4000,
	category: "Image",
	run: async ({ interaction, }) => 
	{
		if (!interaction.deferred) await interaction.deferReply();

		const pandaEmbed: EmbedBuilder = new EmbedBuilder()
			.setColor("Random")
			.setImage((await SRA.animal.image({ animal: "panda", })).imgUrl)
			.setFooter({
				text: `Requested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL({ forceStatic: false, }),
			});

		await interaction.editReply({ embeds: [pandaEmbed], });
	},
});

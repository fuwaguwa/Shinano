import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const headpat: EmbedBuilder = new EmbedBuilder()
		.setColor("#2b2d31")
		.setDescription(
			[
				"\"Aah... My ears are sensitive...\"",
				"\"Alas... This one's ears are sensitive...\""
			][Math.floor(Math.random() * 2)]
		)
		.setImage(
			"https://cdn.discordapp.com/attachments/1002189321631187026/1034474955116662844/shinano_azur_lane_drawn_by_nagi_ria__3c37724853c358bebf5bc5668e0d4314_1.gif"
		);
	await interaction.reply({ embeds: [headpat], });
};

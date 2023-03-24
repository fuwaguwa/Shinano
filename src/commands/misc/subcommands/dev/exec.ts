import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { exec } from "child_process";
import { codeBlock } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => 
{
	const cmd: string = interaction.options.getString("cmd");

	const output: EmbedBuilder = new EmbedBuilder();

	exec(cmd, (err, stdout, stderr) => 
	{
		if (err) 
		{
			output.setColor("Red").setFields({
				name: "Output",
				value: codeBlock(err.message),
			});
			return interaction.editReply({ embeds: [output], });
		}

		if (stderr) 
		{
			output.setColor("Red").setFields({
				name: "Output",
				value: codeBlock(stderr),
			});
			return interaction.editReply({ embeds: [output], });
		}

		output.setColor("Green").setFields({
			name: "Output",
			value: codeBlock(stdout),
		});
		return interaction.editReply({ embeds: [output], });
	});
};

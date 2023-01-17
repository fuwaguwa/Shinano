import { codeBlock } from "@discordjs/builders";
import util from "util";
import { ChatInputCommandInteraction } from "discord.js";

export = async (interaction: ChatInputCommandInteraction) => {
	const code: string = interaction.options.getString("code");

	let output: string = await new Promise((resolve, reject) => {
		resolve(eval(code));
	});
	if (typeof output !== "string") output = util.inspect(output, { depth: 0 });

	await interaction.editReply({
		content: codeBlock("js", output),
	});
};

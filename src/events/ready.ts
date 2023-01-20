import { ActivityType } from "discord.js";
import { client } from "..";
import { updateServerCount } from "../lib/Utils";
import { Event } from "../structures/Event";
import { ActivityList } from "../typings/Activity";

export default new Event("ready", async () => 
{
	console.log("Shinano is ready!");
	await updateServerCount();

	/**
	 * Updating Presence
	 */
	const activitiesList: ActivityList[] = [
		{
			type: ActivityType.Playing,
			message: "with Laffey",
		},
		{
			type: ActivityType.Playing,
			message: "Azur Lane",
		},
		{
			type: ActivityType.Playing,
			message: "with a supercar",
		},
		{
			type: ActivityType.Watching,
			message: "over the fox sisters.",
		},
		{
			type: ActivityType.Watching,
			message: "the shikikan.",
		},
		{
			type: ActivityType.Listening,
			message: "Sandy's singing.",
		},
		{
			type: ActivityType.Listening,
			message: "Feelin' It All",
		}
	];

	setInterval(() => 
	{
		const presence =
			activitiesList[Math.floor(Math.random() * activitiesList.length)];

		client.user.setActivity({ name: presence.message, type: presence.type, });
	}, 30000);
});

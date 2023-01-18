import { ActivityType } from "discord.js";

export interface ActivityList {
	type: Exclude<ActivityType, ActivityType.Custom>;
	message: string;
}

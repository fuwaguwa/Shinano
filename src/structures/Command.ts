import {
	ChatInputCommandType,
	MessageCommandType,
	UserCommandType,
} from "../typings/Command";

export class ChatInputCommand {
	constructor(commandOptions: ChatInputCommandType) {
		Object.assign(this, commandOptions);
	}
}

export class MessageCommand {
	constructor(commandOptions: MessageCommandType) {
		Object.assign(this, commandOptions);
	}
}

export class UserCommand {
	constructor(commandOptions: UserCommandType) {
		Object.assign(this, commandOptions);
	}
}

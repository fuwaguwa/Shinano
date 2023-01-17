import { config } from "dotenv";
import { Shinano } from "./structures/Client";
config();

export const client = new Shinano();

client.start();

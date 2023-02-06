import { config } from "dotenv";
import { Shinano } from "./structures/Client";
import mongoose from "mongoose";
config();

mongoose.set("strictQuery", true);

export const client = new Shinano();

client.start();

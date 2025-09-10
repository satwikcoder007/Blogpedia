import { createClient } from "redis";
import { configDotenv } from "dotenv";

configDotenv();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 18073,
  },
  username: "default",
  password: process.env.REDIS_SECRET
});

client.on("error", (err) => console.error("Redis Client Error", err));

await client.connect();

console.log("redis connected ✅");

export default client;

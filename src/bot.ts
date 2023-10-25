import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { loadHandlers } from './functions/library/launch.js';

// Load environment variables from .env
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Access Discord token from the environment variables
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Discord token is missing in the .env file.');
  process.exit(1);
}
await loadHandlers(client);

client.login(token);

import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';

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

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(token);

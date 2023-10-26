import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { loadHandlers } from './functions/library/launch.js';
import type { ExecutableButtonComponent, ExecutableSlashCommand } from './types.js';

// Load environment variables from .env
dotenv.config();

// Access Discord token from the environment variables
const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Discord token is missing in the .env file.');
  process.exit(1);
}

// Setup the Discord Client

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Commands collections
client.executableSlashCommands = new Collection<string, ExecutableSlashCommand>();
// Components collections
client.executableButtonComponents = new Collection<string, ExecutableButtonComponent>();

await loadHandlers(client);

client.login(token);

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import { loadHandlers } from './functions/library/launch.js';
import redisClient from './functions/library/redis.js';
import type { ExecutableButtonComponent, ExecutableSlashCommand } from './types.js';

// Load environment variables
dotenv.config();

// Define the list of required environment variables.
const requiredEnvVars = ['DISCORD_TOKEN', 'BOT_ID', 'MARVEL_API_PUBLIC_KEY', 'MARVEL_API_PRIVATE_KEY'];

// Check if the required environment variables are set.
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is not set.`);
    process.exit(1);
  }
}

// Setup the Discord Client

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Commands collections
client.executableSlashCommands = new Collection<string, ExecutableSlashCommand>();
// Components collections
client.executableButtonComponents = new Collection<string, ExecutableButtonComponent>();

// Load event handlers for the Discord client.
await loadHandlers(client);

// Connect to the Redis database and flush all data.
await redisClient.connect();

// Log in to Discord using the provided token.
client.login(process.env.DISCORD_TOKEN);

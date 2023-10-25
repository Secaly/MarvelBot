import { Client, REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { readdir } from 'fs/promises';
import type { ExecutableSlashCommand } from '../../types.js';

/**
 * Handles the registration of application commands.
 * @param client - The Discord client.
 */
export const handle = async (client: Client): Promise<void> => {
  const discordToken = process.env.DISCORD_TOKEN;
  const botId = process.env.BOT_ID;

  if (!discordToken || !botId) {
    console.error('Missing environment variables. Please check your configuration.');
    return;
  }

  const slashCommandBody = await readSlashCommands(client);

  // Set up the REST API client and refresh the Discord application commands
  const rest = new REST({ version: '10' }).setToken(discordToken);

  try {
    console.log(`Started refreshing application ('/') commands.`);
    console.log(`Commands number: ${slashCommandBody.length}.`);
    await rest.put(Routes.applicationCommands(botId), {
      body: slashCommandBody,
    });
    console.log(`Application ('/') commands refreshed.`);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Reads and registers all slash commands in the /src/commands directory.
 * @param client - The Discord client.
 * @returns An array of commands in JSON.
 */
const readSlashCommands = async (client: Client): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> => {
  const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  const commandFolders = await readdir('./src/commands');

  for (const folder of commandFolders) {
    const commandFiles = (await readdir(`./src/commands/${folder}`)).filter((file) => file.endsWith('.ts'));

    switch (folder) {
      case 'slashCommands':
        body.push(...(await registerSlashCommands(client, commandFiles)));
        break;
      // Add more cases for other commands types if needed
      default:
        break;
    }
  }

  return body;
};

/**
 * Register slash commands with the Discord client.
 * @param client - The Discord client.
 * @param commandFiles - An array of command files.
 * @returns An array of commands in JSON.
 */
const registerSlashCommands = async (
  client: Client,
  commandFiles: string[],
): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> => {
  const registeredCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  for (const [index, file] of commandFiles.entries()) {
    const command = (await import(`../../commands/slashCommands/${file}`)).command as ExecutableSlashCommand;

    client.executableSlashCommands.set(command.data.name, command);
    registeredCommands.push(command.data.toJSON());

    console.log(`[${index + 1}/${commandFiles.length}] Slash Command: ${command.data.name} has been registered.`);
  }

  return registeredCommands;
};

import { Client } from 'discord.js';
import { readdir } from 'fs/promises';
import type { BotEvent } from '../../types.js';

/**
 * Register events for the Discord client.
 * @param client - The Discord client.
 */
export const handle = async (client: Client): Promise<void> => {
  try {
    const eventFolders = await readdir('./src/events');
    for (const folder of eventFolders) {
      const eventFiles = await getEventFiles(folder);
      await registerEvents(client, eventFiles, folder);
    }
  } catch (error) {
    console.error('Error while handling events:', error);
  }
};

/**
 * Get event files from a specific folder.
 * @param folder - The folder to read event files from.
 * @returns An array of event file names.
 */
const getEventFiles = async (folder: string): Promise<string[]> => {
  const folderPath = `./src/events/${folder}`;
  const files = await readdir(folderPath);
  return files.filter((file) => file.endsWith('.ts'));
};

/**
 * Register events with the Discord client.
 * @param client - The Discord client.
 * @param eventFiles - An array of event files.
 * @param eventType - Type of event.
 */
const registerEvents = async (client: Client, eventFiles: string[], eventType: string): Promise<void> => {
  for (const file of eventFiles) {
    try {
      const eventModule = await import(`../../events/${eventType}/${file}`);
      const event: BotEvent = eventModule.event;

      const eventHandler = async (...args: any) => event.execute(...args, client);
      event.once ? client.once(event.name, eventHandler) : client.on(event.name, eventHandler);

      console.log(`${eventType} event registered: ${event.name}`);
    } catch (error) {
      console.error(`Error registering ${eventType} event from file ${file}:`, error);
    }
  }
};

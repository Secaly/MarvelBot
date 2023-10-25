import { Client } from 'discord.js';
import { readdir } from 'fs/promises';
import type { BotEvent } from '../../types.js';

/**
 * Register events for the Discord client.
 * @param client - The Discord client.
 */
export const handle = async (client: Client): Promise<void> => {
  const eventFolders = readdir('./src/events');

  for (const folder of await eventFolders) {
    const eventFiles = (await readdir(`./src/events/${folder}`)).filter((file) => file.endsWith('.ts'));

    switch (folder) {
      case 'client':
        await registerClientEvents(client, eventFiles);
        break;
      // Add more cases for other event types if needed
      default:
        break;
    }
  }
};

/**
 * Register client events with the Discord client.
 * @param client - The Discord client.
 * @param eventFiles - An array of event files.
 */
const registerClientEvents = async (client: Client, eventFiles: string[]): Promise<void> => {
  for (const file of eventFiles) {
    try {
      const eventModule = await import(`../../events/client/${file}`);
      const event: BotEvent = eventModule.event;

      const eventHandler = async (...args: any) => event.execute(...args, client);
      event.once ? client.once(event.name, eventHandler) : client.on(event.name, eventHandler);

      console.log(`Event registered: ${event.name}`);
    } catch (error) {
      console.error(`Error registering event from file ${file}:`, error);
    }
  }
};

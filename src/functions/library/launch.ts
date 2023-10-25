import { Client } from 'discord.js';
import { readdir } from 'fs/promises';

/**
 * Load and execute event handlers.
 * @param client - The Discord client.
 */
export const loadHandlers = async (client: Client): Promise<void> => {
  const handlersDir = await readdir('./src/functions/handlers');
  const handlerFiles = handlersDir.filter((file: string) => file.endsWith('.ts'));

  for (const handlerFile of handlerFiles) {
    const { handle } = await import(`../../src/functions/${handlerFile}`);
    await handle(client);
  }
};

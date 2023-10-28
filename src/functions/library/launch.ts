import { Client } from 'discord.js';
import { readdir } from 'fs/promises';

/**
 * Load and execute event handlers.
 * @param client - The Discord client.
 */
export const loadHandlers = async (client: Client): Promise<void> => {
  // Get a list of files in the 'handlers' directory.
  const handlersDir = await readdir('./src/functions/handlers');

  // Filter the list to include only TypeScript files.
  const handlerFiles = handlersDir.filter((file: string) => file.endsWith('.ts'));

  // Iterate through each handler file and execute its 'handle' function.
  for (const handlerFile of handlerFiles) {
    // Import the handler file.
    const { handle } = await import(`../../../src/functions/handlers/${handlerFile}`);
    // Execute the 'handle' function with the Discord client.
    await handle(client);
  }
};

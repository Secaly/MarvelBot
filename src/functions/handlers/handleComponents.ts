import { Client } from 'discord.js';
import { readdir } from 'fs/promises';
import type { ExecutableButtonComponent } from '../../types.js';

/**
 * Handles the registration of custom components.
 * @param client - The Discord.js client.
 */
export const handle = async (client: Client): Promise<void> => {
  const componentFolders = await readdir('./src/components');

  for (const folder of componentFolders) {
    const componentFiles = (await readdir(`./src/components/${folder}`)).filter((file) => file.endsWith('.ts'));

    switch (folder) {
      case 'buttons':
        registerButtonComponents(client, componentFiles);
        break;
      // Add more cases for other component types if needed
      default:
        break;
    }
  }
};

/**
 * Register button components with the Discord client.
 * @param client - The Discord client.
 * @param componentFiles - An array of button component files.
 */
const registerButtonComponents = async (client: Client, componentFiles: string[]): Promise<void> => {
  for (const [index, file] of componentFiles.entries()) {
    try {
      const component = (await import(`../../components/buttons/${file}`)).component as ExecutableButtonComponent;
      const componentName = component.data.name;

      client.executableButtonComponents.set(componentName, component);

      console.log(`[${index + 1}/${componentFiles.length}] Button Component: ${componentName} has been registered.`);
    } catch (error) {
      console.error(`Error registering button component from file ${file}:`, error);
    }
  }
};

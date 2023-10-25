import { ButtonInteraction, ChatInputCommandInteraction, Client, Events, type Interaction } from 'discord.js';
import type { BotEvent } from '../../types.js';

export const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction: Interaction, client: Client) => {
    if (interaction.isButton()) {
      await handleButtonInteraction(interaction, client);
    } else if (interaction.isChatInputCommand()) {
      await handleSlashCommand(interaction, client);
    }
  },
};

/**
 * Handle button interactions.
 * @param interaction - The button interaction.
 * @param client - The Discord client.
 */
const handleButtonInteraction = async (interaction: ButtonInteraction, client: Client) => {
  const [buttonId, ...params] = interaction.customId.split('|');

  if (!buttonId) return;

  const button = interaction.client.executableButtonComponents.get(buttonId);

  if (!button) return;

  try {
    await button.execute(interaction, client, ...params);
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
};

/**
 * Handle slash commands.
 * @param interaction - The slash command interaction.
 * @param client - The Discord client.
 */
const handleSlashCommand = async (interaction: ChatInputCommandInteraction, client: Client) => {
  const command = interaction.client.executableSlashCommands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    await handleInteractionError(interaction, error);
  }
};

/**
 * Handle interaction errors and respond appropriately.
 * @param interaction - The interaction.
 * @param error - The error that occurred.
 */
const handleInteractionError = async (interaction: Interaction, error: unknown): Promise<void> => {
  console.error(error);

  if (!interaction.isRepliable()) return;

  const errorMessage = `Something went wrong while executing this command.`;

  if (interaction.deferred) {
    await interaction.editReply({ content: errorMessage });
  } else {
    await interaction.reply({ content: errorMessage, ephemeral: true });
  }
};

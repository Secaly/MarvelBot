import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';

/**
 * Creates an action row with previous and next buttons for navigation.
 *
 * @param characterName - The name of the character.
 * @param page - The current page.
 * @param max - The maximum page.
 * @returns An ActionRowBuilder containing previous and next buttons.
 */
export const arrowsRow = (characterName: string, page: number, max: number): ActionRowBuilder<ButtonBuilder> => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`arrow|${characterName}|${page - 1}`)
      .setLabel(`Previous`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji({ name: '⬅️' })
      .setDisabled(page === 0 ? true : false),
  );

  row.addComponents(
    new ButtonBuilder()
      .setCustomId(`arrow|${characterName}|${page + 1}`)
      .setLabel(`Next`)
      .setStyle(ButtonStyle.Primary)
      .setEmoji({ name: '➡️' })
      .setDisabled(page === max - 1 ? true : false),
  );

  return row;
};

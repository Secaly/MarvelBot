import type { CharacterData, ReplyOptions } from '../../types.js';
import { arrowsRow } from './componentsRow.js';
import { characterEmbed } from './embed.js';

/**
 * Create reply options for displaying character data and navigation components.
 * @param characterData - The character data to display.
 * @param page - The current page number.
 * @returns ReplyOptions containing an embed and navigation components.
 */
export const replyOptions = (characterData: CharacterData, page: number): ReplyOptions => {
  const numberOfComicsDisplayed = 5;

  // Create an embed to display character information for the given page.
  const embed = characterEmbed(characterData, page);

  // Calculate the maximum number of pages based on the total comics available.
  const maximumPages = Math.ceil(characterData.comicsAvailable / numberOfComicsDisplayed);

  return {
    embeds: [embed],
    components: [arrowsRow(characterData.name, page, maximumPages)],
  };
};

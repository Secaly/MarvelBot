import { EmbedBuilder } from 'discord.js';
import type { CharacterData, ComicData } from '../../types.js';

/**
 * Generate an embed for a character with a list of comics.
 * @param character - The character data to display.
 * @param page - The current page number.
 * @returns An EmbedBuilder instance.
 */
export const characterEmbed = (character: CharacterData, page: number): EmbedBuilder => {
  // Define the number of comics to display on each page.
  const numberOfComicsDisplayed = 5;

  // Calculate the maximum number of pages needed for pagination.
  const maximumPages = Math.ceil(character.comicsAvailable / numberOfComicsDisplayed);

  // Create a new EmbedBuilder instance for the character.
  const embed = new EmbedBuilder()
    .setTitle(character.name)
    .setDescription(character.description ? character.description : `No character description.`)
    .setURL(character.url)
    .setFooter({
      text: `Comics available : ${character.comicsAvailable} - Page ${page + 1}/${maximumPages}`,
    })
    .setColor('#3498db');

  // Set the character thumbnail image if available.
  if (character.thumbnail) embed.setThumbnail(character.thumbnail);

  // Calculate the starting and ending index for comics to display on the current page.
  const startingIndex = page * numberOfComicsDisplayed;
  const endingIndex = startingIndex + numberOfComicsDisplayed;

  // Slice the comics array to display only the relevant comics for the current page.
  const comicsDisplayed = character.comics.slice(startingIndex, endingIndex);

  // Add each comic to the embed as fields.
  comicsDisplayed.forEach((comic: ComicData) => {
    embed.addFields({
      name: comic.title,
      value: comic.description ? comic.description : 'No comic Description.',
    });
  });

  return embed;
};

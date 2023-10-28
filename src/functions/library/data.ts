import type { CharacterData } from '../../types.js';

/**
 * Format fetched data into a CharacterData object.
 * @param character - The character data from the Marvel API.
 * @param comics - The comics data from the Marvel API.
 * @returns - The formatted message.
 */
export const formatFetchedData = (character: any, comics: any[]): CharacterData => {
  const characterData: CharacterData = {
    id: character.id,
    name: character.name,
    description: character.description ? character.description : undefined,
    url: `https://www.marvel.com/characters/${character.name.toLowerCase().replace(/\s+/g, '-')}`,
    thumbnail: character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}` : undefined,
    comicsAvailable: character.comics.available,
    comics,
  };

  return characterData;
};

/**
 * Truncate a string if it exceeds the maximum allowed size.
 * @param input - The input string to truncate.
 * @param maxSize - The maximum allowed size for the string.
 * @returns - The truncated string.
 */
export const truncateString = (input: string, maxSize: number = 1024): string => {
  // Check if the input string is already within the size limit
  if (input.length <= maxSize) {
    return input; // No need to truncate
  }

  // Calculate the maximum length for the truncated string
  const maxLength = maxSize - 3; // Leave space for '...'

  // Truncate the string to the calculated maximum length
  const truncated = input.substring(0, maxLength);

  // Add '...' to the end of the truncated string
  const result = truncated + '...';

  return result;
};

import { createHash } from 'crypto';
import type { ApiError, ComicData } from '../../types.js';
import { truncateString } from './data.js';

/**
 * Fetch character data from the Marvel API.
 * @param characterName - The character's name.
 * @returns A promise that resolves to the character data.
 */
export const fetchCharacter = async (characterName: string): Promise<any> => {
  const baseUrl = 'https://gateway.marvel.com/v1/public/characters';
  const apiUrl = `${baseUrl}?name=${characterName}&${generateEndApiUrl()}`;

  try {
    const response = await fetch(apiUrl);

    // Check for a successful API response (HTTP status code 200).
    if (response.status !== 200) {
      handleResponseStatusError(response);
    }

    const characterData = await response.json();

    // Return the first character data result (assuming there's only one character with the given name).
    return characterData.data.results[0];
  } catch (error) {
    console.error(`Error while fetching character data`);
    throw error;
  }
};

/**
 * Fetch character comics data from the Marvel API with pagination.
 * @param characterId - The ID of the character.
 * @param maximum - The maximum number of comics to fetch.
 * @returns A promise that resolves to the comics data.
 */
export const fetchAllComics = async (characterId: number, maximum: number): Promise<ComicData[]> => {
  const limit = 100;
  const numberOfRequests = Math.ceil(maximum / limit);
  const endApiUrl = generateEndApiUrl();

  // Generate offsets for paginated requests.
  const offsets = Array.from({ length: numberOfRequests }, (_, i) => i * limit);

  // Fetch comics data for each offset in parallel.
  const comicsPromises = offsets.map((offset) => fetchComics(offset, characterId, endApiUrl));

  // Wait for all promises to resolve and flatten the result array.
  const comicsData = await Promise.all(comicsPromises);

  return comicsData.flat();
};

/**
 * Fetch comics data for a specific character with offset and character ID.
 * @param offset - The offset for pagination.
 * @param characterId - The ID of the character.
 * @param endApiUrl - The end part of the API URL.
 * @returns A promise that resolves to an array of ComicData.
 */
const fetchComics = async (offset: number, characterId: number, endApiUrl: string): Promise<ComicData[]> => {
  const baseUrl = 'https://gateway.marvel.com/v1/public/characters';
  const apiUrl = `${baseUrl}/${characterId}/comics?limit=100&offset=${offset}&${endApiUrl}`;

  try {
    const response = await fetch(apiUrl);

    // Check for a successful API response (HTTP status code 200).
    if (response.status !== 200) {
      handleResponseStatusError(response);
    }

    const comicsResponse = await response.json();
    const comicsResults = comicsResponse.data.results;

    // Format the comics data and return it as an array of ComicData objects.
    const formattedComics = comicsResults.map((comic: any) => ({
      title: comic.title,
      description: comic.description ? truncateString(comic.description) : undefined,
    }));

    return formattedComics;
  } catch (error) {
    console.error(`Error while fetching comics data`);
    throw error;
  }
};

/**
 * Generate the end part of the API URL with timestamp and hash.
 * @returns The end part of the API URL as a string.
 */
const generateEndApiUrl = () => {
  const timestamp = Date.now();
  const publicKey = process.env.MARVEL_API_PUBLIC_KEY;
  const privateKey = process.env.MARVEL_API_PRIVATE_KEY;
  const hash = createHash('md5').update(`${timestamp}${privateKey}${publicKey}`).digest('hex');

  return `apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;
};

/**
 * Handle response status errors based on the Marvel API documentation.
 * @param response - The HTTP response object.
 * @throws Error with an informative message based on the error code and reason.
 */
const handleResponseStatusError = async (response: Response): Promise<void> => {
  // More informations here : https://developer.marvel.com/documentation/authorization

  const status = response.status;
  const errorData: ApiError = await response.json();
  const code = errorData.code;

  switch (response.status) {
    case 409:
      switch (code) {
        case 'MissingParameter': // Missing API Key	in the documentation
          throw new Error(`[${status}] [${code}] - Occurs when the apikey parameter is not included with a request.`);
        case 'MissingHash':
          throw new Error(
            `[${status}] [${code}] - Occurs when an apikey parameter is included with a request, a ts parameter is present, but no hash parameter is sent. Occurs on server-side applications only.`,
          );
        case 'MissingTimestamp':
          throw new Error(
            `[${status}] [${code}] - Occurs when an apikey parameter is included with a request, a hash parameter is present, but no ts parameter is sent. Occurs on server-side applications only.`,
          );
        default:
          throw new Error(`[${status}] [${code}].`);
      }

    case 401:
      switch (code) {
        case 'InvalidReferer':
          throw new Error(
            `[${status}] [${code}] - Occurs when a referrer which is not valid for the passed apikey parameter is sent.`,
          );
        case 'InvalidHash':
          throw new Error(
            `[${status}] [${code}] - Occurs when a ts, hash and apikey parameter are sent but the hash is not valid per the above hash generation rule.`,
          );
        default:
          throw new Error(`[${status}] [${code}].`);
      }

    case 405:
      throw new Error(
        `[${status}] [${code}] - Occurs when an API endpoint is accessed using an HTTP verb which is not allowed for that endpoint.`,
      );

    case 403:
      throw new Error(
        `[${status}] [${code}] - Occurs when a user with an otherwise authenticated request attempts to access an endpoint to which they do not have access.`,
      );

    default:
      throw new Error(`Received an unexpected status code - ${status}.`);
  }
};

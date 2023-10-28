import { Client, MessageComponentInteraction } from 'discord.js';
import type { ExecutableButtonComponent } from '../../types.js';
import redisClient from '../../functions/library/redis.js';
import type { CharacterData } from '../../types.js';
import { fetchAllComics, fetchCharacter } from '../../functions/library/fetch.js';
import { formatFetchedData } from '../../functions/library/data.js';
import { replyOptions } from '../../functions/library/interaction.js';

export const component: ExecutableButtonComponent = {
  data: {
    name: `arrow`,
  },
  execute: async (interaction: MessageComponentInteraction, client: Client, characterName: string, page: string) => {
    // Try to retrieve character data from cache (Redis)
    const characterJSON = await redisClient.get(characterName);

    if (characterJSON) {
      const characterData: CharacterData = JSON.parse(characterJSON);
      await interaction.update(replyOptions(characterData, parseInt(page)));

      return;
    }

    // If not on Redis, fetch character data from the API
    const fetchedCharacter = await fetchCharacter(characterName);
    const fetchedComics = await fetchAllComics(fetchedCharacter.id, fetchedCharacter.comics.available);
    const characterData = formatFetchedData(fetchedCharacter, fetchedComics);

    // Cache the character data in Redis with a one day expiration (60 sec * 60 min * 24 hours)
    await redisClient.set(characterName, JSON.stringify(characterData), { EX: 60 * 60 * 24 });

    await interaction.update(replyOptions(characterData, parseInt(page)));
  },
};

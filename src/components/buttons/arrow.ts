import { Client, CommandInteractionOptionResolver, MessageComponentInteraction } from 'discord.js';
import type { ExecutableButtonComponent } from '../../types.js';
import redisClient from '../../functions/library/redis.js';
import type { CharacterData } from '../../types.js';
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
      await interaction.update(replyOptions(characterData, parseInt(page), characterName));

      return;
    }

    // If it's not on Redis, ask the user to do a new search
    await interaction.update({
      embeds: [],
      content: `${characterName} is no longer in the cache, please do a /search ${characterName}`,
      components: [],
    });
  },
};

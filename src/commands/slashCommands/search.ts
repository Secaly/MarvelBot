import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import type { ExecutableSlashCommand } from '../../types.js';
import redisClient from '../../functions/library/redis.js';
import type { CharacterData } from '../../types.js';
import { fetchAllComics, fetchCharacter } from '../../functions/library/fetch.js';
import { formatFetchedData } from '../../functions/library/data.js';
import { replyOptions } from '../../functions/library/interaction.js';

export const command: ExecutableSlashCommand = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Return')
    .addStringOption((option) => option.setName('name').setDescription('Nom du call').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
  execute: async (interaction: ChatInputCommandInteraction, client: Client): Promise<void> => {
    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    const characterName = interaction.options.getString('name');
    const page = 0;

    // Check if a character name is provided
    if (!characterName) {
      console.error('Invalid character name provided.');
      return;
    }

    // Try to retrieve character data from cache (Redis)
    const characterJSON = await redisClient.get(characterName);

    if (characterJSON) {
      const characterData: CharacterData = JSON.parse(characterJSON);
      await interaction.editReply(replyOptions(characterData, page));

      return;
    }

    // If not on Redis, fetch character data from the API
    const fetchedCharacter = await fetchCharacter(characterName);

    // Check if the character is on the Marvel's API
    if (fetchedCharacter === undefined) {
      await interaction.editReply({ content: `The character "${characterName}" cannot be found on Marvel's API` });

      return;
    }

    const fetchedComics = await fetchAllComics(fetchedCharacter.id, fetchedCharacter.comics.available);
    const characterData = formatFetchedData(fetchedCharacter, fetchedComics);

    // Cache the character data in Redis with a one day expiration (60 sec * 60 min * 24 hours)
    await redisClient.set(characterName, JSON.stringify(characterData), { EX: 60 * 60 * 24 });

    await interaction.editReply(replyOptions(characterData, page));
  },
};

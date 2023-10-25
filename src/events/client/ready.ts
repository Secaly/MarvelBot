import { Client, Events } from 'discord.js';
import type { BotEvent } from '../../types.js';

export const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    const userTag = client.user?.tag;
    console.log(`Logged in as ${userTag}`);
  },
};

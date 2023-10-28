import type { BotEvent } from '../../types.js';

export const event: BotEvent = {
  name: `ready`,
  once: true,
  async execute() {
    console.log('Redis client is ready');
  },
};

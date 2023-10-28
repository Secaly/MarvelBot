import type { BotEvent } from '../../types.js';

export const event: BotEvent = {
  name: `error`,
  once: false,
  async execute(error: any) {
    console.error('Redis error:', error);
  },
};

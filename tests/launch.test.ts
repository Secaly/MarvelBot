import { loadHandlers } from '../src/functions/library/launch.js';
import { vi, describe, expect, it, beforeEach } from 'vitest';
import { Client, GatewayIntentBits } from 'discord.js';
import * as fs from 'fs';

// Create a custom object that mimics the behavior of fs.promises
const customFsPromises = {
  readdir: vi.fn(),
};

// Mocked versions of the 'handle' functions for testing
const mockedHandlers = {
  handler1: vi.fn(),
  handler2: vi.fn(),
};

beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('#loadHandlers', () => {
  it('should handle the case when no handler files are found', async () => {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    // Mock the 'readdir' function to return an empty list of files
    customFsPromises.readdir.mockResolvedValue([]);

    await loadHandlers(client);

    // Ensure that no handlers were executed
    expect(mockedHandlers.handler1).not.toHaveBeenCalled();
    expect(mockedHandlers.handler2).not.toHaveBeenCalled();
  });

  it('should handle the case when no TypeScript handler files are found', async () => {
    const client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    // Mock readdir to return a JavaScript file
    vi.spyOn(fs.promises, 'readdir').mockImplementation(
      async () => [{ name: 'handler3.js', isFile: () => true, isDirectory: () => false }] as fs.Dirent[],
    );

    await loadHandlers(client);

    // Ensure that no handlers were executed
    expect(mockedHandlers.handler1).not.toHaveBeenCalled();
    expect(mockedHandlers.handler2).not.toHaveBeenCalled();
  });
});

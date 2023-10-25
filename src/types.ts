import { Client, CommandInteraction, SlashCommandBuilder, MessageComponentInteraction, Collection } from 'discord.js';

// Discord client
declare module 'discord.js' {
  export interface Client {
    executableSlashCommands: Collection<string, ExecutableSlashCommand>;
    executableButtonComponents: Collection<string, ExecutableButtonComponent>;
  }
}

// Executable Discord client collections
export type ExecutableSlashCommand = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction, client: Client) => Promise<void>;
};

export type ExecutableButtonComponent = {
  data: { name: string };
  execute: (interaction: MessageComponentInteraction, client: Client, ...args: any) => Promise<void>;
};

export type BotEvent = {
  name: string;
  once?: boolean;
  execute: (...args: any) => Promise<void>;
};

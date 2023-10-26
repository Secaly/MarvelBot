import {
  Client,
  SlashCommandBuilder,
  MessageComponentInteraction,
  Collection,
  ChatInputCommandInteraction,
} from 'discord.js';

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
  execute: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>;
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

// Marvel API types

export type apiResult = {
  code: number; // The HTTP status code of the returned result
  status: string; // A string description of the call status
  data: apiContainerResult; // The results returned by the call
  etag: string; // A digest value of the content
  copyright: string; // The copyright notice for the returned result
  attributionText: string; // The attribution notice for this result
  attributionHTML: string; // An HTML representation of the attribution notice for this result
};

export type apiContainerResult = {
  offset: number; // The requested offset (skipped results) of the call
  limit: number; // The requested result limit
  total: number; // The total number of results available
  count: number; // The total number of results returned by this call
  results: any[]; // The list of entities returned by the call
};

// Customs types

export type interactionReplyFile = {
  attachment: Buffer | string;
  name: string;
};

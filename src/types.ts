import {
  Client,
  SlashCommandBuilder,
  MessageComponentInteraction,
  Collection,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} from 'discord.js';

// Environment variables

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      BOT_ID: string;
      MARVEL_API_PUBLIC_KEY: string;
      MARVEL_API_PRIVATE_KEY: string;
    }
  }
}

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
  execute: (interaction: MessageComponentInteraction, client: Client, ...args: string[]) => Promise<void>;
};

export type BotEvent = {
  name: string;
  once?: boolean;
  execute: (...args: any) => Promise<void>;
};

// Marvel API types

export type ApiResult = {
  code: number; // The HTTP status code of the returned result
  status: string; // A string description of the call status
  data: ApiContainerResult; // The results returned by the call
  etag: string; // A digest value of the content
  copyright: string; // The copyright notice for the returned result
  attributionText: string; // The attribution notice for this result
  attributionHTML: string; // An HTML representation of the attribution notice for this result
};

export type ApiContainerResult = {
  offset: number; // The requested offset (skipped results) of the call
  limit: number; // The requested result limit
  total: number; // The total number of results available
  count: number; // The total number of results returned by this call
  results: any[]; // The list of entities returned by the call
};

export type ApiError = {
  code: string; // the http status code of the error
  status: number; // a description of the error
};

// Customs types

export type InteractionReplyFile = {
  attachment: Buffer | string;
  name: string;
};

export type CharacterData = {
  id: number;
  name: string;
  description: string | undefined;
  url: string;
  thumbnail: string | undefined;
  comicsAvailable: number;
  comics: ComicData[];
};

export type ComicData = {
  title: string;
  description: string | undefined;
};

export type ReplyOptions = {
  embeds: EmbedBuilder[];
  components: ActionRowBuilder<ButtonBuilder>[];
};

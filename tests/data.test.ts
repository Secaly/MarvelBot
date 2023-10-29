import { truncateString, formatFetchedData } from '../src/functions/library/data.js';
import { describe, expect, it } from 'vitest';

describe('#truncateString', () => {
  it('should not truncate the string if it is within the maximum size', () => {
    const input = 'A test string';
    const maxSize = 20;
    const result = truncateString(input, maxSize);
    expect(result).toBe(input);
  });

  it('should truncate the string and add "..." to the end', () => {
    const input = 'This is a long string that should be truncated';
    const maxSize = 20;
    const result = truncateString(input, maxSize);
    expect(result).toBe('This is a long st...');
  });

  it('should handle an empty input string', () => {
    const input = '';
    const maxSize = 10;
    const result = truncateString(input, maxSize);
    expect(result).toBe('');
  });

  it('should handle a maxSize of 0 by returning "..."', () => {
    const input = 'This is a test string';
    const maxSize = 0;
    const result = truncateString(input, maxSize);
    expect(result).toBe('...');
  });

  it('should handle an input string shorter than "..." itself', () => {
    const input = 'Short';
    const maxSize = 3;
    const result = truncateString(input, maxSize);
    expect(result).toBe('...');
  });
});

describe('#formatFetchedData', () => {
  it('should format fetched data into a CharacterData object', () => {
    const character = {
      id: 1,
      name: 'Spider-Man',
      description: 'Friendly neighborhood superhero',
      thumbnail: {
        path: 'https://www.example.com/spiderman',
        extension: 'jpg',
      },
      comics: {
        available: 10,
      },
    };
    const comics = [
      {
        id: 100,
        title: 'The Amazing Spider-Man',
      },
    ];

    const expectedCharacterData = {
      id: 1,
      name: 'Spider-Man',
      description: 'Friendly neighborhood superhero',
      url: 'https://www.marvel.com/characters/spider-man',
      thumbnail: 'https://www.example.com/spiderman.jpg',
      comicsAvailable: 10,
      comics: [
        {
          id: 100,
          title: 'The Amazing Spider-Man',
        },
      ],
    };

    const result = formatFetchedData(character, comics);
    expect(result).toEqual(expectedCharacterData);
  });

  it('should handle missing description and thumbnail', () => {
    const character = {
      id: 2,
      name: 'Iron Man',
      comics: {
        available: 5,
      },
    };
    const comics = [];

    const expectedCharacterData = {
      id: 2,
      name: 'Iron Man',
      description: undefined,
      url: 'https://www.marvel.com/characters/iron-man',
      thumbnail: undefined,
      comicsAvailable: 5,
      comics: [],
    };

    const result = formatFetchedData(character, comics);
    expect(result).toEqual(expectedCharacterData);
  });

  it('should handle an empty comics array', () => {
    const character = {
      id: 3,
      name: 'Thor',
      description: 'God of Thunder',
      comics: {
        available: 0,
      },
    };
    const comics = [];

    const expectedCharacterData = {
      id: 3,
      name: 'Thor',
      description: 'God of Thunder',
      url: 'https://www.marvel.com/characters/thor',
      thumbnail: undefined,
      comicsAvailable: 0,
      comics: [],
    };

    const result = formatFetchedData(character, comics);
    expect(result).toEqual(expectedCharacterData);
  });
});

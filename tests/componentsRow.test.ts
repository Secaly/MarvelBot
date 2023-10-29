import { arrowsRow } from '../src/functions/library/componentsRow.js';
import { describe, expect, it } from 'vitest';

describe('#arrowsRow', () => {
  it('should disable the previous button when on the first page', () => {
    const characterName = 'TestCharacter';
    const page = 0;
    const max = 5;
    const row = arrowsRow(characterName, page, max);

    // Get components from the row
    const components = row.components;
    expect(components).not.toBe(undefined);

    if (components) {
      const previousButton = components[0];
      expect(previousButton.data.disabled).toBe(true);
      const nextButton = components[1];
      expect(nextButton.data.disabled).toBe(false);
    }
  });

  it('should disable the next button when on the last page', () => {
    const characterName = 'TestCharacter';
    const page = 4;
    const max = 5;
    const row = arrowsRow(characterName, page, max);

    // Get components from the row
    const components = row.components;
    expect(components).not.toBe(undefined);

    if (components) {
      const previousButton = components[0];
      expect(previousButton.data.disabled).toBe(false);
      const nextButton = components[1];
      expect(nextButton.data.disabled).toBe(true);
    }
  });
});

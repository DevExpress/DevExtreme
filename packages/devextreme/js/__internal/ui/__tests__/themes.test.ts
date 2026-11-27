import {
  describe, expect, it, jest,
} from '@jest/globals';
import { isWebFontLoaded } from '@ts/ui/themes';

describe('themes.isWebFontLoaded', () => {
  const payload = '<img src="x" onerror="window.xssFired = true">';

  const measuredElement = (text: string): HTMLElement => {
    const appendChild = jest.spyOn(document.body, 'appendChild');

    try {
      isWebFontLoaded(text, '400');

      return appendChild.mock.calls[0][0] as HTMLElement;
    } finally {
      appendChild.mockRestore();
    }
  };

  it('measures markup in the text as plain text, not as elements', () => {
    const element = measuredElement(payload);

    expect(element.children).toHaveLength(0);
    expect(element.textContent).toBe(payload);
  });

  it('keeps text that looks like an escaped tag as it is', () => {
    const element = measuredElement('&lt;img src=x onerror=alert(1)&gt;');

    expect(element.children).toHaveLength(0);
    expect(element.textContent).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });
});

import {
  describe,
  expect,
  test,
} from '@jest/globals';
import type { ResponseParams } from '@js/ai/ai';
import { AI } from '@ts/core/ai/core/ai';

describe('AI Integration', () => {
  test('sendRequest is called with correct parameters', (done) => {
    expect.assertions(2);

    const sendRequest = ({ prompt, onChunk }): ResponseParams => {
      expect(prompt).toEqual({
        system: 'You are a translation assistant, who speaks {{lang}} at a native level.',
        user: 'Translate "text" to French language.',
      });

      expect(typeof onChunk).toBe('function');

      return {
        promise: Promise.resolve(),
        abort: (): void => {},
      };
    };

    const ai = new AI({ sendRequest });

    ai.translate(
      { text: 'text', lang: 'French' },
      {
        onComplete: () => done(),
        onChunk: () => {},
      },
    );
  });
});

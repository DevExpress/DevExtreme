import {
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';

import { AI } from '../../core/ai';

describe('AI Integration', () => {
  test('sendRequest is called with correct parameters', (done) => {
    expect.assertions(2);

    const mockSendRequest = jest.fn(({ prompt, onChunk }) => {
      expect(prompt).toEqual({
        system: 'You are a translation assistant.',
        user: 'Translate text to fr language.',
      });

      expect(typeof onChunk).toBe('function');

      return {
        promise: Promise.resolve(),
        abort: jest.fn(),
      };
    });

    const ai = new AI({ sendRequest: mockSendRequest });

    ai.translate(
      { text: 'text', lang: 'fr' },
      {
        onComplete: () => done(),
        onChunk: () => {},
      },
    );
  });
});

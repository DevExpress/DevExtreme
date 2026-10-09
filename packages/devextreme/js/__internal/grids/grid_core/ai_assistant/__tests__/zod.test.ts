import {
  describe, expect, it, jest,
} from '@jest/globals';

import { z } from '../zod';

describe('zod', () => {
  it('should not use eval when a schema is created and parsed', () => {
    const functionSpy = jest.spyOn(globalThis, 'Function');

    z.object({ value: z.string() }).strict().safeParse({ value: 'test' });

    expect(functionSpy).not.toHaveBeenCalled();
    functionSpy.mockRestore();
  });
});

import { describe, expect, it } from '@jest/globals';
import { callOnce } from '@ts/core/utils/call_once';

describe('callOnce', () => {
  it('should call the handler once and return the cached result afterwards', () => {
    let calls = 0;
    const wrapped = callOnce((): object => {
      calls += 1;
      return {};
    });

    const first = wrapped();
    const second = wrapped();

    expect(calls).toBe(1);
    expect(second).toBe(first);
  });

  it('should forward the receiver and the arguments to the first call only', () => {
    const calls: unknown[] = [];
    const wrapped = callOnce(
      function handler(this: { value: number }, a: number, b: number): number {
        calls.push([this, a, b]);
        return this.value + a + b;
      },
    );
    const receiver = { value: 1 };

    expect(wrapped.call(receiver, 2, 3)).toBe(6);
    expect(wrapped.call({ value: 10 }, 20, 30)).toBe(6);
    expect(calls).toEqual([[receiver, 2, 3]]);
  });

  it('should retry the handler when the first call throws', () => {
    let attempt = 0;
    const wrapped = callOnce((): number => {
      attempt += 1;
      if (attempt === 1) {
        throw new Error('first');
      }
      return attempt;
    });

    expect(() => wrapped()).toThrow('first');
    expect(wrapped()).toBe(2);
    expect(wrapped()).toBe(2);
    expect(attempt).toBe(2);
  });
});

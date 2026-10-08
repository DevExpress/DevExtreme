import { describe, expect, it } from '@jest/globals';
import { Locker } from '@ts/core/utils/locker';

describe('Locker', () => {
  it('should report a lock as free until it is obtained', () => {
    const locks = Locker();

    expect(locks.locked('a')).toBe(false);

    locks.obtain('a');

    expect(locks.locked('a')).toBe(true);
    expect(locks.locked('b')).toBe(false);
  });

  it('should keep the lock until every obtain is released', () => {
    const locks = Locker();

    locks.obtain('a');
    locks.obtain('a');
    locks.release('a');

    expect(locks.locked('a')).toBe(true);

    locks.release('a');

    expect(locks.locked('a')).toBe(false);
  });

  it('should throw E0014 when releasing a free lock', () => {
    const locks = Locker();

    expect(() => locks.release('a')).toThrow(/E0014/);

    locks.obtain('a');
    locks.release('a');

    expect(() => locks.release('a')).toThrow(/E0014/);
  });
});

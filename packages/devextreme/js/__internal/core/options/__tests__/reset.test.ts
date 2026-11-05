import { describe, expect, it } from '@jest/globals';
import { Options } from '@ts/core/options/index';

const createOptions = (getDefaults: () => Record<string, unknown>): Options => {
  const options = new Options(getDefaults(), getDefaults(), {}, {});
  options.onChanging(() => {});
  options.onChanged(() => {});
  options.onStartChange(() => {});
  options.onEndChange(() => {});
  return options;
};

describe('Options.reset', () => {
  it('restores a nested value from its initial parent', () => {
    const options = createOptions(() => ({ a: { b: 1 }, b: 'root' }));

    options.option('a.b', 42);
    options.reset('a.b');

    expect(options.option('a.b')).toBe(1);
  });

  it.each([0, '', false, null])('restores a falsy initial value %p', (initial) => {
    const options = createOptions(() => ({ a: { b: initial }, c: initial, b: 'root' }));

    options.option({ a: { b: 42 }, c: 42 });
    options.reset('a.b');
    options.reset('c');

    expect(options.option('a.b')).toBe(initial);
    expect(options.option('c')).toBe(initial);
  });

  it('does not take a root option when the initial parent is missing', () => {
    const options = createOptions(() => ({ c: 2, b: 'root' }));

    options.reset('a.b');

    expect(options.option('a.b')).toBeUndefined();
  });

  it.each([undefined, null, 0, '', false, 5, 'text'])(
    'does not take a root option when the initial parent is %p',
    (parent) => {
      const options = createOptions(() => ({ a: parent, b: 'root' }));

      options.option('a', { b: 42 });
      options.reset('a.b');

      expect(options.option('a.b')).toBeUndefined();
    },
  );

  it('does not take a root option on a deeper path', () => {
    const options = createOptions(() => ({ a: { b: null }, c: 'root' }));

    options.option('a.b', { c: 42 });
    options.reset('a.b.c');

    expect(options.option('a.b.c')).toBeUndefined();
  });
});

import { combineClasses } from '../combine_classes';

describe('unconditional', () => {
  it('unconditional', () => {
    expect(combineClasses({ unconditional: true })).toBe('unconditional');
  });

  it('several conditions', () => {
    expect(combineClasses({ class1: true, class2: true })).toBe('class1 class2');
  });

  it('false conditions', () => {
    expect(combineClasses({ class1: true, class2: false })).toBe('class1');
  });
});

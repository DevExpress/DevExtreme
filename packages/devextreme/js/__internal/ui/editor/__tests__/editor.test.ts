import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';

import type { EditorProperties } from '../editor';
import Editor from '../editor';

interface ReturnScenario {
  scenario: string;
  createValue: () => unknown;
  changedValue: unknown;
}

const createSelfReferencingObject = (id: number): Record<string, unknown> => {
  const value: Record<string, unknown> = { id };

  value.self = value;

  return value;
};

const returnScenarios: ReturnScenario[] = [
  {
    scenario: 'an array',
    createValue: () => [1, 2],
    changedValue: [3],
  },
  {
    scenario: 'an array of plain objects with nested arrays',
    createValue: () => [{ name: 'a', tags: [1, { id: 2 }] }],
    changedValue: [{ name: 'b', tags: [] }],
  },
  {
    scenario: 'a date',
    createValue: () => new Date(2026, 9, 12),
    changedValue: new Date(2026, 9, 13),
  },
  {
    scenario: 'an array of dates',
    createValue: () => [new Date(2026, 9, 12), new Date(2026, 9, 13)],
    changedValue: [],
  },
  {
    scenario: 'an array with an object nested deeper than three levels',
    createValue: () => [{ a: { b: { c: { d: 1 } } } }],
    changedValue: [],
  },
  {
    scenario: 'an array with an object that references itself',
    createValue: () => [createSelfReferencingObject(1)],
    changedValue: [],
  },
];

const disposables: { dispose: () => void }[] = [];

const createEditor = (options: Partial<EditorProperties> = {}): Editor => {
  const element = $('<div>').appendTo(document.body).get(0) as HTMLElement;
  // @ts-expect-error DOMComponent constructor is not typed for direct instantiation
  const instance: Editor = new Editor(element, options);

  disposables.push(instance);

  return instance;
};

describe('Editor isDirty when the value returns to its initial content (T1336605)', () => {
  afterEach(() => {
    disposables.forEach((instance) => instance.dispose());
    disposables.length = 0;
    document.body.innerHTML = '';
  });

  it.each(returnScenarios)('should be false after $scenario returns as a new copy', ({ createValue, changedValue }) => {
    const instance = createEditor({ value: createValue() });

    instance.option('value', changedValue);

    expect(instance.option('isDirty')).toBe(true);

    instance.option('value', createValue());

    expect(instance.option('isDirty')).toBe(false);
  });

  it('should be false when the same invalid date object returns', () => {
    const invalidDate = new Date(NaN);
    const instance = createEditor({ value: invalidDate });

    instance.option('value', new Date(2026, 9, 15));

    expect(instance.option('isDirty')).toBe(true);

    instance.option('value', invalidDate);

    expect(instance.option('isDirty')).toBe(false);
  });

  it('should be true when array items change their order', () => {
    const instance = createEditor({ value: [1, 2] });

    instance.option('value', [2, 1]);

    expect(instance.option('isDirty')).toBe(true);
  });

  it('should be true when an object in an array differs deeper than three levels', () => {
    const instance = createEditor({ value: [{ a: { b: { c: 1 } } }] });

    instance.option('value', [{ a: { b: { c: 2 } } }]);

    expect(instance.option('isDirty')).toBe(true);
  });

  it('should be true when a self-referencing object in an array changes', () => {
    const instance = createEditor({ value: [createSelfReferencingObject(1)] });

    instance.option('value', [createSelfReferencingObject(2)]);

    expect(instance.option('isDirty')).toBe(true);
  });
});

import { describe, expect, it } from '@jest/globals';
import $ from '@js/core/renderer';
import type { DataKey } from '@ts/core/element_data';
import { data as elementData, getData, setData } from '@ts/core/element_data';

interface Item {
  id: number;
}

interface Other {
  name: string;
}

const ITEM_KEY: DataKey<Item> = 'item';

describe('Typed element data', () => {
  it('should read a value written to a node through a wrapper of the node', () => {
    const element = document.createElement('div');
    const item: Item = { id: 1 };

    setData(element, ITEM_KEY, item);

    expect(getData($(element), ITEM_KEY)).toBe(item);
  });

  it('should read a value written through a wrapper from the node', () => {
    const element = document.createElement('div');
    const item: Item = { id: 2 };

    setData($(element), ITEM_KEY, item);

    expect(getData(element, ITEM_KEY)).toBe(item);
  });

  it('should share the storage with renderer data() and element_data', () => {
    const $element = $('<div>');
    const item: Item = { id: 3 };

    $element.data('item', item);

    expect(getData($element, ITEM_KEY)).toBe(item);
    expect(elementData($element.get(0), 'item')).toBe(item);
  });

  it('should write only to the first element of a set, as renderer data() does', () => {
    const $elements = $([document.createElement('div'), document.createElement('div')]);
    const item: Item = { id: 4 };

    setData($elements, ITEM_KEY, item);

    expect(getData($elements.eq(0), ITEM_KEY)).toBe(item);
    expect(getData($elements.eq(1), ITEM_KEY)).toBeUndefined();
  });

  it('should return undefined and not throw for an empty target', () => {
    const item: Item = { id: 5 };

    expect(() => setData($(), ITEM_KEY, item)).not.toThrow();
    expect(() => setData(null, ITEM_KEY, item)).not.toThrow();
    expect(getData($(), ITEM_KEY)).toBeUndefined();
    expect(getData(undefined, ITEM_KEY)).toBeUndefined();
  });

  it('should bind the value type to the key at compile time', () => {
    const element = document.createElement('div');
    const other: Other = { name: 'other' };

    // @ts-expect-error a value of another type cannot be written under the key
    setData(element, ITEM_KEY, other);

    // @ts-expect-error a key of one type cannot be read as a key of another type
    const otherKey: DataKey<Other> = ITEM_KEY;

    const value: Item | undefined = getData(element, ITEM_KEY);

    expect(otherKey).toBe('item');
    expect(value).toBe(other);
  });
});

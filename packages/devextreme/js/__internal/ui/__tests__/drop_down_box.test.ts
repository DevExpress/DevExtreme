import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterWidth } from '@js/core/utils/size';
import type { Properties } from '@js/ui/drop_down_box';
import DropDownBox from '@js/ui/drop_down_box';

import { DropDownEditorModel } from './__mock__/model/drop_down_editor';

const FIELD_WIDTH = 200;

interface NonPlainValueScenario {
  name: string;
  createValue: (key: number) => unknown;
}

class KeyHolder {
  readonly #key: number;

  constructor(key: number) {
    this.#key = key;
  }

  getKey(): number {
    return this.#key;
  }
}

const nonPlainValueScenarios: NonPlainValueScenario[] = [
  { name: 'Map', createValue: (key) => new Map([[key, 'value']]) },
  { name: 'Set', createValue: (key) => new Set([key]) },
  { name: 'RegExp', createValue: (key) => new RegExp(String(key)) },
  { name: 'File', createValue: (key) => new File([String(key)], 'file.txt') },
  { name: 'class instance with a private field', createValue: (key) => new KeyHolder(key) },
];

const dropDownBoxes: DropDownBox[] = [];

const createDropDownBox = (options: Partial<Properties> = {}): DropDownEditorModel => {
  const $element = $('<div>').appendTo(document.body);

  const instance = new DropDownBox($element.get(0) as HTMLElement, {
    dataSource: [{ id: 1, text: 'Item one' }],
    valueExpr: 'id',
    displayExpr: 'text',
    value: 1,
    contentTemplate: (): dxElementWrapper => $('<div>').text('Hello world'),
    ...options,
  });

  dropDownBoxes.push(instance);

  return new DropDownEditorModel($element.get(0) as HTMLElement);
};

describe('DropDownBox', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    dropDownBoxes.forEach((instance) => instance.dispose());
    dropDownBoxes.length = 0;
    document.body.innerHTML = '';
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('drop-down popup width with deferRendering disabled (T1332185)', () => {
    it('should size the popup to the field when opened after the field gets its width', () => {
      const dropDownBox = createDropDownBox({ deferRendering: false });
      jest.runAllTimers();

      dropDownBox.getElement().style.width = `${FIELD_WIDTH}px`;

      dropDownBox.open();
      jest.runAllTimers();

      expect(getOuterWidth(dropDownBox.getOverlay().getElement())).toBe(FIELD_WIDTH);
    });
  });

  describe('object value (T1336605)', () => {
    const OBJECT_ITEMS = [{ id: 1, text: 'Item one' }, { id: 2, text: 'Item two' }];
    const OBJECT_OPTIONS = { dataSource: OBJECT_ITEMS, valueExpr: 'this' };

    it('should restore the initial object on reset after another object was selected', () => {
      createDropDownBox({ ...OBJECT_OPTIONS, value: OBJECT_ITEMS[0] });
      const [instance] = dropDownBoxes;

      instance.option('value', OBJECT_ITEMS[1]);

      expect(instance.option('isDirty')).toBe(true);

      instance.reset();

      expect(instance.option('value')).toEqual(OBJECT_ITEMS[0]);
      expect(instance.option('isDirty')).toBe(false);
    });

    it('should be dirty when a field deeper than three levels changes', () => {
      createDropDownBox({ valueExpr: 'this', value: { a: { b: { c: 1 } } } });
      const [instance] = dropDownBoxes;

      instance.option('value', { a: { b: { c: 2 } } });

      expect(instance.option('isDirty')).toBe(true);
    });

    it.each(nonPlainValueScenarios)('should be dirty when the value changes to another $name', ({ createValue }) => {
      createDropDownBox({ valueExpr: 'this', value: createValue(1) });
      const [instance] = dropDownBoxes;

      instance.option('value', createValue(2));

      expect(instance.option('isDirty')).toBe(true);
    });

    it('should replace the object value instead of merging the fields of the previous one', () => {
      createDropDownBox({ ...OBJECT_OPTIONS, value: OBJECT_ITEMS[0] });
      const [instance] = dropDownBoxes;

      instance.option('value', { id: 2 });

      expect(instance.option('value')).toEqual({ id: 2 });
    });
  });
});

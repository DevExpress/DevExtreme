import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import CustomStore from '@js/data/custom_store';
import type { Properties } from '@js/ui/tag_box';
import TagBox from '@js/ui/tag_box';

import { TagBoxModel } from './__mock__/model/tag_box';

interface Employee {
  ID: number;
  FullName: string;
}

const EMPLOYEES: Employee[] = [
  { ID: 1, FullName: 'John Heart' },
  { ID: 2, FullName: 'Samantha Bright' },
  { ID: 3, FullName: 'Arthur Miller' },
];

const LOAD_DELAY = 100;

const resolveLater = <T>(result: T): DeferredObj<T> => {
  const deferred = Deferred<T>();

  setTimeout(() => {
    deferred.resolve(result);
  }, LOAD_DELAY);

  return deferred;
};

const createDelayedStore = (): CustomStore => new CustomStore({
  key: 'ID',
  load: () => resolveLater(EMPLOYEES).promise(),
  byKey: (key: number) => resolveLater(EMPLOYEES.find((employee) => employee.ID === key)).promise(),
});

const tagBoxes: TagBox[] = [];

const createTagBox = (options: Partial<Properties> = {}): TagBoxModel => {
  const $element = $('<div>').appendTo(document.body);

  const instance = new TagBox($element.get(0) as HTMLElement, {
    dataSource: createDelayedStore(),
    valueExpr: 'ID',
    displayExpr: 'FullName',
    showSelectionControls: true,
    deferRendering: false,
    ...options,
  });

  tagBoxes.push(instance);

  return new TagBoxModel($element.get(0) as HTMLElement);
};

describe('TagBox', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    tagBoxes.forEach((instance) => instance.dispose());
    tagBoxes.length = 0;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  describe('isDirty when the value order differs from the data order (T1336605)', () => {
    it('should stay false after the delayed data load selects the value items in the list', () => {
      const tagBox = createTagBox({ value: [3, 2] });

      jest.runAllTimers();

      const tagTexts = Array.from(tagBox.getTags()).map((tag) => tag.textContent);

      expect(tagTexts).toEqual(['Arthur Miller', 'Samantha Bright']);
      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(tagBox.getInstance().option('isDirty')).toBe(false);
    });

    it('should not raise onValueChanged when the delayed data load selects the value items in the list', () => {
      const valueChangedHandler = jest.fn();
      const tagBox = createTagBox({ value: [3, 2], onValueChanged: valueChangedHandler });

      jest.runAllTimers();

      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(valueChangedHandler).not.toHaveBeenCalled();
    });
  });

  describe('value with a key missing from the data (T1336605)', () => {
    it('should keep every value item after the delayed data load', () => {
      const tagBox = createTagBox({ value: [2, 99] });

      jest.runAllTimers();

      const tagTexts = Array.from(tagBox.getTags()).map((tag) => tag.textContent);

      expect(tagTexts).toEqual(['Samantha Bright']);
      expect(tagBox.getValue()).toEqual([2, 99]);
    });
  });
});

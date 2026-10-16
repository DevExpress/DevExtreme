import {
  afterEach, beforeAll, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import CustomStore from '@js/data/custom_store';
import type { Properties as FormProperties } from '@js/ui/form';
import Form from '@js/ui/form';
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

const forms: Form[] = [];

const createFormWithTagBox = (options: Partial<FormProperties> = {}): Form => {
  const $element = $('<div>').appendTo(document.body);

  const form = new Form($element.get(0) as HTMLElement, {
    items: [{
      dataField: 'employees',
      editorType: 'dxTagBox',
      editorOptions: {
        dataSource: createDelayedStore(),
        valueExpr: 'ID',
        displayExpr: 'FullName',
        showSelectionControls: true,
        deferRendering: false,
      },
    }],
    ...options,
  });

  forms.push(form);

  return form;
};

describe('TagBox', () => {
  beforeAll(() => {
    fx.off = true;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    tagBoxes.forEach((instance) => instance.dispose());
    tagBoxes.length = 0;
    forms.forEach((form) => form.dispose());
    forms.length = 0;
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  describe('isDirty when the value order differs from the data order (T1336605)', () => {
    it('should stay false without replacing the value after the delayed data load selects the value items in the list', () => {
      const tagBox = createTagBox({ value: [3, 2] });
      const initialValue = tagBox.getValue();

      jest.runAllTimers();

      const tagTexts = Array.from(tagBox.getTags()).map((tag) => tag.textContent);

      expect(tagTexts).toEqual(['Arthur Miller', 'Samantha Bright']);
      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(tagBox.getValue()).toBe(initialValue);
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

  describe('isDirty in other scenarios of the delayed data load (T1336605)', () => {
    it('should stay false without replacing the value when the list is first rendered on open', () => {
      const valueChangedHandler = jest.fn();
      const tagBox = createTagBox({
        value: [3, 2],
        deferRendering: true,
        onValueChanged: valueChangedHandler,
      });
      const initialValue = tagBox.getValue();

      jest.runAllTimers();
      tagBox.getInstance().open();
      jest.runAllTimers();

      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(tagBox.getValue()).toBe(initialValue);
      expect(tagBox.getInstance().option('isDirty')).toBe(false);
      expect(valueChangedHandler).not.toHaveBeenCalled();
    });

    it('should stay false without replacing the value for object values with search enabled', () => {
      const tagBox = createTagBox({
        value: [{ ...EMPLOYEES[2] }, { ...EMPLOYEES[1] }],
        valueExpr: 'this',
        searchEnabled: true,
      });
      const initialValue = tagBox.getValue();

      jest.runAllTimers();

      const tagTexts = Array.from(tagBox.getTags()).map((tag) => tag.textContent);

      expect(tagTexts).toEqual(['Arthur Miller', 'Samantha Bright']);
      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(tagBox.getValue()).toBe(initialValue);
      expect(tagBox.getInstance().option('isDirty')).toBe(false);
    });

    it('should keep the form pristine without replacing the field value inside dxForm', () => {
      const initialValue = [3, 2];
      const form = createFormWithTagBox({ formData: { employees: initialValue } });

      jest.runAllTimers();

      const tagBox = new TagBoxModel(form.getEditor('employees')?.element() as HTMLElement);

      expect(tagBox.getSelectedListItems()).toHaveLength(2);
      expect(tagBox.getValue()).toBe(initialValue);
      expect(form.option('isDirty')).toBe(false);
    });

    it('should be dirty and raise onValueChanged once when another item is selected after the load', () => {
      const valueChangedHandler = jest.fn();
      const tagBox = createTagBox({ value: [3, 2], onValueChanged: valueChangedHandler });

      jest.runAllTimers();
      tagBox.clickListItem(0);

      expect(tagBox.getValue()).toEqual([3, 2, 1]);
      expect(tagBox.getInstance().option('isDirty')).toBe(true);
      expect(valueChangedHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('value with a key missing from the data (T1336605)', () => {
    it('should keep every value item after the delayed data load', () => {
      const tagBox = createTagBox({ value: [2, 99] });

      jest.runAllTimers();

      const tagTexts = Array.from(tagBox.getTags()).map((tag) => tag.textContent);

      expect(tagBox.getValue()).toEqual([2, 99]);
      expect(tagTexts).toEqual(['Samantha Bright']);
    });
  });
});

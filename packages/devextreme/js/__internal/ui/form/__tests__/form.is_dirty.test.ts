import '@js/ui/calendar';
import '@js/ui/date_box';
import '@js/ui/date_range_box';
import '@js/ui/drop_down_box';
import '@js/ui/lookup';
import '@js/ui/radio_group';
import '@js/ui/range_slider';
import '@js/ui/select_box';
import '@js/ui/tag_box';

import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import $ from '@js/core/renderer';
import type { FormItemComponent, Properties } from '@js/ui/form';
import Form from '@js/ui/form';

interface Item {
  id: number;
  text: string;
}

interface ObjectUpdateScenario {
  editorType: FormItemComponent;
  way: string;
  update: (form: Form, value: Item) => void;
}

interface ReturnScenario {
  editorType: FormItemComponent;
  editorOptions?: Record<string, unknown>;
  createValue: () => unknown;
  changedValue: unknown;
}

const FIELD = 'field';

const OBJECT_VALUE_EDITORS: FormItemComponent[] = ['dxSelectBox', 'dxLookup', 'dxDropDownBox', 'dxRadioGroup'];

const updateWays: Pick<ObjectUpdateScenario, 'way' | 'update'>[] = [
  { way: 'updateData', update: (form, value): void => { form.updateData(FIELD, value); } },
  { way: 'option(formData.field)', update: (form, value): void => { form.option(`formData.${FIELD}`, value); } },
];

const objectUpdateScenarios: ObjectUpdateScenario[] = OBJECT_VALUE_EDITORS
  .flatMap((editorType) => updateWays.map((way) => ({ editorType, ...way })));

const returnScenarios: ReturnScenario[] = [
  {
    editorType: 'dxCalendar',
    createValue: () => new Date(2026, 9, 12),
    changedValue: new Date(2026, 9, 13),
  },
  {
    editorType: 'dxDateBox',
    createValue: () => new Date(2026, 9, 12),
    changedValue: new Date(2026, 9, 13),
  },
  {
    editorType: 'dxTagBox',
    editorOptions: { items: ['one', 'two'] },
    createValue: () => ['one'],
    changedValue: ['two'],
  },
  {
    editorType: 'dxDropDownBox',
    editorOptions: { dataSource: [{ id: 1 }, { id: 2 }], valueExpr: 'id' },
    createValue: () => [1],
    changedValue: [2],
  },
  {
    editorType: 'dxRangeSlider',
    createValue: () => [10, 50],
    changedValue: [20, 60],
  },
  {
    editorType: 'dxDateRangeBox',
    createValue: () => [new Date(2026, 9, 12), new Date(2026, 9, 13)],
    changedValue: [new Date(2026, 9, 14), new Date(2026, 9, 15)],
  },
];

const createItems = (): Item[] => [{ id: 1, text: 'one' }, { id: 2, text: 'two' }];

const forms: Form[] = [];

const createForm = (options: Partial<Properties>): Form => {
  const $element = $('<div>').appendTo(document.body);
  const form = new Form($element.get(0) as HTMLElement, options);

  forms.push(form);

  return form;
};

describe('Form', () => {
  afterEach(() => {
    forms.forEach((form) => { form.dispose(); });
    forms.length = 0;
    document.body.innerHTML = '';
  });

  describe('isDirty (T1336605)', () => {
    it.each(objectUpdateScenarios)('should be dirty after $way sets another object to $editorType', ({ editorType, update }) => {
      const items = createItems();
      const form = createForm({
        formData: { [FIELD]: items[0] },
        items: [{
          dataField: FIELD,
          editorType,
          editorOptions: {
            items, dataSource: items, displayExpr: 'text', valueExpr: 'this',
          },
        }],
      });
      const editor = form.getEditor(FIELD);

      update(form, items[1]);

      expect(editor?.option('value')).toBe(items[1]);
      expect(editor?.option('isDirty')).toBe(true);
      expect(form.option('isDirty')).toBe(true);
    });

    it.each(returnScenarios)('should be pristine after $editorType gets a value equal to the initial one as a new reference', ({
      editorType, editorOptions, createValue, changedValue,
    }) => {
      const form = createForm({
        formData: { [FIELD]: createValue() },
        items: [{ dataField: FIELD, editorType, editorOptions }],
      });

      form.updateData(FIELD, changedValue);

      expect(form.option('isDirty')).toBe(true);

      form.updateData(FIELD, createValue());

      expect(form.option('isDirty')).toBe(false);
    });
  });
});

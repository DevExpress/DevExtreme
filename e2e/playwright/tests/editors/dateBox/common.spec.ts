import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';
import type { EditorStyle } from 'devextreme/common';
import type { DatePickerType, DateType, Properties } from 'devextreme/ui/date_box';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, insertStylesheetRulesToPage, removeClassAttribute, setClassAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const DATEBOX_CLASS = 'dx-datebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';

const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
const pickerTypes: DatePickerType[] = ['calendar', 'list', 'native', 'rollers'];
const types: DateType[] = ['date', 'datetime', 'time'];

const createDateBox = async (page: Page, options?: Properties): Promise<string> => {
  const id = `dx${randomUUID()}`;

  await appendElementTo(page, '#container', 'div', id);
  await createWidget(page, 'dxDateBox', {
    width: 220,
    label: 'label text',
    showClearButton: true,
    value: new Date(2021, 9, 17, 16, 34),
    ...options,
  }, `#${id}`);

  return id;
};

test.describe('DateBox render', () => {
  test('DateBox styles', async ({ page }) => {
    const ids: string[] = [];

    await insertStylesheetRulesToPage(page, `.${DATEBOX_CLASS} { display: inline-block; margin: 5px; }`);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        const options = {
          stylingMode,
          type,
        };

        for (const pickerType of pickerTypes) {
          ids.push(await createDateBox(page, { ...options, pickerType }));
        }

        ids.push(await createDateBox(page, { ...options, rtlEnabled: true }));
      }
    }

    await testScreenshot(page, 'Datebox.png');

    for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS]) {
      for (const id of ids) {
        await setClassAttribute(page, `#${id}`, state);
      }

      await testScreenshot(page, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')}.png`);

      for (const id of ids) {
        await removeClassAttribute(page, `#${id}`, state);
      }
    }
  });
});

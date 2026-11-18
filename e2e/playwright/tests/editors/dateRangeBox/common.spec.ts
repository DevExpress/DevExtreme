import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';
import type { EditorStyle, LabelMode } from 'devextreme/common';
import type { Properties as DateRangeBoxProperties } from 'devextreme/ui/date_range_box';
import type { Properties as DropDownEditorProperties } from 'devextreme/ui/drop_down_editor/ui.drop_down_editor';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, insertStylesheetRulesToPage, setAttribute, setClassAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import DateRangeBox from '../../../models/dateRangeBox';

const DATERANGEBOX_CLASS = 'dx-daterangebox';
const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const HOVER_STATE_CLASS = 'dx-state-hover';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
const labelModes: LabelMode[] = ['static', 'floating', 'hidden', 'outside'];

const TEST_VALUE = [new Date(2021, 9, 17, 16, 34), new Date(2021, 9, 18, 16, 34)];

const createDateRangeBox = async (
  page: Page,
  options?: DateRangeBoxProperties,
  state?: string,
): Promise<string> => {
  const id = `dx${randomUUID()}`;

  await appendElementTo(page, '#container', 'div', id);

  await createWidget(page, 'dxDateRangeBox', {
    width: 500,
    labelMode: 'static',
    endDateLabel: 'static',
    startDateLabel: 'qwertyQWERTYg',
    showClearButton: true,
    ...options,
  }, `#${id}`);

  if (state) {
    await setClassAttribute(page, `#${id}`, state);
    await setClassAttribute(page, `#${id} .dx-start-datebox`, state);
  }

  return id;
};

test.describe('DateRangeBox render', () => {
  test('DateRangeBox styles', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `.${DATERANGEBOX_CLASS} { display: inline-flex; margin: 5px; }`);

    for (const stylingMode of stylingModes) {
      for (const state of [
        DROP_DOWN_EDITOR_ACTIVE_CLASS,
        FOCUSED_STATE_CLASS,
        HOVER_STATE_CLASS,
        READONLY_STATE_CLASS,
        DISABLED_STATE_CLASS,
      ]) {
        await createDateRangeBox(page, { value: TEST_VALUE, stylingMode }, state);
      }
    }

    await createDateRangeBox(page, { value: TEST_VALUE, rtlEnabled: true });
    await createDateRangeBox(page, { value: TEST_VALUE, isValid: false });

    await testScreenshot(page, 'DateRangeBox styles.png', { element: '#container' });
  });

  test('DateRangeBox with buttons container', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container { display: flex; flex-wrap: wrap; gap: 4px; }');

    const testButtons: DropDownEditorProperties['buttons'][] = [
      ['clear'],
      [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
      ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
      [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'dropDown'],
    ];

    for (const buttons of testButtons) {
      await createDateRangeBox(page, {
        value: TEST_VALUE,
        buttons,
      });
      await createDateRangeBox(page, {
        value: TEST_VALUE,
        buttons,
        rtlEnabled: true,
      });
    }

    await testScreenshot(page, 'DateRangeBox with buttons container.png', { element: '#container' });
  });

  labelModes.forEach((labelMode) => {
    test(`Custom placeholders and labels appearance, labelMode=${labelMode}`, async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'width: 800px; height: 300px; padding-top: 10px;');

      const id = await createDateRangeBox(page, {
        labelMode,
        width: 600,
        openOnFieldClick: false,
        startDateLabel: 'first date',
        endDateLabel: 'second date',
        startDatePlaceholder: 'enter start date',
        endDatePlaceholder: 'enter end date',
      });

      await appendElementTo(page, '#container', 'div', id);

      const dateRangeBox = new DateRangeBox(page, `#${id}`);

      await testScreenshot(page, `Placeholder and label by default labelMode=${labelMode}.png`, { element: '#container' });

      await dateRangeBox.getStartDateBox().input.click();

      await testScreenshot(page, `Placeholder and label on start date input focus labelMode=${labelMode}.png`, { element: '#container' });

      await dateRangeBox.getEndDateBox().input.click();

      await testScreenshot(page, `Placeholder and label on end date input labelMode=${labelMode} focus.png`, { element: '#container' });
    });
  });
});

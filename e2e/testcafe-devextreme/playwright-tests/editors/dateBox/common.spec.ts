import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setClassAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateBox render', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const DATEBOX_CLASS = 'dx-datebox';
  const DROP_DOWN_EDITOR_ACTIVE_CLASS = 'dx-dropdowneditor-active';
  const FOCUSED_STATE_CLASS = 'dx-state-focused';

  const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
  const pickerTypes: DatePickerType[] = ['calendar', 'list', 'native', 'rollers'];
  const types: DateType[] = ['date', 'datetime', 'time'];

  const createDateBox = async (options?: Properties, state?: string): Promise<string> => {
    const id = `${`dx${new Guid()}`}`;

    await appendElementTo(page, '#container', 'div', id, {});
    await createWidget(page, 'dxDateBox', {
      width: 220,
      label: 'label text',
      showClearButton: true,
      value: new Date(2021, 9, 17, 16, 34),
      ...options,
    }, `#${id}`);

    if (state) {
      await setClassAttribute(page, `#${id}`, state);
    }

    return id;
  };

  test('DateBox styles', async ({ page }) => {

    await testScreenshot(page, 'Datebox.png');

    for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS] as any[]) {
      for (const id of t.ctx.ids) {
        await setClassAttribute(page, `#${id}`, state);
      }

      await testScreenshot(page, `Datebox ${state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '')}.png`);

      for (const id of t.ctx.ids) {
        await removeClassAttribute(page.locator(`#${id}`), state);
      }
    }

    });.before(async ({ page }) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(page, `.${DATEBOX_CLASS} { display: inline-block; margin: 5px; }`);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        const options = {
          stylingMode,
          type,
        };
        for (const pickerType of pickerTypes) {
          const id = await createDateBox({ ...options, pickerType });

          t.ctx.ids.push(id);
        }

        const id = await createDateBox({ ...options, rtlEnabled: true });
        t.ctx.ids.push(id);
      }
    }
  });
});

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

  const stylingModes = ['outlined', 'underlined', 'filled'];
  const pickerTypes = ['calendar', 'list', 'native', 'rollers'];
  const types = ['date', 'datetime', 'time'];

  test('DateBox styles', async ({ page }) => {
    const ids: string[] = [];

    await insertStylesheetRulesToPage(page, `.${DATEBOX_CLASS} { display: inline-block; margin: 5px; }`);

    for (const stylingMode of stylingModes) {
      for (const type of types) {
        for (const pickerType of pickerTypes) {
          const id = `db-${stylingMode}-${type}-${pickerType}`;
          ids.push(id);

          await page.evaluate(({ parentSel, elId }) => {
            const div = document.createElement('div');
            div.id = elId;
            document.querySelector(parentSel)?.appendChild(div);
          }, { parentSel: '#container', elId: id });

          await createWidget(page, 'dxDateBox', {
            width: 220,
            label: 'label text',
            showClearButton: true,
            value: new Date(2021, 9, 17, 16, 34),
            stylingMode,
            type,
            pickerType,
          }, `#${id}`);
        }

        const rtlId = `db-${stylingMode}-${type}-rtl`;
        ids.push(rtlId);

        await page.evaluate(({ parentSel, elId }) => {
          const div = document.createElement('div');
          div.id = elId;
          document.querySelector(parentSel)?.appendChild(div);
        }, { parentSel: '#container', elId: rtlId });

        await createWidget(page, 'dxDateBox', {
          width: 220,
          label: 'label text',
          showClearButton: true,
          value: new Date(2021, 9, 17, 16, 34),
          stylingMode,
          type,
          rtlEnabled: true,
        }, `#${rtlId}`);
      }
    }

    await testScreenshot(page, 'Datebox.png');

    for (const state of [DROP_DOWN_EDITOR_ACTIVE_CLASS, FOCUSED_STATE_CLASS]) {
      for (const id of ids) {
        await setClassAttribute(page, `#${id}`, state);
      }

      const stateName = state.replaceAll('dx-', '').replaceAll('dropdowneditor-', '').replaceAll('state-', '');
      await testScreenshot(page, `Datebox ${stateName}.png`);

      for (const id of ids) {
        await page.evaluate(({ sel, cls }) => {
          document.querySelector(sel)?.classList.remove(cls);
        }, { sel: `#${id}`, cls: state });
      }
    }
  });
});

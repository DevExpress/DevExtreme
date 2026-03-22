import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, setClassAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('DateRangeBox render', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

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
    options?: DateRangeBoxProperties,
    state?: string,
  ): Promise<string> => {
    const id = `${`dx${new Guid()}`}`;

    await appendElementTo(page, '#container', 'div', id, { });

    const config: any = {
      width: 500,
      labelMode: 'static',
      endDateLabel: 'static',
      startDateLabel: 'qwertyQWERTYg',
      showClearButton: true,
      ...options,
    };

    await createWidget(page, 'dxDateRangeBox', config, `#${id}`);

    if (state) {
      await setClassAttribute(page, `#${id}`, state);
      await setClassAttribute(page, `#${id} .dx-start-datebox`, state);
    }

    return id;
  };

  test('DateRangeBox styles', async ({ page }) => {

    await insertStylesheetRulesToPage(page, `.${DATERANGEBOX_CLASS} { display: inline-flex; margin: 5px; }`);

    for (const stylingMode of stylingModes) {
      for (const state of [
        DROP_DOWN_EDITOR_ACTIVE_CLASS,
        FOCUSED_STATE_CLASS,
        HOVER_STATE_CLASS,
        READONLY_STATE_CLASS,
        DISABLED_STATE_CLASS,
      ] as any[]
      ) {
        await createDateRangeBox({ value: TEST_VALUE, stylingMode }, state);
      }
    }

    await createDateRangeBox({ value: TEST_VALUE, rtlEnabled: true });
    await createDateRangeBox({ value: TEST_VALUE, isValid: false });

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
      await createDateRangeBox({
        value: TEST_VALUE,
        buttons,
      });
      await createDateRangeBox({
        value: TEST_VALUE,
        buttons,
        rtlEnabled: true,
      });
    }

    await testScreenshot(page, 'DateRangeBox with buttons container.png', { element: '#container' });

    });

  labelModes.forEach((labelMode) => {
    test('Custom placeholders and labels appearance', async ({ page }) => {
      const dateRangeBox = page.locator(`#${t.ctx.id}`);

      await testScreenshot(page, `Placeholder and label by default labelMode=${labelMode}.png`, { element: '#container' });

      await page.click(dateRangeBox.getStartDateBox().input);

      await testScreenshot(page, `Placeholder and label on start date input focus labelMode=${labelMode}.png`, { element: '#container' });

      await page.click(dateRangeBox.getEndDateBox().input);

      await testScreenshot(page, `Placeholder and label on end date input labelMode=${labelMode} focus.png`, { element: '#container' });

    });.before(async ({ page }) => {
      await setAttribute(page, '#container', 'style', 'width: 800px; height: 300px; padding-top: 10px;');

      t.ctx.id = await createDateRangeBox({
        labelMode,
        width: 600,
        openOnFieldClick: false,
        startDateLabel: 'first date',
        endDateLabel: 'second date',
        startDatePlaceholder: 'enter start date',
        endDatePlaceholder: 'enter end date',
      });
      await appendElementTo(page, '#container', 'div', t.ctx.id);
    });
  });
});

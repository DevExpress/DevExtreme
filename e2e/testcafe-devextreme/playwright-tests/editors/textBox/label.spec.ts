import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute, setClassAttribute, insertStylesheetRulesToPage, removeStylesheetRulesFromPage, isMaterial } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TextBox_Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const visibleLabelModes = ['floating', 'static', 'outside'];
  const stylingModes = ['outlined', 'underlined', 'filled'];
  const buttonsList: (string | any)[][] = [
    ['clear'],
    ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }],
    [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear'],
    ['clear', { name: 'custom', location: 'before', options: { icon: 'home' } }],
  ];

  const TEXTBOX_CLASS = 'dx-textbox';
  const HOVER_STATE_CLASS = 'dx-state-hover';
  const FOCUSED_STATE_CLASS = 'dx-state-focused';
  const READONLY_STATE_CLASS = 'dx-state-readonly';
  const INVALID_STATE_CLASS = 'dx-invalid';

  const createTextBox = async (page: any, options?: any, state?: string): Promise<string> => {
    const id = `tb-${Math.random().toString(36).slice(2, 8)}`;

    await appendElementTo(page, '#container', 'div', id, {});
    await createWidget(page, 'dxTextBox', {
      labelMode: 'floating',
      stylingMode: 'outlined',
      text: 'Text',
      label: 'Label Text',
      ...options,
    }, `#${id}`);

    if (state) {
      await setClassAttribute(page, `#${id}`, state);
    }

    return id;
  };

  [
    { labelMode: 'static' },
    { labelMode: 'floating' },
    { labelMode: 'outside' },
  ].forEach(({ labelMode }) => {
    test.skip(`Label max-width should be changed after container width was changed, labelMode is ${labelMode}`, async ({ page }) => {
      // skipped: requires .before() setup with t.ctx, TextBox page object with getLabel
    });
  });

  test('Textbox render', async ({ page }) => {
    for (const stylingMode of stylingModes) {
      for (const labelMode of visibleLabelModes) {
        for (const placeholder of ['Placeholder', '']) {
          await createTextBox(page, {
            text: undefined,
            placeholder,
            stylingMode,
            labelMode,
          });
        }

        await createTextBox(page, { text: 'Text value' });
        await createTextBox(page, { rtlEnabled: true });
      }
      for (const placeholder of ['Placeholder', '']) {
        await createTextBox(page, {
          text: undefined,
          placeholder,
          stylingMode,
          label: undefined,
        });
      }
      await createTextBox(page, { label: undefined, text: 'Text value' });
      await createTextBox(page, { label: undefined, rtlEnabled: true });
    }

    await insertStylesheetRulesToPage(page, `.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 60px; margin: 5px; }`);

    await testScreenshot(page, 'Textbox render with limited width.png', { element: '#container' });

    await removeStylesheetRulesFromPage(page);

    await insertStylesheetRulesToPage(page, `.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 260px; margin: 5px; }`);

    await testScreenshot(page, 'Textbox render.png');
  });

  test('Textbox states', async ({ page }) => {
    const states = [
      HOVER_STATE_CLASS,
      FOCUSED_STATE_CLASS,
      READONLY_STATE_CLASS,
      INVALID_STATE_CLASS,
      `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`,
    ];
    for (const state of states) {
      for (const placeholder of ['Placeholder', '']) {
        await createTextBox(page, {
          text: undefined,
          placeholder,
        }, state);
      }

      await createTextBox(page, { text: 'Text value' }, state);
      await createTextBox(page, { rtlEnabled: true }, state);
    }

    await insertStylesheetRulesToPage(page, `.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 260px; margin: 5px; }`);

    await testScreenshot(page, 'Textbox states.png', { element: '#container' });
  });

  test('Textbox with buttons container', async ({ page }) => {
    if (isMaterial()) {
      await insertStylesheetRulesToPage(page, '#container .dx-widget { font-family: sans-serif }');
    }

    for (const stylingMode of stylingModes) {
      for (const buttons of buttonsList) {
        await createTextBox(page, { stylingMode, buttons, showClearButton: true });
        await createTextBox(page, {
          stylingMode, buttons, showClearButton: true, isValid: false,
        });
      }
    }

    await insertStylesheetRulesToPage(page, '#container { display: flex; flex-wrap: wrap; gap: 4px; }');

    await testScreenshot(page, 'Textbox with buttons container.png');
  });

  stylingModes.forEach((stylingMode) => {
    test.skip(`TextBox should not be hovered after hover of outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      // skipped: requires TextBox page object with getLabelSpan, isHovered
    });

    test.skip(`TextBox should be focused after click on outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      // skipped: requires TextBox page object with getLabelSpan, isFocused
    });
  });
});

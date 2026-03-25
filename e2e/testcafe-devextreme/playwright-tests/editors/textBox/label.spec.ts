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

    await page.evaluate(({ parentSel, elId }: any) => {
      const div = document.createElement('div');
      div.id = elId;
      document.querySelector(parentSel)?.appendChild(div);
    }, { parentSel: '#container', elId: id });

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
    test(`Label max-width should be changed after container width was changed, labelMode is ${labelMode}`, async ({ page }) => {
      const initialWidth = 100;
      const deltaWidth = 300;

      await createWidget(page, 'dxTextBox', {
        width: initialWidth,
        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        labelMode,
      });

      const labelMaxWidth = await page.evaluate(() => {
        const label = document.querySelector('#container .dx-label');
        if (!label) return 'none';
        return getComputedStyle(label).maxWidth;
      });

      const containerId = await page.evaluate(() => document.querySelector('#container')?.getAttribute('id'));

      await setStyleAttribute(page, '#container', `width: ${initialWidth + deltaWidth}px;`);

      const newLabelMaxWidth = await page.evaluate(() => {
        const label = document.querySelector('#container .dx-label');
        if (!label) return 'none';
        return getComputedStyle(label).maxWidth;
      });

      if (labelMode === 'outside') {
        expect(labelMaxWidth).toBe('none');
        expect(newLabelMaxWidth).toBe('none');
      } else {
        const initialPx = parseFloat(labelMaxWidth);
        const newPx = parseFloat(newLabelMaxWidth);
        expect(newPx).toBeGreaterThan(initialPx);
        expect(Math.abs(newPx - initialPx - deltaWidth)).toBeLessThanOrEqual(2);
      }
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
    test(`TextBox should not be hovered after hover of outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      await createWidget(page, 'dxTextBox', {
        value: 'text',
        label: 'Label text',
        labelMode: 'outside',
        stylingMode,
        width: 500,
      });

      const labelSpan = page.locator('#container .dx-label span');
      await labelSpan.hover();

      const isHovered = await page.evaluate(() => {
        return document.querySelector('#container')?.classList.contains('dx-state-hover') ?? false;
      });
      expect(isHovered).toBe(false);
    });

    test(`TextBox should be focused after click on outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      await createWidget(page, 'dxTextBox', {
        value: 'text',
        label: 'Label text',
        labelMode: 'outside',
        stylingMode,
        width: 500,
      });

      const labelSpan = page.locator('#container .dx-label span');
      await labelSpan.click();

      const isFocused = await page.evaluate(() => {
        return document.querySelector('#container')?.classList.contains('dx-state-focused') ?? false;
      });
      expect(isFocused).toBe(true);
    });
  });
});

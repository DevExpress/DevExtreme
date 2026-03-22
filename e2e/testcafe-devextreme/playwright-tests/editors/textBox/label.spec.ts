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

  const visibleLabelModes: LabelMode[] = ['floating', 'static', 'outside'];
  const stylingModes: EditorStyle[] = ['outlined', 'underlined', 'filled'];
  const buttonsList: (string | TextEditorButton)[][] = [
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

  const createTextBox = async (options?: Properties, state?: string): Promise<string> => {
    const id = `${`dx${new Guid()}`}`;

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
    { labelMode: 'static', expectedWidths: { generic: 82, material: 68, fluent: 74 } },
    { labelMode: 'floating', expectedWidths: { generic: 82, material: 68, fluent: 74 } },
    { labelMode: 'outside', expectedWidths: { generic: 'none', material: 'none', fluent: 'none' } },
  ].forEach(({ labelMode, expectedWidths }) => {
    test(`Label max-width should be changed after container width was changed, labelMode is ${labelMode}`, async ({ page }) => {
      const textBox = page.locator('#container');

      const expectedWidth = expectedWidths[(process.env.theme ?? 'fluent.blue.light')];

      await page.expect(textBox.getLabel().getStyleProperty('max-width'))
        .eql(expectedWidth === 'none' ? 'none' : `${expectedWidth}px`);

      await setStyleAttribute(page, page.locator(`#${await textBox.element.getAttribute('id')}`), `width: ${t.ctx.initialWidth + t.ctx.deltaWidth}px;`);

      await page.expect(textBox.getLabel().getStyleProperty('max-width'))
        .eql(expectedWidth === 'none' ? 'none' : `${expectedWidth + t.ctx.deltaWidth}px`);

    });.before(async ({ page }) => {
      t.ctx.initialWidth = 100;
      t.ctx.deltaWidth = 300;

      await createWidget(page, 'dxTextBox', {
        width: t.ctx.initialWidth,
        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        labelMode,
      });
    });
  });

  test('Textbox render', async ({ page }) => {

      for (const stylingMode of stylingModes) {
          for (const labelMode of visibleLabelModes) {
              for (const placeholder of ['Placeholder', '']) {
          await createTextBox({
            text: undefined,
            placeholder,
            stylingMode,
            labelMode,
          });
        }

        await createTextBox({ text: 'Text value' });
        await createTextBox({ rtlEnabled: true });
      }
          for (const placeholder of ['Placeholder', '']) {
        await createTextBox({
          text: undefined,
          placeholder,
          stylingMode,
          label: undefined,
        });
      }
      await createTextBox({ label: undefined, text: 'Text value' });
      await createTextBox({ label: undefined, rtlEnabled: true });
    }

    await insertStylesheetRulesToPage(page, `.${TEXTBOX_CLASS} { display: inline-block; vertical-align: middle; width: 60px; margin: 5px; }`);

    await testScreenshot(page, 'Textbox render with limited width.png', { element: '#container' });

    await removeStylesheetRulesFromPage(page, );

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
        await createTextBox({
          text: undefined,
          placeholder,
        }, state);
      }

      await createTextBox({ text: 'Text value' }, state);
      await createTextBox({ rtlEnabled: true }, state);
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
        await createTextBox({ stylingMode, buttons, showClearButton: true });
        await createTextBox({
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

      const textBox = page.locator('#container');

      await page.hover(textBox.getLabelSpan())
        .expect(textBox.isHovered)
        .notOk();

    });

    test(`TextBox should be focused after click on outside label, stylingMode=${stylingMode}`, async ({ page }) => {
    await createWidget(page, 'dxTextBox', {
      value: 'text',
      label: 'Label text',
      labelMode: 'outside',
      stylingMode,
      width: 500,
    });

      const textBox = page.locator('#container');

      await page.click(textBox.getLabelSpan())
        .expect(textBox.isFocused)
        .ok();

    });
  });
});

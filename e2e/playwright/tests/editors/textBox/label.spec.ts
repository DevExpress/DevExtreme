import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';
import type { EditorStyle, LabelMode, TextEditorButton } from 'devextreme/common';
import type { Properties } from 'devextreme/ui/text_box';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage,
  setClassAttribute, setStyleAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { getThemeName, isMaterial } from '../../../helpers/themeUtils';
import TextBox from '../../../models/textBox';

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

const createTextBox = async (page: Page, options?: Properties, state?: string): Promise<string> => {
  const id = `dx${randomUUID()}`;

  await appendElementTo(page, '#container', 'div', id);
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

test.describe('TextBox_Label', () => {
  [
    {
      labelMode: 'static',
      expectedWidths: {
        generic: 82, material: 68, fluent: 74, 'fluent-next': 74,
      },
    },
    {
      labelMode: 'floating',
      expectedWidths: {
        generic: 82, material: 68, fluent: 74, 'fluent-next': 74,
      },
    },
    {
      labelMode: 'outside',
      expectedWidths: {
        generic: 'none', material: 'none', fluent: 'none', 'fluent-next': 'none',
      },
    },
  ].forEach(({ labelMode, expectedWidths }) => {
    test(`Label max-width should be changed after container width was changed, labelMode is ${labelMode}`, async ({ page, theme }) => {
      const initialWidth = 100;
      const deltaWidth = 300;

      await createWidget(page, 'dxTextBox', {
        width: initialWidth,
        label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        labelMode,
      });

      const textBox = new TextBox(page, '#container');
      const expectedWidth: number | 'none' = expectedWidths[getThemeName(theme)];

      await expect(textBox.getLabel())
        .toHaveCSS('max-width', expectedWidth === 'none' ? 'none' : `${expectedWidth}px`);

      await setStyleAttribute(page, '#container', `width: ${initialWidth + deltaWidth}px;`);

      await expect(textBox.getLabel())
        .toHaveCSS('max-width', expectedWidth === 'none' ? 'none' : `${expectedWidth + deltaWidth}px`);
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

  test('Textbox with buttons container', async ({ page, theme }) => {
    if (isMaterial(theme)) {
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
    const options = {
      value: 'text',
      label: 'Label text',
      labelMode: 'outside',
      stylingMode,
      width: 500,
    };

    test(`TextBox should not be hovered after hover of outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      await createWidget(page, 'dxTextBox', options);

      const textBox = new TextBox(page, '#container');

      await textBox.getLabelSpan().hover();
      await textBox.expectHovered(false);
    });

    test(`TextBox should be focused after click on outside label, stylingMode=${stylingMode}`, async ({ page }) => {
      await createWidget(page, 'dxTextBox', options);

      const textBox = new TextBox(page, '#container');

      await textBox.getLabelSpan().click();
      await textBox.expectFocused();
    });
  });
});

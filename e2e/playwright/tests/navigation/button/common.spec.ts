import type { ButtonType } from 'devextreme/common';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  addCaptionTo,
  appendElementTo,
  setAttribute,
  setClassAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Button from '../../../models/button';

// The tags list the themes this test also runs in; a test without them runs in the default one.
const THEMES = { tag: ['@generic.light', '@material.blue.light', '@material.blue.light.compact'] };

const STATES = ['default', 'focused', 'hover', 'active', 'selected', 'disabled'];

const BUTTONS = [
  ...['danger', 'default', 'normal', 'success'].map((type: ButtonType) => ({
    type,
    text: `${type[0].toUpperCase()}${type.slice(1)}`,
  })),
  { icon: 'find', text: 'Find' },
  { icon: 'find' },
];

['text', 'outlined', 'contained'].forEach((stylingMode) => {
  const testName = `Buttons, stylingMode=${stylingMode}`;

  test(testName, async ({ page }) => {
    await setAttribute(page, '#container', 'class', 'dx-theme-generic-typography');
    await setAttribute(page, '#container', 'style', 'width: fit-content; padding: 8px;');

    for (const state of STATES) {
      await appendElementTo(page, '#container', 'div', `mode${state}`);
      await setAttribute(page, `#mode${state}`, 'style', 'display: flex; gap: 8px; margin-bottom: 16px;');
      await addCaptionTo(page, `#mode${state}`, state);

      for (const [index] of BUTTONS.entries()) {
        await appendElementTo(page, `#mode${state}`, 'div', `button-${state}-${index}`);
      }

      for (const [index, config] of BUTTONS.entries()) {
        await createWidget(page, 'dxButton', {
          ...config,
          stylingMode,
          disabled: state === 'disabled',
        }, `#button-${state}-${index}`);
      }

      if (state !== 'default' && state !== 'disabled') {
        for (const [index] of BUTTONS.entries()) {
          await setClassAttribute(page, `#button-${state}-${index}`, `dx-state-${state}`);
        }
      }
    }

    await testScreenshot(page, `${testName}.png`);
  });
});

test('Button reports its text, selected and disabled state', THEMES, async ({ page }) => {
  await createWidget(page, 'dxButton', { text: 'Find', icon: 'find' });

  const button = new Button(page, '#container');

  await expect(button.text).toHaveText('Find');
  expect(await button.isSelected()).toBe(false);
  expect(await button.isDisabled()).toBe(false);

  await button.option('disabled', true);

  expect(await button.isDisabled()).toBe(true);
});

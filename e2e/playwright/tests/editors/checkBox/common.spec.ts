import { randomUUID } from 'node:crypto';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  setClassAttribute,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const valueModes = [false, true, undefined];

const CHECKBOX_CLASS = 'dx-checkbox';
const READONLY_STATE_CLASS = 'dx-state-readonly';
const DEFAULT_STATE_CLASS = '';
const ACTIVE_STATE_CLASS = 'dx-state-active';
const HOVER_STATE_CLASS = 'dx-state-hover';
const FOCUSED_STATE_CLASS = 'dx-state-focused';
const DISABLED_STATE_CLASS = 'dx-state-disabled';
const INVALID_STATE_CLASS = 'dx-invalid';

test.describe('CheckBox', () => {
  [false, true].forEach((isColumnCountStyle) => {
    test(`Render ${!isColumnCountStyle ? 'default' : 'with column-count style on container'}`, async ({ page }) => {
      await setStyleAttribute(page, '#container', `padding: 5px; width: 300px; height: 200px; ${isColumnCountStyle ? 'column-count: 2' : ''}`);

      await insertStylesheetRulesToPage(page, `.${CHECKBOX_CLASS} { display: block; }`);

      await appendElementTo(page, '#container', 'div', 'checked');
      await createWidget(page, 'dxCheckBox', { value: true, text: 'checked' }, '#checked');

      await appendElementTo(page, '#container', 'div', 'unchecked');
      await createWidget(page, 'dxCheckBox', { value: false, text: 'unchecked' }, '#unchecked');

      await appendElementTo(page, '#container', 'div', 'indeterminate');
      await createWidget(page, 'dxCheckBox', { value: undefined, text: 'indeterminate' }, '#indeterminate');

      // rtl
      await appendElementTo(page, '#container', 'div', 'checkedRTL');
      await createWidget(page, 'dxCheckBox', { value: true, text: 'checked', rtlEnabled: true }, '#checkedRTL');

      await appendElementTo(page, '#container', 'div', 'uncheckedRTL');
      await createWidget(page, 'dxCheckBox', { value: false, text: 'unchecked', rtlEnabled: true }, '#uncheckedRTL');

      await appendElementTo(page, '#container', 'div', 'indeterminateRTL');
      await createWidget(page, 'dxCheckBox', { value: undefined, text: 'indeterminate', rtlEnabled: true }, '#indeterminateRTL');

      await testScreenshot(page, `Checkbox states${isColumnCountStyle ? ' with column count style' : ''}.png`, { element: '#container' });
    });
  });

  test('Checkbox appearance', async ({ page }) => {
    for (const state of [
      DEFAULT_STATE_CLASS,
      READONLY_STATE_CLASS,
      DISABLED_STATE_CLASS,
      HOVER_STATE_CLASS,
      ACTIVE_STATE_CLASS,
      FOCUSED_STATE_CLASS,
      `${FOCUSED_STATE_CLASS} ${HOVER_STATE_CLASS}`,
      INVALID_STATE_CLASS,
      `${INVALID_STATE_CLASS} ${FOCUSED_STATE_CLASS}`,
    ]) {
      await page.evaluate((stateName) => {
        $('#container').append($('<div>').text(`State: ${stateName}`).css('fontSize', '10px'));
      }, state);

      for (const iconSize of [undefined, 25]) {
        for (const text of [undefined, 'Label text']) {
          for (const rtlEnabled of [false, true]) {
            for (const value of valueModes) {
              const id = `dx${randomUUID()}`;

              await appendElementTo(page, '#container', 'div', id);
              await createWidget(page, 'dxCheckBox', {
                text,
                value,
                rtlEnabled,
                iconSize,
              }, `#${id}`);
              await setClassAttribute(page, `#${id}`, state);
            }
          }
        }

        for (const rtlEnabled of [false, true]) {
          const id = `dx${randomUUID()}`;

          await appendElementTo(page, '#container', 'div', id);
          await createWidget(page, 'dxCheckBox', {
            text: 'Label text',
            width: 50,
            rtlEnabled,
          }, `#${id}`);
          await setClassAttribute(page, `#${id}`, state);
        }
      }
    }

    await insertStylesheetRulesToPage(page, '.dx-checkbox.dx-widget { display: inline-flex; vertical-align: middle; margin-inline: 10px; }');

    await testScreenshot(page, 'CheckBox appearance.png');

    for (const scale of [1.15, 0.67]) {
      await page.evaluate((scaleValue) => {
        $('#container').css('transform', `scale(${scaleValue})`);
      }, scale);

      await testScreenshot(page, `CheckBox appearance in scaled container, scale=${scale}.png`);
    }
  });
});

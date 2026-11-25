import { randomUUID } from 'node:crypto';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, hasHorizontalScroll, insertStylesheetRulesToPage, setStyleAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const DATEBOX_CLASS = 'dx-datebox';

const stylingModes = ['outlined', 'underlined', 'filled'];
const visibleLabelModes = ['floating', 'static', 'outside'];

test.describe('DateBox_Label', () => {
  test('Symbol parts in label should not be cropped', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'dateBox');
    await setStyleAttribute(page, '#container', 'box-sizing: border-box; width: 300px; height: 600px; padding: 8px;');

    for (const stylingMode of stylingModes) {
      for (const labelMode of visibleLabelModes) {
        const id = `dx${randomUUID()}`;

        await appendElementTo(page, '#container', 'div', id);

        await createWidget(page, 'dxDateBox', {
          label: 'qwerty QWERTY 1234567890',
          stylingMode,
          labelMode,
          value: new Date(1900, 0, 1),
        }, `#${id}`);
      }
    }

    await expect.poll(() => hasHorizontalScroll(page.locator('#container'))).toBe(false);

    await testScreenshot(page, 'Datebox label symbols.png', { element: '#container' });
  });

  test('DateBox with buttons container', async ({ page }) => {
    for (const stylingMode of stylingModes) {
      for (const buttons of [
        ['clear'],
        ['clear', 'dropDown'],
        [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
        ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'after', options: { icon: 'home' } }],
      ]) {
        for (const isValid of [true, false]) {
          const id = `dx${randomUUID()}`;

          await appendElementTo(page, '#container', 'div', id);

          await createWidget(page, 'dxDateBox', {
            value: new Date(2021, 9, 17),
            stylingMode,
            buttons,
            showClearButton: true,
            isValid,
          }, `#${id}`);
        }
      }
    }

    await insertStylesheetRulesToPage(page, `#container { display: flex; flex-wrap: wrap; } .${DATEBOX_CLASS} { width: 220px; margin: 2px; }`);

    await testScreenshot(page, 'DateBox render with buttons container.png');
  });
});

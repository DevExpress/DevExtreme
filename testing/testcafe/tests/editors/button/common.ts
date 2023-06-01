/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo, insertStylesheetRulesToPage, removeStylesheetRulesFromPage, setAttribute,
} from '../../../helpers/domUtils';
import Guid from '../../../../../js/core/guid';

const BUTTON_CLASS = 'dx-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const ICON_CLASS = 'dx-icon';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

fixture.disablePageReloads`Button`
  .page(url(__dirname, '../../container.html'));

test('Buttons render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { width: 70px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render with overflow.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await insertStylesheetRulesToPage(`.${BUTTON_TEXT_CLASS}, .${BUTTON_CLASS} .${ICON_CLASS} { font-size: 26px; } .${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button stretch of large text.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const stylingMode of stylingModes) {
    for (const type of types) {
      for (const text of ['Button Text', '']) {
        for (const icon of ['home', undefined]) {
          for (const rtlEnabled of [true, false]) {
            const id = `${new Guid()}`;

            await appendElementTo('#container', 'div', id, { });
            await createWidget('dxButton', {
              stylingMode,
              text,
              type,
              rtlEnabled,
              icon,
            }, `#${id}`);
          }
        }
      }
    }
  }
});

test('Buttons render in disabled state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render in disabled.png', { element: '#container', shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'Button render in disabled.png', {
    element: '#container',
    theme: process.env.theme?.replace('.light', '.dark'),
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'class', `dx-theme-${process.env.theme?.split('.')[0]}-typography`);

  for (const stylingMode of stylingModes) {
    for (const type of types) {
      const id = `${new Guid()}`;

      await appendElementTo('#container', 'div', id, { });
      await createWidget('dxButton', {
        stylingMode,
        text: `stylingMode: ${stylingMode}, type: ${type}`,
        type,
        icon: 'home',
        disabled: true,
      }, `#${id}`);
    }
  }
});

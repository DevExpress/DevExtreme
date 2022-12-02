/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRule, deleteStylesheetRule } from '../../navigation/helpers/domUtils';
import Guid from '../../../../../js/core/guid';

const BUTTON_CLASS = 'dx-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const ICON_CLASS = 'dx-icon';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

fixture`Button`
  .page(url(__dirname, '../../container.html'));

test('Buttons render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshotInTheme(t, takeScreenshot, 'Button render.png', '#container', true);

  await insertStylesheetRule(`.${BUTTON_CLASS} { width: 70px }`, 0);

  await takeScreenshotInTheme(t, takeScreenshot, 'Button render with overflow.png', '#container', true);

  await deleteStylesheetRule(0);

  await insertStylesheetRule(`.${BUTTON_TEXT_CLASS}, .${BUTTON_CLASS} .${ICON_CLASS} { font-size: 26px }`, 0);

  await takeScreenshotInTheme(t, takeScreenshot, 'Button stretch of large text.png', '#container', true);

  await deleteStylesheetRule(0);

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
            }, false, `#${id}`);
          }
        }
      }
    }
  }
});

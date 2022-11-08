/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { appendElementTo } from '../../navigation/helpers/domUtils';
import Guid from '../../../../../js/core/guid';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['back', 'danger', 'default', 'normal', 'success'];

fixture`Button`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => {
    await changeTheme('generic.light');
  });

const themes = ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'];
themes.forEach((theme) => {
  test(`Buttons render (${theme})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`buttons-render-theme=${theme.replace(/\./g, '-')}.png`, '#container'))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

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
});

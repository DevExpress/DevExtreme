/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  insertStylesheetRulesToPage,
  appendElementTo,
} from '../../../helpers/domUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Guid from '../../../../../js/core/guid';
import { testScreenshot } from '../../../helpers/themeUtils';

const DATERANGEBOX_CLASS = 'dx-daterangebox';

const stylingModes = ['outlined', 'underlined', 'filled'];
const labelModes = ['static', 'floating', 'hidden'];

fixture.disablePageReloads.skip`DateRangeBox render`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  test(`DateRangeBox styles, stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `DateRangeBox stylingMode=${stylingMode}.png`, { shouldTestInCompact: true });

    // TODO: add states

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    t.ctx.ids = [];

    await insertStylesheetRulesToPage(`.${DATERANGEBOX_CLASS} { margin: 5px; }`);

    for (const labelMode of labelModes) {
      for (const value of [
        [null, null],
        [new Date(2021, 9, 17, 16, 34), new Date(2021, 9, 18, 16, 34)],
      ]) {
        const id = `${`dx${new Guid()}`}`;

        t.ctx.ids.push(id);
        await appendElementTo('#container', 'div', id, { });

        const options: any = {
          value,
          // TODO: add labels
          labelMode,
          stylingMode,
          showClearButton: true,
        };

        await createWidget('dxDateRangeBox', options, `#${id}`);
      }
    }
  });
});

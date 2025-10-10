/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Guid from 'devextreme/core/guid';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, setStyleAttribute, removeStylesheetRulesFromPage, insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';

const DATEBOX_CLASS = 'dx-datebox';

const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`DateBox_Label`
  .page(url(__dirname, '../../container.html'));

test('Symbol parts in label should not be cropped', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Datebox label symbols.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'dateBox');
  await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

  for (const stylingMode of stylingModes) {
    const id = `${`dx${new Guid()}`}`;

    await appendElementTo('#container', 'div', id, { });

    const options: any = {
      width: 220,
      label: 'label text',
      stylingMode,
      showClearButton: true,
      value: new Date(2021, 9, 17, 16, 34),
    };

    await createWidget('dxDateBox', options, `#${id}`);
  }
});

test('DateBox with buttons container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`#container { display: flex; flex-wrap: wrap; } .${DATEBOX_CLASS} { width: 220px; margin: 2px; }`);

  await testScreenshot(t, takeScreenshot, 'DateBox render with buttons container.png', { shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const stylingMode of stylingModes) {
    for (const buttons of [
      ['clear'],
      ['clear', 'dropDown'],
      [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'dropDown'],
    ]) {
      for (const isValid of [true, false]) {
        const id = `${`dx${new Guid()}`}`;

        await appendElementTo('#container', 'div', id, { });

        await createWidget('dxDateBox', {
          value: new Date(2021, 9, 17),
          stylingMode,
          buttons,
          showClearButton: true,
          isValid,
        }, `#${id}`);
      }
    }
  }
});

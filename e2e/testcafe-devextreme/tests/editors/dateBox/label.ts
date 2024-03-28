/* eslint-disable no-restricted-syntax */
import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, setStyleAttribute, removeStylesheetRulesFromPage, insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';
import Guid from 'devextreme/core/guid';
import { clearTestPage } from '../../../helpers/clearPage';

const DATEBOX_CLASS = 'dx-datebox';

const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`DateBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

stylingModes.forEach((stylingMode) => {
  test(`Symbol parts in label should not be cropped with stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Datebox label symbols with stylingMode=${stylingMode}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'dateBox');
    await setStyleAttribute(Selector('#container'), 'box-sizing: border-box; width: 300px; height: 400px; padding: 8px;');

    return createWidget('dxDateBox', {
      label: 'qwerty QWERTY 1234567890',
      stylingMode,
      value: new Date(1900, 0, 1),
    }, '#dateBox');
  });
});

[true, false].forEach((isValid) => {
  test(`DateBox with buttons container, isValid=${isValid}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await insertStylesheetRulesToPage(`#container { display: flex; flex-wrap: wrap; } .${DATEBOX_CLASS} { width: 220px; margin: 2px; }`);

    await testScreenshot(t, takeScreenshot, `DateBox render with buttons container, isValid=${isValid}.png`, { shouldTestInCompact: true });

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
        ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'after', options: { icon: 'home' } }],
        [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'dropDown'],
        ['clear', { name: 'custom', location: 'before', options: { icon: 'home' } }, 'dropDown'],
        ['clear', 'dropDown', { name: 'custom', location: 'before', options: { icon: 'home' } }],
      ]) {
        for (const rtlEnabled of [true, false]) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo('#container', 'div', id, { });

          await createWidget('dxDateBox', {
            value: new Date(2021, 9, 17),
            stylingMode,
            rtlEnabled,
            buttons,
            showClearButton: true,
            isValid,
          }, `#${id}`);
        }
      }
    }
  });
});

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
const visibleLabelModes = ['floating', 'static', 'outside'];

fixture`DateBox_Label`
  .page(url(__dirname, '../../container.html'));

test('Symbol parts in label should not be cropped', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Datebox label symbols.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await appendElementTo('#container', 'div', 'dateBox');
  await setStyleAttribute(Selector('#container'), 'padding: 8px;');
  await t.resizeWindow(300, 600);

  for (const stylingMode of stylingModes) {
    for (const labelMode of visibleLabelModes) {
      const id = `${`dx${new Guid()}`}`;

      await appendElementTo('#container', 'div', id, { });

      await createWidget('dxDateBox', {
        label: 'qwerty QWERTY 1234567890',
        stylingMode,
        labelMode,
        value: new Date(1900, 0, 1),
      }, `#${id}`);
    }
  }
});

test('DateBox with buttons container', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'DateBox render with buttons container.png');

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

  await insertStylesheetRulesToPage(`#container { display: flex; flex-wrap: wrap; } .${DATEBOX_CLASS} { width: 220px; margin: 2px; }`);
}).after(async () => {
  await removeStylesheetRulesFromPage();
});

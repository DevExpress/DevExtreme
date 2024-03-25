/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, removeStylesheetRulesFromPage, insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';
import Guid from 'devextreme/core/guid';
import { clearTestPage } from '../../../helpers/clearPage';

const NUMBERBOX_CLASS = 'dx-numberbox';

const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`NumberBox_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => clearTestPage());

stylingModes.forEach((stylingMode) => {
  test(`Label for dxNumberBox stylingMode=${stylingMode}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `NumberBox label with stylingMode=${stylingMode}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const componentOption = {
      label: 'label text',
      stylingMode,
    };

    await insertStylesheetRulesToPage('#container { box-sizing: border-box; width: 300px; height: 400px; padding: 8px; }');

    await appendElementTo('#container', 'div', 'numberBox1', { });
    await appendElementTo('#container', 'div', 'numberBox2', { });

    await createWidget('dxNumberBox', {
      ...componentOption,
      value: 'text',
    }, '#numberBox1');

    await createWidget('dxNumberBox', {
      ...componentOption,
      value: 123,
    }, '#numberBox2');
  });
});

[true, false].forEach((isValid) => {
  test(`NumberBox with buttons container, isValid=${isValid}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await insertStylesheetRulesToPage(`#container { display: flex; flex-wrap: wrap; } .${NUMBERBOX_CLASS} { width: 220px; margin: 2px; }`);

    await testScreenshot(t, takeScreenshot, `NumberBox render with buttons container, isValid=${isValid}.png`, { shouldTestInCompact: true });

    await removeStylesheetRulesFromPage();

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    for (const stylingMode of stylingModes) {
      for (const buttons of [
        ['clear'],
        ['clear', 'spins'],
        [{ name: 'custom', location: 'after', options: { icon: 'home' } }, 'clear', 'spins'],
        ['clear', { name: 'custom', location: 'after', options: { icon: 'home' } }, 'spins'],
        ['clear', 'spins', { name: 'custom', location: 'after', options: { icon: 'home' } }],
        [{ name: 'custom', location: 'before', options: { icon: 'home' } }, 'clear', 'spins'],
        ['clear', { name: 'custom', location: 'before', options: { icon: 'home' } }, 'spins'],
        ['clear', 'spins', { name: 'custom', location: 'before', options: { icon: 'home' } }],
      ]) {
        for (const rtlEnabled of [true, false]) {
          const id = `${`dx${new Guid()}`}`;

          await appendElementTo('#container', 'div', id, { });

          await createWidget('dxNumberBox', {
            value: Math.PI,
            stylingMode,
            rtlEnabled,
            buttons,
            showClearButton: true,
            showSpinButtons: true,
            isValid,
          }, `#${id}`);
        }
      }
    }
  });
});

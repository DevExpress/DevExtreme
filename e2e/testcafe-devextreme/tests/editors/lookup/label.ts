import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, insertStylesheetRulesToPage,
} from '../../../helpers/domUtils';

const labelMods = ['floating', 'static', 'outside'];
const stylingModes = ['filled', 'outlined', 'underlined'];

fixture.disablePageReloads`Lookup_Label`
  .page(url(__dirname, '../../container.html'));

labelMods.forEach((labelMode) => {
  stylingModes.forEach((stylingMode) => {
    test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#lookup2');

      await testScreenshot(t, takeScreenshot, `Lookup label with labelMode=${labelMode}-styleMode=${stylingMode}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await insertStylesheetRulesToPage('#container { width: 300px; height: 800px; }');

      const componentOption = {
        label: 'label text',
        labelMode,
        dropDownCentered: false,
        items: [...Array(10)].map((_, i) => `item${i}`),
        stylingMode,
      };

      await appendElementTo('#container', 'div', 'lookup1', { });
      await appendElementTo('#container', 'div', 'lookup2', { });

      await createWidget('dxLookup', { ...componentOption }, '#lookup1');
      await createWidget('dxLookup', { ...componentOption }, '#lookup2');
    });
  });
});

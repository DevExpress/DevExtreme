import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import {
  appendElementTo,
} from '../../../helpers/domUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

const labelMods = ['floating', 'static'];
const stylingModes = ['outlined', 'underlined', 'filled'];

fixture.disablePageReloads`Lookup_Label`
  .page(url(__dirname, '../../container.html'));

stylingModes.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    safeSizeTest(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#lookup2');

      await testScreenshot(t, takeScreenshot, `Lookup label with labelMode=${labelMode}-styleMode=${stylingMode}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }, [300, 800]).before(async () => {
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

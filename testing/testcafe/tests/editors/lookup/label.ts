import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

fixture`Lookup_Label`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for Lookup labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#otherContainer');

      await takeScreenshotInTheme(t, takeScreenshot, `Lookup label with labelMode=${labelMode}-styleMode=${stylingMode}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      await t.resizeWindow(300, 800);

      const componentOption = {
        label: 'label text',
        labelMode,
        dropDownCentered: false,
        items: [...Array(10)].map((_, i) => `item${i}`),
        stylingMode,
      };

      await createWidget('dxLookup', { ...componentOption });

      return createWidget('dxLookup', { ...componentOption }, false, '#otherContainer');
    });
  });
});

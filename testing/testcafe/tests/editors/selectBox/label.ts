import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/getPostfix';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';

const labelMods = ['floating', 'static'];
const stylingMods = ['outlined', 'underlined', 'filled'];

fixture`Label`
  .page(url(__dirname, '../../container.html'));

stylingMods.forEach((stylingMode) => {
  labelMods.forEach((labelMode) => {
    test(`Label for dxSelectBox labelMode=${labelMode} stylingMode=${stylingMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await t.click('#otherContainer');

      await takeScreenshotInTheme(t, takeScreenshot, `SelectBox with label-labelMode=${labelMode}-stylingMode=${stylingMode}.png`);

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async (t) => {
      await t.resizeWindow(300, 400);

      await createWidget('dxSelectBox', {
        width: 100,
        label: 'label',
        text: '',
        labelMode,
        stylingMode,
      });

      return createWidget('dxSelectBox', {
        label: `this label is ${'very '.repeat(10)}long`,
        text: `this content is ${'very '.repeat(10)}long`,
        items: ['item1', 'item2'],
        labelMode,
        stylingMode,
      }, false, '#otherContainer');
    });
  });
});

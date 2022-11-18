import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { getThemePostfix } from '../../../helpers/getPostfix';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture`Form`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  ['outside', 'static', 'floating'].forEach((labelMode) => {
    [true, false].forEach((showOptionalMark) => {
      [true, false].forEach((showColonAfterLabel) => {
        const testName = `SimpleItem,rtl_${rtlEnabled},optMark_${showOptionalMark},labelMode_${labelMode},colon_${showColonAfterLabel}`;
        test(testName, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
          await waitFont();

          await t
            .expect(await takeScreenshot(`${testName}${getThemePostfix()}.png`, '#container'))
            .ok()
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => createWidget('dxForm', {
          width: 200,
          rtlEnabled,
          labelMode,
          showOptionalMark,
          optionalMark: 'opt',
          requiredMark: '**',
          formData: {
            item1: 'some value',
          },
          items: [
            { itemType: 'empty' },
            { dataField: 'item1', isRequired: true },
            { dataField: 'item2', isRequired: true },
            { dataField: 'item3', isRequired: false },
          ],
        }));
      });
    });
  });
});

import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`Form`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  [false, true].forEach((rtlEnabled) => {
    ['default', 'static', 'floating'].forEach((labelMode) => {
      [true, false].forEach((showOptionalMark) => {
        [true, false].forEach((showColonAfterLabel) => {
          const testName = `SimpleItem,rtl_${rtlEnabled},showOptionalMark_${showOptionalMark},labelMode_${labelMode},showColonAfterLabel_${showColonAfterLabel}`;
          test(testName, async (t) => {
            const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
            await changeTheme(theme);

            await t
              .expect(await takeScreenshot(`${testName}.png`, '#container'))
              .ok()
              .expect(compareResults.isValid())
              .ok(compareResults.errorMessages());
          }).before(async () => createWidget('dxForm', {
            width: 500,
            rtlEnabled,
            labelMode,
            showOptionalMark,
            optionalMark: 'opt',
            requiredMark: '**',
            formData: {
              item1: 'some value',
            },
            items: [
              { dataField: 'item1', isRequired: true },
              { dataField: 'item2', isRequired: true },
              { dataField: 'item3', isRequired: false },
            ],
          }));
        });
      });
    });
  });
});

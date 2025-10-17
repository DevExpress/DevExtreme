import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Pagination from 'devextreme-testcafe-models/pagination';
import url from '../../helpers/getPageUrl';
import { isMaterial, testScreenshot } from '../../helpers/themeUtils';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Pagination`
  .page(url(__dirname, '../container.html'));

['full', 'compact'].forEach((displayMode) => {
  [undefined, 'Total {2} items. Page {0} of {1}'].forEach((infoText) => {
    [true, false].forEach((showInfo) => {
      [true, false].forEach((showNavigationButtons) => {
        [true, false].forEach((showPageSizeSelector) => {
          test(`Pagination dm_${displayMode}-`
            + `${infoText ? 'has' : 'has_no'}_it-`
            + `si_${showInfo.toString()}-`
            + `snb_${showNavigationButtons.toString()}-`
            + `spss_${showPageSizeSelector.toString()}`, async (t) => {
            const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
            const pagination = new Pagination('#container');

            // TODO Chrome133: skipped during chrome update
            // Skipped all material theme
            if (isMaterial()) {
              return;
            }

            await testScreenshot(
              t,
              takeScreenshot,
              `pagination-dm_${displayMode}-`
                + `${infoText ? 'has' : 'has_no'}_it-`
                + `si_${showInfo.toString()}-`
                + `snb_${showNavigationButtons.toString()}-`
                + `spss_${showPageSizeSelector.toString()}`
                + '.png',
              { element: pagination.element },
            );
            await t
              .expect(compareResults.isValid())
              .ok(compareResults.errorMessages());
          }).before(async () => createWidget('dxPagination', {
            itemCount: 50,
            displayMode,
            infoText,
            showInfo,
            showNavigationButtons,
            showPageSizeSelector,
          }));
        });
      });
    });
  });
});

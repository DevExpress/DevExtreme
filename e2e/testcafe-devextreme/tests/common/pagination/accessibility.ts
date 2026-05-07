import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';
import { Themes } from '../../../helpers/themes';

fixture.disablePageReloads`Pagination`
  .page(url(__dirname, '../../container.html'));

['full', 'compact'].forEach((displayMode) => {
  [undefined, 'Total {2} items. Page {0} of {1}'].forEach((infoText) => {
    [true, false].forEach((showInfo) => {
      [true, false].forEach((showNavigationButtons) => {
        [true, false].forEach((showPageSizeSelector) => {
          test.meta({
            themes: infoText && showInfo && showNavigationButtons && showPageSizeSelector
              ? [Themes.materialBlue, Themes.genericLight]
              : [],
          })(`Pagination dm_${displayMode}-`
            + `${infoText ? 'has' : 'has_no'}_it-`
            + `si_${showInfo.toString()}-`
            + `snb_${showNavigationButtons.toString()}-`
            + `spss_${showPageSizeSelector.toString()}`, async (t) => {
            const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

            await testScreenshot(
              t,
              takeScreenshot,
              `pagination-dm_${displayMode}-`
                + `${infoText ? 'has' : 'has_no'}_it-`
                + `si_${showInfo.toString()}-`
                + `snb_${showNavigationButtons.toString()}-`
                + `spss_${showPageSizeSelector.toString()}`
                + '.png',
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

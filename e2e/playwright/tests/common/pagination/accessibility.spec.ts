import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

const THEMED = { tag: ['@material.blue.light', '@generic.light'] };

test.describe('Pagination', () => {
  ['full', 'compact'].forEach((displayMode) => {
    [undefined, 'Total {2} items. Page {0} of {1}'].forEach((infoText) => {
      [true, false].forEach((showInfo) => {
        [true, false].forEach((showNavigationButtons) => {
          [true, false].forEach((showPageSizeSelector) => {
            const name = `dm_${displayMode}-`
              + `${infoText ? 'has' : 'has_no'}_it-`
              + `si_${showInfo.toString()}-`
              + `snb_${showNavigationButtons.toString()}-`
              + `spss_${showPageSizeSelector.toString()}`;
            const isThemed = infoText && showInfo && showNavigationButtons && showPageSizeSelector;

            test(`Pagination ${name}`, isThemed ? THEMED : {}, async ({ page }) => {
              await createWidget(page, 'dxPagination', {
                itemCount: 50,
                displayMode,
                infoText,
                showInfo,
                showNavigationButtons,
                showPageSizeSelector,
              });

              await testScreenshot(page, `pagination-${name}.png`);
            });
          });
        });
      });
    });
  });
});

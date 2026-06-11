import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import PivotGrid from 'devextreme-testcafe-models/pivotGrid';
import { testScreenshot } from '../../../../helpers/themeUtils';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`PivotGrid_KBN_fields`
  .page(url(__dirname, '../../../container.html'));

const PIVOT_GRID_SELECTOR = '#container';
[
  ['filter-fields', { visible: true, showFilterFields: true }],
  ['column-fields', { visible: true, showDataFields: true }],
  ['description-cell', { visible: false }],
].forEach(([areaName, fieldPanelOptions]) => {
  test(`Field chooser button should have visible focus state when placed in ${areaName}`, async (t) => {
    const pivotGrid = new PivotGrid(PIVOT_GRID_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    // Note: several tab presses are needed to focus the field chooser button
    await t
      .pressKey('tab tab tab')
      .expect(pivotGrid.getFieldChooserButton().focused)
      .ok();

    await testScreenshot(t, takeScreenshot, `field-chooser-button_focus_${areaName}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxPivotGrid', {
    allowFiltering: true,
    showBorders: true,
    height: 470,
    fieldChooser: {
      enabled: true,
    },
    fieldPanel: fieldPanelOptions,
  }, PIVOT_GRID_SELECTOR));
});

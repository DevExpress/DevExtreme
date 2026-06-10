import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import { testScreenshot } from '../../../../helpers/themeUtils';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture.disablePageReloads`PivotGrid_KBN_fields`
  .page(url(__dirname, '../../../container.html'));

const BUTTON_CONTAINER_SELECTOR = '#container';
const PIVOT_GRID_SELECTOR = '#otherContainer';
[
  ['filter-fields', { visible: true, showFilterFields: true }],
  ['column-fields', { visible: true, showDataFields: true }],
  ['description-cell', { visible: false }],
].forEach(([areaName, fieldPanelOptions]) => {
  test(`Field chooser button should have visible focus state when placed in ${areaName}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click(Selector(`${BUTTON_CONTAINER_SELECTOR} button`))
      .pressKey('tab');

    await testScreenshot(t, takeScreenshot, `field-chooser-button_focus_${areaName}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await ClientFunction(() => {
      const button = document.createElement('button');
      button.textContent = 'Button';

      const container = document.querySelector(BUTTON_CONTAINER_SELECTOR);
      container?.appendChild(button);
    }, { dependencies: { BUTTON_CONTAINER_SELECTOR } })();

    await createWidget('dxPivotGrid', {
      allowFiltering: true,
      showBorders: true,
      height: 470,
      fieldChooser: {
        enabled: true,
      },
      fieldPanel: fieldPanelOptions,
    }, PIVOT_GRID_SELECTOR);
  }).after(async () => {
    await ClientFunction(() => {
      const container = document.querySelector(BUTTON_CONTAINER_SELECTOR);
      if (container) {
        container.innerHTML = '';
      }
    }, { dependencies: { BUTTON_CONTAINER_SELECTOR } })();
  });
});

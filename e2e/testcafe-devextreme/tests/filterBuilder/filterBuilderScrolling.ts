import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { fields, filter } from './data';
import { safeSizeTest } from '../../helpers/safeSizeTest';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../helpers/domUtils';

fixture`Filter Builder Scrolling Test`.page(
  url(__dirname, '../container.html'),
);

// T1273328
safeSizeTest('FilterBuilder - The field drop-down window moves with the page scroll', async (t) => {
  const filterBuilder = new FilterBuilder('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await filterBuilder.isReady();

  await t
    .click(filterBuilder.getItem('operation'))
    .scrollIntoView(filterBuilder.getItem('operation', 4));

  await testScreenshot(t, takeScreenshot, 'filterBuilder_scroll_with_popup.png', { element: filterBuilder.element });
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('#container {height: 150px; overflow: scroll;}');

  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
  });
});

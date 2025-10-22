import FilterBuilder from 'devextreme-testcafe-models/filterBuilder';
import url from '../../helpers/getPageUrl';
import { fields, filter } from './data';
import { createWidget } from '../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../helpers/domUtils';

fixture`Filter Builder Scrolling Test`.page(
  url(__dirname, '../container.html'),
);

// T1273328 > T1294239
test('FilterBuilder - The field drop-down closes with the page scroll', async (t) => {
  const filterBuilder = new FilterBuilder('#container');

  await filterBuilder.isReady();

  await t
    .click(filterBuilder.getItem('operation'))
    .scrollIntoView(filterBuilder.getItem('operation', 4));

  await t.expect(FilterBuilder.getPopupTreeView().exists).notOk();
}).before(async () => {
  await insertStylesheetRulesToPage('#container {height: 150px; overflow: scroll;}');

  await createWidget('dxFilterBuilder', {
    fields,
    value: filter,
  });
});

import { a11yCheck } from '../../helpers/accessibilityUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';

fixture.disablePageReloads`Column Headers`
  .page(url(__dirname, '../container.html'));

['generic.light', 'material.blue.light'].forEach((theme) => {
  test(`Checking column headers via aXe - ${theme}`, async (t) => {
    await a11yCheck(t);
  }).before(async () => {
    await changeTheme(theme);
    return createWidget('dxDataGrid', {
      dataSource: [{
        id: 1,
        field1: 'field1',
        field2: 'field2',
      }],
      keyExpr: 'id',
      columns: ['field1', 'field2'],
      showBorders: true,
    })
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
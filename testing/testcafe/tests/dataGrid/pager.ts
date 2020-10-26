// import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../helpers/createWidget';
import { validate } from '../../helpers/screenshort-comparer';

fixture.disablePageReloads`Pager`
  .page(url(__dirname, '../container.html'))
  .afterEach(() => disposeWidgets());

test('Initial check', async (t) => {
  await t
    .takeScreenshot('pager-large.png');
  await t.expect(await validate('pager-large.png')).ok('screenshot is ok');
}).before(() => {
  const dataSource = Array.from({ length: 100 }, (_, room) => ({ name: 'Alex', phone: '555555', room }));
  return createWidget('dxDataGrid', {
    dataSource,
    columns: ['name', 'phone', 'room'],
    paging: {
      pageSize: 5,
      pageIndex: 5,
    },
    pager: {
      showPageSizeSelector: true,
      allowedPageSizes: [5, 10, 20],
      showInfo: true,
      showNavigationButtons: true,
    },
  });
});

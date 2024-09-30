import Pager from 'devextreme-testcafe-models/pager';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Pager Base Properties`
  .page(url(__dirname, '../container.html'));

test('Pager visibile property', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.hasClass('dx-state-invisible'))
    .ok();
}).before(async () => createWidget('dxPager', {
  itemCount: 50,
  visible: false,
}));

test('PageSize selector test', async (t) => {
  const pager = new Pager('#container');

  await t
    .click(pager.getPageSize(1).element)
    .expect(pager.option('pageCount'))
    .eql(13);
}).before(async () => createWidget('dxPager', {
  itemCount: 50,
  pageIndex: 2,
  pageSize: 8, // pageCount: 7
  allowedPageSizes: [2, 4, 8],
}));

test('PageIndex test', async (t) => {
  const pager = new Pager('#container');

  await t
    .expect(pager.option('pageIndex'))
    .eql(1)
    .click(pager.getNavPage('5').element)
    .expect(pager.option('pageIndex'))
    .eql(5);
}).before(async () => createWidget('dxPager', {
  itemCount: 50,
  pageIndex: 1,
  pageSize: 5, // pageCount: 10
}));

test('PageIndex correction test', async (t) => {
  const pager = new Pager('#container');

  await t
    .expect(pager.option('pageIndex'))
    .eql(10)
    .click(pager.getPageSize(1).element)
    .expect(pager.option('pageIndex'))
    .eql(5);
}).before(async () => createWidget('dxPager', {
  itemCount: 50,
  pageIndex: 10,
  pageSize: 5, // pageCount: 10
}));

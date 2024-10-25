import Pagination from 'devextreme-testcafe-models/pagination';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Pagination Base Properties`
  .page(url(__dirname, '../container.html'));

test('Pagination visibile property', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.hasClass('dx-state-invisible'))
    .ok();
}).before(async () => createWidget('dxPagination', {
  itemCount: 50,
  visible: false,
}));

test('PageSize selector test', async (t) => {
  const pagination = new Pagination('#container');

  await t
    .click(pagination.getPageSize(1).element)
    .expect(pagination.option('pageCount'))
    .eql(13);
}).before(async () => createWidget('dxPagination', {
  itemCount: 50,
  pageIndex: 2,
  pageSize: 8, // pageCount: 7
  allowedPageSizes: [2, 4, 8],
}));

test('PageIndex test', async (t) => {
  const pagination = new Pagination('#container');

  await t
    .expect(pagination.option('pageIndex'))
    .eql(1)
    .click(pagination.getNavPage('5').element)
    .expect(pagination.option('pageIndex'))
    .eql(5);
}).before(async () => createWidget('dxPagination', {
  itemCount: 50,
  pageIndex: 1,
  pageSize: 5, // pageCount: 10
}));

test('PageIndex correction test', async (t) => {
  const pagination = new Pagination('#container');

  await t
    .expect(pagination.option('pageIndex'))
    .eql(10)
    .click(pagination.getPageSize(1).element)
    .expect(pagination.option('pageIndex'))
    .eql(5);
}).before(async () => createWidget('dxPagination', {
  itemCount: 50,
  pageIndex: 10,
  pageSize: 5, // pageCount: 10
}));

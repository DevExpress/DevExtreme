import Pagination from 'devextreme-testcafe-models/pagination';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Pagination Base Properties`
  .page(url(__dirname, '../container.html'));

test('Pagination width and height property', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.getStyleProperty('width'))
    .eql('270px')
    .expect(pagination.element.getStyleProperty('height'))
    .eql('95px')
    .expect(pagination.element.getAttribute('width'))
    .eql(null)
    .expect(pagination.element.getAttribute('height'))
    .eql(null);
}).before(async () => createWidget('dxPagination', {
  width: 270,
  height: '95px',
  itemCount: 50,
}));

test('Pagination elementAttr property', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.getAttribute('aria-label'))
    .eql('some description')
    .expect(pagination.element.getAttribute('data-test'))
    .eql('custom data');
}).before(async () => createWidget('dxPagination', {
  elementAttr: {
    'aria-label': 'some description',
    'data-test': 'custom data',
  },
}));

test('Pagination hint, disabled and accessKey properties', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.getAttribute('aria-disabled'))
    .eql('true')
    .expect(pagination.element.hasClass('dx-state-disabled'))
    .ok()
    .expect(pagination.element.getAttribute('accesskey'))
    .eql('F')
    .expect(pagination.element.getAttribute('title'))
    .eql('Best Pagination');
}).before(async () => createWidget('dxPagination', {
  hint: 'Best Pagination',
  disabled: true,
  accessKey: 'F',
  itemCount: 50,
}));

test('Pagination tabindex and state properties', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.getAttribute('tabindex'))
    .eql('7')

    .click(pagination.getNavPage('3').element)
    .expect(pagination.element.hasClass('dx-state-focused'))
    .ok()
    .expect(pagination.element.hasClass('dx-state-hover'))
    .ok()
    .expect(pagination.element.hasClass('dx-state-active'))
    .notOk();

  await ClientFunction((_pagination) => {
    const $root = $(_pagination.element());

    $root.trigger($.Event('dxpointerdown', {
      pointers: [{ pointerId: 1 }],
    }));
  })(pagination);

  await t
    .expect(pagination.element.hasClass('dx-state-active'))
    .ok();
}).before(async () => createWidget('dxPagination', {
  itemCount: 50,
  disabled: false,
  width: '100%',
  focusStateEnabled: true,
  hoverStateEnabled: true,
  activeStateEnabled: true,
  tabIndex: 7,
}));

test('Pagination focus method without focusStateEnabled', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.getPageSize(0).element.focused)
    .notOk();

  await ClientFunction((_pagination) => {
    _pagination.getInstance().focus();
  })(pagination);

  await t
    .expect(pagination.getPageSize(0).element.focused)
    .ok();
}).before(async () => createWidget('dxPagination', {
  focusStateEnabled: false,
  itemCount: 50,
}));

test('Pagination focus method with focusStateEnabled', async (t) => {
  const pagination = new Pagination('#container');
  await t
    .expect(pagination.element.focused)
    .notOk();

  await ClientFunction((_pagination) => {
    _pagination.getInstance().focus();
  })(pagination);

  await t
    .expect(pagination.element.focused)
    .ok();
}).before(async () => createWidget('dxPagination', {
  focusStateEnabled: true,
  itemCount: 50,
}));

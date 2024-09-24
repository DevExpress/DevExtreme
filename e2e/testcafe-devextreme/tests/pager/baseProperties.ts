import Pager from 'devextreme-testcafe-models/pager';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture`Pager Base Properties`
  .page(url(__dirname, '../container.html'));

test('Pager width and height property', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.getStyleProperty('width'))
    .eql('270px')
    .expect(pager.element.getStyleProperty('height'))
    .eql('95px')
    .expect(pager.element.getAttribute('width'))
    .eql(null)
    .expect(pager.element.getAttribute('height'))
    .eql(null);
}).before(async () => createWidget('dxPager', {
  width: 270,
  height: '95px',
  itemCount: 50,
}));

test('Pager elementAttr property', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.getAttribute('aria-label'))
    .eql('some description')
    .expect(pager.element.getAttribute('data-test'))
    .eql('custom data');
}).before(async () => createWidget('dxPager', {
  elementAttr: {
    'aria-label': 'some description',
    'data-test': 'custom data',
  },
}));

test('Pager hint, disabled and accessKey properties', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.getAttribute('aria-disabled'))
    .eql('true')
    .expect(pager.element.hasClass('dx-state-disabled'))
    .ok()
    .expect(pager.element.getAttribute('accesskey'))
    .eql('F')
    .expect(pager.element.getAttribute('title'))
    .eql('Best Pager');
}).before(async () => createWidget('dxPager', {
  hint: 'Best Pager',
  disabled: true,
  accessKey: 'F',
  itemCount: 50,
}));

test('Pager tabindex and state properties', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.getAttribute('tabindex'))
    .eql('7')

    .click(pager.getNavPage('3').element)
    .expect(pager.element.hasClass('dx-state-focused'))
    .ok()
    .expect(pager.element.hasClass('dx-state-hover'))
    .ok()
    .expect(pager.element.hasClass('dx-state-active'))
    .notOk();

  await ClientFunction((_pager) => {
    const $root = $(_pager.element());

    $root.trigger($.Event('dxpointerdown', {
      pointers: [{ pointerId: 1 }],
    }));
  })(pager);

  await t
    .expect(pager.element.hasClass('dx-state-active'))
    .ok();
}).before(async () => createWidget('dxPager', {
  itemCount: 50,
  disabled: false,
  width: '100%',
  focusStateEnabled: true,
  hoverStateEnabled: true,
  activeStateEnabled: true,
  tabIndex: 7,
}));

test('Pager focus method without focusStateEnabled', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.getPageSize(0).element.focused)
    .notOk();

  await ClientFunction((_pager) => {
    _pager.getInstance().focus();
  })(pager);

  await t
    .expect(pager.getPageSize(0).element.focused)
    .ok();
}).before(async () => createWidget('dxPager', {
  focusStateEnabled: false,
  itemCount: 50,
}));

test('Pager focus method with focusStateEnabled', async (t) => {
  const pager = new Pager('#container');
  await t
    .expect(pager.element.focused)
    .notOk();

  await ClientFunction((_pager) => {
    _pager.getInstance().focus();
  })(pager);

  await t
    .expect(pager.element.focused)
    .ok();
}).before(async () => createWidget('dxPager', {
  focusStateEnabled: true,
  itemCount: 50,
}));

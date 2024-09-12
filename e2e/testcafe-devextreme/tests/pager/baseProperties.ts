import Pager from 'devextreme-testcafe-models/pager';
import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`Pager Base Properties`
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
}));

test('Pager elementAttr property', async (t) => {
  const pager = new Pager('#bestPager');
  await t
    .expect(pager.element.getAttribute('aria-label'))
    .eql('some description')
    .expect(pager.element.getAttribute('data-test'))
    .eql('custom data')
    .expect(pager.element.getAttribute('id'))
    .eql('bestPager');
}).before(async () => createWidget('dxPager', {
  elementAttr: {
    'aria-label': 'some description',
    'data-test': 'custom data',
    id: 'bestPager',
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
  tabIndex: 7,
  focusStateEnabled: true,
  hoverStateEnabled: true,
  activeStateEnabled: true,
}));

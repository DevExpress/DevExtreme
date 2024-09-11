import Pager from 'devextreme-testcafe-models/pager';
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

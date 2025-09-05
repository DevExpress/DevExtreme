import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - LoadPanel`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('Default render', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot('load-panel.png', cardView.element);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  width: 300,
  height: 200,
  dataSource: {
    key: 'id',
    load: () => new Promise(() => {}),
  },
  columns: ['A', 'B', 'C', 'D'],
}));

test('The load panel should match the size of the component’s root container', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const loadPanel = cardView.getLoadPanel();
  const cardViewOffset = await cardView.getElementOffset();

  await t
    .expect(loadPanel.getShadowWidth())
    .eql(300)
    .expect(loadPanel.getShadowHeight())
    .eql(200)
    .expect(loadPanel.getShadowOffset())
    .eql(cardViewOffset);
}).before(async () => createWidget('dxCardView', {
  width: 300,
  height: 200,
  dataSource: {
    key: 'id',
    load: () => new Promise(() => {}),
  },
  columns: ['A', 'B', 'C', 'D'],
}));

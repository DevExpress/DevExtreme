import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`CardView - LoadPanel`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

safeSizeTest('Default render', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'load-panel.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxCardView', {
  width: 500,
  height: 300,
  dataSource: {
    key: 'id',
    load: () => new Promise(() => {}),
  },
  columns: ['A', 'B', 'C', 'D'],
}));

safeSizeTest('Default render when CardView has a large height', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'load-panel-with-large-height.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [800, 800]).before(async () => createWidget('dxCardView', {
  width: 500,
  height: 3000,
  dataSource: {
    key: 'id',
    load: () => new Promise(() => {}),
  },
  columns: ['A', 'B', 'C', 'D'],
}));

safeSizeTest('The load panel should match the size of the component’s root container', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  const loadPanel = cardView.getLoadPanel();
  const cardViewOffset = await cardView.getElementOffset();

  await t
    .expect(loadPanel.getShadowWidth())
    .eql(500)
    .expect(loadPanel.getShadowHeight())
    .eql(300)
    .expect(loadPanel.getShadowOffset())
    .eql(cardViewOffset);
}, [800, 800]).before(async () => createWidget('dxCardView', {
  width: 500,
  height: 300,
  dataSource: {
    key: 'id',
    load: () => new Promise(() => {}),
  },
  columns: ['A', 'B', 'C', 'D'],
}));

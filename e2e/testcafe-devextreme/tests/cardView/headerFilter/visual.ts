import CardView from 'devextreme-testcafe-models/cardView';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`HeaderFilter.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('popup with list', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  await testScreenshot(t, takeScreenshot, 'card-view_header-filter_popup-with-list.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: ['A', 'B', 'C'],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

test('popup with search', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  await testScreenshot(t, takeScreenshot, 'card-view_header-filter_popup-with-search.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: 'A_0', B: 'B_0', C: 'C_0' },
    { A: 'A_1', B: 'B_1', C: 'C_1' },
    { A: 'A_2', B: 'B_2', C: 'C_2' },
    { A: 'A_3', B: 'B_3', C: 'C_3' },
    { A: 'A_4', B: 'B_4', C: 'C_4' },
  ],
  columns: ['A', 'B', 'C'],
  headerFilter: {
    visible: true,
    search: {
      enabled: true,
    },
  },
  height: 600,
}));

test('popup with tree', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  const filterIcon = cardView
    .getHeaderPanel()
    .getHeaderItem()
    .getFilterIcon();
  await t.click(filterIcon);

  await testScreenshot(t, takeScreenshot, 'card-view_header-filter_popup-with-tree.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { A: '2024-01-01', B: 'B_0', C: 'C_0' },
    { A: '2024-01-01', B: 'B_1', C: 'C_1' },
    { A: '2024-01-01', B: 'B_2', C: 'C_2' },
    { A: '2025-01-01', B: 'B_3', C: 'C_3' },
    { A: '2025-01-01', B: 'B_4', C: 'C_4' },
    { A: '2026-01-01', B: 'B_5', C: 'C_5' },
  ],
  columns: [
    {
      dataField: 'A',
      dataType: 'date',
    },
    'B',
    'C',
  ],
  headerFilter: {
    visible: true,
  },
  height: 600,
}));

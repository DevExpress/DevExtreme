import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`Search.Visual`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const COLUMNS = ['id', 'firstName', 'lastName', 'email', 'gender'];

const DATA = [{
  id: 1,
  firstName: 'Darin',
  lastName: 'Heritege',
  email: 'dheritege0@jugem.jp',
  gender: 'Male',
}, {
  id: 2,
  firstName: 'Aeriel',
  lastName: 'Giggs',
  email: 'agiggs1@hubpages.com',
  gender: 'Female',
}, {
  id: 3,
  firstName: 'Theo',
  lastName: 'Aleksidze',
  email: 'taleksidze2@patch.com',
  gender: 'Female',
}, {
  id: 4,
  firstName: 'Dalli',
  lastName: 'Ashwood',
  email: 'dashwood3@buzzfeed.com',
  gender: 'Male',
}, {
  id: 5,
  firstName: 'Paule',
  lastName: 'Pidgeley',
  email: 'ppidgeley4@upenn.edu',
  gender: 'Female',
}];

test('highlighted search text', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await testScreenshot(t, takeScreenshot, 'card-view_search_text-highlighting.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  dataSource: DATA,
  columns: COLUMNS,
  searchPanel: {
    visible: true,
    text: 'da',
  },
  height: 600,
}));

import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

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
  await a11yCheck(t, {}, CARD_VIEW_SELECTOR);
}).before(async () => createWidget('dxCardView', {
  dataSource: DATA,
  columns: COLUMNS,
  searchPanel: {
    visible: true,
    text: 'da',
  },
  height: 600,
}));

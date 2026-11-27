import { test } from '../../../helpers/accessibility/test';
import { a11yCheck } from '../../../helpers/accessibility/utils';
import { DEFAULT_SELECTOR } from '../../../helpers/const';
import { createWidget } from '../../../helpers/createWidget';

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

test('highlighted search text', async ({ page }) => {
  await createWidget(page, 'dxCardView', {
    dataSource: DATA,
    columns: COLUMNS,
    searchPanel: {
      visible: true,
      text: 'da',
    },
    height: 600,
  });

  await a11yCheck(page, {}, DEFAULT_SELECTOR);
});

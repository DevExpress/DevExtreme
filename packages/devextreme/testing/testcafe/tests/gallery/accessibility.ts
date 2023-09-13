/* eslint-disable no-restricted-syntax */
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { a11yCheck } from '../../helpers/accessibilityUtils';

fixture.disablePageReloads`Gallery`
  .page(url(__dirname, '../../container.html'));

function getGallerySettings(settings) {
  const items = [{
    ID: '1',
    Name: 'First',
  },
  {
    ID: '2',
    Name: 'Second',
  }];

  return {
    items,
    height: 100,
    loop: true,
    itemTemplate(item) {
      const result = document.createElement('div');
      const span = document.createElement('span');

      span.innerText = item.name;
      result.appendChild(span);

      return result;
    },
    ...settings,
  };
}

test('Checking Gallery via aXe when width was not set', async (t) => {
  await a11yCheck(t);
}).before(async () => createWidget(
  'dxGallery',
  getGallerySettings({}),
));

test('Checking Gallery via aXe when width was set', async (t) => {
  await a11yCheck(t);
}).before(async () => createWidget(
  'dxGallery',
  getGallerySettings({
    width: '100%',
  }),
));

/* eslint-disable no-restricted-syntax */
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { a11yCheck } from '../../helpers/accessibilityUtils';

fixture.disablePageReloads`Gallery`
  .page(url(__dirname, '../../container.html'));

interface GalleryItem {
  ID: string;
  Name: string;
}

const defaultItems: GalleryItem[] = [{
  ID: '1',
  Name: 'First',
},
{
  ID: '2',
  Name: 'Second',
}];

function defaultItemTemplate(item: GalleryItem) {
  const result = document.createElement('div');
  const span = document.createElement('span');

  span.innerText = item.Name;
  result.appendChild(span);

  return result;
}

function getTestName(gallerySettings) {
  const messageParts: string[] = [];
  const fields = ['items', 'width', 'itemTemplate'];

  fields.forEach((field) => {
    const fieldSkipped = gallerySettings[field] === undefined;

    messageParts.push(`${field} was ${fieldSkipped ? 'not' : ''} set`);
  });

  return `Checking Gallery via aXe. Settings: ${messageParts.join(', ')}`;
}

const gallerySettings = [{}, {
  items: defaultItems,
}, {
  itemTemplate: defaultItemTemplate,
}, {
  width: '100%',
}, {
  loop: true,
}, {
  showIndicator: false,
}].reduce((acc: any, currentValue, index, arr) => {
  acc.push({
    ...currentValue,
    ...arr[index - 1],
  });
  return acc;
}, []);

const testsSettings = gallerySettings.map((settings) => ({
  testName: getTestName(settings),
  gallerySettings: settings,
}));

testsSettings.forEach((settings) => {
  test(settings.testName, async (t) => {
    await a11yCheck(t);
  }).before(async () => createWidget(
    'dxGallery',
    gallerySettings,
  ));
});

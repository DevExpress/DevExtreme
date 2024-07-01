/* eslint-disable no-restricted-syntax */
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibility/utils';

fixture`Gallery`
  .page(url(__dirname, '../../container.html'));

interface GalleryItem {
  ID: string;
  Name: string;
}

interface GallerySettings {
  items?: GalleryItem[];
  itemTemplate?: (item: GalleryItem) => HTMLDivElement;
  width?: string;
  loop?: boolean;
  showIndicator?: boolean;
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

const allGallerySettings: GallerySettings = {
  items: defaultItems,
  itemTemplate: defaultItemTemplate,
  width: '100%',
  loop: true,
  showIndicator: false,
};

function getTestName(gallerySettings: GallerySettings) {
  const fields = Object.keys(gallerySettings);

  const messageParts = fields.map((field) => {
    const fieldSkipped = gallerySettings[field] === undefined;

    return `${field} was ${fieldSkipped ? 'not' : ''} set`;
  });

  return `Checking Gallery via aXe. Settings: ${messageParts.join(', ')}`;
}

function generateCombinations(allSettings: GallerySettings): GallerySettings[] {
  const keys = Object.keys(allSettings);
  const combinations: GallerySettings[] = [];

  const generate = (index: number, currentCombination: GallerySettings) => {
    if (index === keys.length) {
      combinations.push(currentCombination);
      return;
    }

    const key = keys[index];
    const value = allSettings[key];

    generate(index + 1, currentCombination);

    const newCombination = { ...currentCombination, [key]: value };
    generate(index + 1, newCombination);
  };

  generate(0, {});
  return combinations;
}

const settingsCombinations = generateCombinations(allGallerySettings);

settingsCombinations.forEach((settings) => {
  const testName = getTestName(settings);
  test(testName, async (t) => {
    const a11yCheckConfig = {
      rules: {
        'image-alt': { enabled: false },
      },
    };

    await a11yCheck(t, a11yCheckConfig);
  }).before(async () => createWidget(
    'dxGallery',
    settings,
  ));
});

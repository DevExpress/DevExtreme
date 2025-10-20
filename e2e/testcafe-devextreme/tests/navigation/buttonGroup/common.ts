import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item, ButtonType } from 'devextreme/ui/button_group.d';
import {
  setStyleAttribute,
  appendElementTo,
  setAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

const typedItems: Item[] = ['danger', 'default', 'normal', 'success'].map((type: ButtonType) => ({ type, text: type }));
const iconItems: Item[] = [
  { icon: 'find', text: 'find' },
  { icon: 'find' },
];
const items: Item[] = [
  ...typedItems,
  ...iconItems,
];

fixture.disablePageReloads`ButtonGroup`
  .page(url(__dirname, '../../container.html'));

test('ButtonGroup styling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'ButtonGroup styling.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setStyleAttribute(Selector('#container'), 'width: fit-content; padding: 8px; display: flex; gap: 16px; flex-direction: column;');
  await setAttribute('#container', 'class', 'dx-theme-generic-typography');

  const stylingModes = ['text', 'outlined', 'contained'];

  await Promise.all(stylingModes.map((mode) => appendElementTo('#container', 'div', `buttongroup-${mode}`, {})));
  await Promise.all(stylingModes.map((stylingMode) => createWidget('dxButtonGroup', {
    items,
    stylingMode,
    selectionMode: 'none',
  }, `#buttongroup-${stylingMode}`)));
});

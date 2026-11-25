import type { ButtonType, Item } from 'devextreme/ui/button_group';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

const typedItems: Item[] = ['danger', 'default', 'normal', 'success'].map((type: ButtonType) => ({ type, text: type }));
const iconItems: Item[] = [
  { icon: 'find', text: 'find' },
  { icon: 'find' },
];
const items: Item[] = [
  ...typedItems,
  ...iconItems,
];

test.describe('ButtonGroup', () => {
  test('ButtonGroup styling', async ({ page }) => {
    await setStyleAttribute(page, '#container', 'width: fit-content; padding: 8px; display: flex; gap: 16px; flex-direction: column;');
    await setAttribute(page, '#container', 'class', 'dx-theme-generic-typography');

    const stylingModes = ['text', 'outlined', 'contained'];

    await Promise.all(stylingModes.map((mode) => appendElementTo(page, '#container', 'div', `buttongroup-${mode}`)));
    await Promise.all(stylingModes.map((stylingMode) => createWidget(page, 'dxButtonGroup', {
      items,
      stylingMode,
      selectionMode: 'none',
    }, `#buttongroup-${stylingMode}`)));

    await testScreenshot(page, 'ButtonGroup styling.png', { element: '#container' });
  });
});

import type { Item } from 'devextreme/ui/accordion';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';

test.describe('Accordion_common', () => {
  test('Accordion items render (T865742)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'accordion');
    await appendElementTo(page, '#container', 'div', 'accordion2');

    await setAttribute(page, '#container', 'style', 'display: flex; gap: 50px;');

    const items: Item[] = [
      { title: 'Some text 1', icon: 'coffee' },
      { title: 'Some text 2' },
      { title: 'Some text 3' },
    ];

    await createWidget(page, 'dxAccordion', { items, width: 500 }, '#accordion');
    await createWidget(page, 'dxAccordion', { items, rtlEnabled: true, width: 500 }, '#accordion2');

    await testScreenshot(page, 'Accordion items render.png', { element: '#container' });
  });

  test('Icon-only button should be rendered correctly (T851081)', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'accordion');

    await createWidget(page, 'dxAccordion', () => ({
      dataSource: [{}],
      itemTitleTemplate: () => ($('<div>') as any).dxButton({ icon: 'coffee' }),
    }), '#accordion');

    await testScreenshot(page, 'Accordion with icon-only button.png', { element: '#container' });
  });
});

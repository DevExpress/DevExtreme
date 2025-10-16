import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item } from 'devextreme/ui/accordion.d';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Accordion_common`
  .page(url(__dirname, '../../container.html'));

test('Accordion items render (T865742)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const screenshotName = 'Accordion items render.png';

  await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'accordion');
  await appendElementTo('#container', 'div', 'accordion2');

  await setAttribute('#container', 'style', 'display: flex; gap: 50px;');

  const items: Item[] = [
    { title: 'Some text 1', icon: 'coffee' },
    { title: 'Some text 2' },
    { title: 'Some text 3' },
  ];

  await createWidget('dxAccordion', { items, width: 500 }, '#accordion');
  return createWidget('dxAccordion', { items, rtlEnabled: true, width: 500 }, '#accordion2');
});

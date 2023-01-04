import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { screenshotTestFn, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/accordion.d';
import Accordion from '../../../model/accordion';

fixture.disablePageReloads`Accordion_common`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((rtlEnabled) => {
  test('Accordion items render (T865742)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const accordion = new Accordion('#container');

    const screenshotName = `Accordion items render rtl=${rtlEnabled}.png`;

    if (!isMaterial()) {
      await screenshotTestFn(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.dark');
      await screenshotTestFn(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.contrast');
    }

    await screenshotTestFn(t, takeScreenshot, screenshotName, '#container', true, async () => {
      await accordion.repaint();
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const items = [
      { title: 'Some text 1', icon: 'coffee' },
      { title: 'Some text 2' },
      { title: 'Some text 3' },
    ] as Item[];

    return createWidget('dxAccordion', { items, rtlEnabled });
  });
});

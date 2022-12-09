import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/accordion.d';
import Accordion from '../../../model/accordion';

fixture.disablePageReloads`Accordion_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(() => disposeWidgets());

[true, false].forEach((rtlEnabled) => {
  test('Accordion items render (T865742)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const accordion = new Accordion('#container');

    const screenshotName = `Accordion items render rtl=${rtlEnabled}.png`;

    await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', true, async () => {
      await accordion.repaint();
    });

    await accordion.repaint();

    if (!isMaterial()) {
      await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.dark');
      await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.contrast');
    }

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

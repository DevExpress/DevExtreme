import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import { Item } from '../../../../../js/ui/accordion.d';

fixture.disablePageReloads`Accordion_common`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((rtlEnabled) => {
  test('Accordion items render (T865742)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await takeScreenshotInTheme(t, takeScreenshot, `Accordion items render rtl=${rtlEnabled}.png`, '#container', true);

    await changeTheme('generic.dark');

    await takeScreenshotInTheme(t, takeScreenshot, `Accordion items render rtl=${rtlEnabled}.png`, '#container', true, undefined, 'generic.dark');

    await changeTheme('generic.contrast');

    await takeScreenshotInTheme(t, takeScreenshot, `Accordion items render rtl=${rtlEnabled}.png`, '#container', true, undefined, 'generic.contrast');

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

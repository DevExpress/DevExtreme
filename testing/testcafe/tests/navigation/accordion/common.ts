import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/accordion.d';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Accordion_common`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((rtlEnabled) => {
  test(`Accordion_items, rtlEnabled: ${rtlEnabled} (T865742)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .expect(await takeScreenshot(`Accordion_items,rtl=${rtlEnabled}${getThemePostfix()}.png`, '#container'))
      .ok()
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

// eslint-disable-next-line max-len
// ['generic.light', 'generic.dark', 'generic.contrast', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
//   [true, false].forEach((rtlEnabled) => {
//     // T865742
//     test(`Accordion_items,theme=${theme}, rtlEnabled: ${rtlEnabled}`, async (t) => {
//       const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//       await t
// eslint-disable-next-line max-len
//         .expect(await takeScreenshot(`Accordion_items,theme=${theme.replace(/\./g, '-')},rtl=${rtlEnabled}.png`, '#container'))
//         .ok()
//         .expect(compareResults.isValid())
//         .ok(compareResults.errorMessages());
//     }).before(async () => {
//       await changeTheme(theme);

//       const items = [
//         { title: 'Some text 1', icon: 'coffee' },
//         { title: 'Some text 2' },
//         { title: 'Some text 3' },
//       ] as Item[];

//       return createWidget('dxAccordion', { items, rtlEnabled });
//     }).after(async () => {
//       await changeTheme('generic.light');
//     });
//   });
// });

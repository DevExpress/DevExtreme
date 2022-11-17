import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/tabs.d';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`Tabs_common`
  .page(url(__dirname, '../../container.html'));

test('Tabs icon alignment', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t
    .expect(await takeScreenshot(`Tabs_items_alignment${getThemePostfix()}.png`, '#container'))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource = [
    { text: 'user' },
    { text: 'comment', icon: 'comment' },
    { icon: 'user' },
    { icon: 'money' },
  ] as Item[];

  return createWidget('dxTabs', { dataSource });
});

// eslint-disable-next-line max-len
// ['generic.light', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
//   test(`Tabs icon alignment,theme=${theme}`, async (t) => {
//     const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//     await t
// eslint-disable-next-line max-len
//       .expect(await takeScreenshot(`Tabs_items_alignment_,theme=${theme.replace(/\./g, '-')}.png`, '#container'))
//       .ok()
//       .expect(compareResults.isValid())
//       .ok(compareResults.errorMessages());
//   }).before(async () => {
//     await changeTheme(theme);

//     const dataSource = [
//       { text: 'user' },
//       { text: 'comment', icon: 'comment' },
//       { icon: 'user' },
//       { icon: 'money' },
//     ] as Item[];

//     return createWidget('dxTabs', { dataSource });
//   }).after(async () => {
//     await changeTheme('generic.light');
//   });

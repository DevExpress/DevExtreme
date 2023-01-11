import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { changeTheme } from '../../../../helpers/changeTheme';
import { setClassAttribute, removeClassAttribute } from '../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { products } from './data.js';

const materialWrapperClasses = [
  'dx-viewport',
  'dx-theme-material',
  'dx-theme-material-typography',
  'dx-color-scheme-blue-dark',
].join(' ');

fixture`T1138605-TreeView`
  .page(url(__dirname, '../../../container.html'));

// T1138605
['material.blue.dark', 'material.blue.dark.compact'].forEach((theme) => {
  test(`TreeView ${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const scrollableContainer = Selector('.dx-scrollable-container');
    await t.scroll(scrollableContainer, 'bottom');

    await t
      .expect(await takeScreenshot(`T1138605-${theme}.png`, Selector('#container')))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await setClassAttribute(Selector('body'), materialWrapperClasses);
    await changeTheme(theme);

    return createWidget('dxTreeView', {
      height: 350,
      items: products,
      searchEnabled: true,
    });
  }).after(async () => {
    await changeTheme('generic.light');
    await removeClassAttribute(Selector('body'), materialWrapperClasses);
  });
});

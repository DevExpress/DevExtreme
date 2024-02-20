import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import DateBox from '../../../model/dateBox';
import asyncForEach from '../../../helpers/asyncForEach';
import { createWidget } from '../../../helpers/createWidget';
import { isMaterialBased, testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`DateBox`
  .page(url(__dirname, '../../container.html'));

const TIME_TO_WAIT = 1500;
const ITEM_HEIGHT = 40;

if (!isMaterialBased()) {
  [[11, 12, 1925], [10, 23, 2001]].forEach(([month, day, year]) => {
    test(`Rollers should be scrolled correctly when value is changed to ${day}/${month}/${year} using kbn and valueChangeEvent=keyup (T948310)`, async (t) => {
      const dateBox = new DateBox('#container');
      const { dropDownEditorButton } = dateBox;

      await t
        .click(dropDownEditorButton)
        .wait(TIME_TO_WAIT);

      await t
        .click(DateBox.getDoneButton())
        .wait(TIME_TO_WAIT);

      await t
        .typeText(dateBox.input, `${month}${day}${year}`);

      await t
        .click(dropDownEditorButton)
        .wait(TIME_TO_WAIT);

      const views = {
        month: month - 1,
        day: day - 1,
        year: year - 1900,
      };
      await asyncForEach(Object.keys(views), async (viewName) => {
        const scrollTop = await DateBox.getRollerScrollTop(viewName);

        await t
          .expect(scrollTop)
          // eslint-disable-next-line no-nested-ternary
          .eql(views[viewName] * ITEM_HEIGHT, `${viewName} view is scrolled correctly`);
      });
    }).before(async () => createWidget('dxDateBox', {
      pickerType: 'rollers',
      openOnFieldClick: false,
      useMaskBehavior: true,
      valueChangeEvent: 'keyup',
    }));
  });
}

test('DateBox with datetime and root element as container (T1193495)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'DateBox with datetime and root element as container.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDateBox', {
  value: new Date(2022, 10, 23, 17, 23),
  type: 'datetime',
  pickerType: 'calendar',
  opened: true,
  width: 300,
  dropDownOptions: {
    container: '#container',
  },
}, '#container'));

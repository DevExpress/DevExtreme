import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DateBox from 'devextreme-testcafe-models/dateBox';
import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import asyncForEach from '../../../helpers/asyncForEach';
import { createWidget } from '../../../helpers/createWidget';
import { isMaterialBased, testScreenshot } from '../../../helpers/themeUtils';
import { Themes } from '../../../helpers/themes';

fixture.disablePageReloads`DateBox`
  .page(url(__dirname, '../../container.html'));

const ITEM_HEIGHT = 40;

const TIME_VIEW_FIELD_CLASS = 'dx-timeview-field';
const SELECT_BOX_CONTAINER_CLASS = 'dx-selectbox-container';

if (!isMaterialBased()) {
  [[11, 12, 1925], [10, 23, 2001]].forEach(([month, day, year]) => {
    test(`Rollers should be scrolled correctly when value is changed to ${day}/${month}/${year} using kbn and valueChangeEvent=keyup (T948310)`, async (t) => {
      const dateBox = new DateBox('#container');
      const { dropDownEditorButton } = dateBox;

      await t
        .click(dropDownEditorButton);

      await t
        .click(DateBox.getDoneButton());

      await t
        .typeText(dateBox.input, `${month}${day}${year}`);

      await t
        .click(dropDownEditorButton);

      const views = {
        month: month - 1,
        day: day - 1,
        year: year - 1900,
      };
      await asyncForEach(Object.keys(views), async (viewName) => {
        const scrollTop = await DateBox.getRollerScrollTop(viewName);

        await t
          .expect(scrollTop)
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

test.meta({ themes: [Themes.materialBlue, Themes.genericLight] })('DateBox with datetime and opened AM/PM select (T1312677, T1327616)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const timeViewSelect = Selector(`#container .${TIME_VIEW_FIELD_CLASS} .${SELECT_BOX_CONTAINER_CLASS}`);

  await t
    .click(timeViewSelect);

  await testScreenshot(
    t,
    takeScreenshot,
    'DateBox with datetime and opened AMPM select.png',
    { element: '#container' },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxDateBox', {
  value: new Date(2022, 10, 23, 17, 23),
  type: 'datetime',
  pickerType: 'calendar',
  opened: true,
  dropDownOptions: {
    container: '#container',
  },
}, '#container'));

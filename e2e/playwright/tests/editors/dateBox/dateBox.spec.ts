import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import DateBox from '../../../models/dateBox';

const ITEM_HEIGHT = 40;

const TIME_VIEW_FIELD_CLASS = 'dx-timeview-field';
const SELECT_BOX_CONTAINER_CLASS = 'dx-selectbox-container';

test.describe('DateBox', () => {
  test.describe(() => {
    test.use({ theme: 'generic.light' });

    [[11, 12, 1925], [10, 23, 2001]].forEach(([month, day, year]) => {
      test(`Rollers should be scrolled correctly when value is changed to ${day}/${month}/${year} using kbn and valueChangeEvent=keyup (T948310)`, async ({ page }) => {
        await createWidget(page, 'dxDateBox', {
          pickerType: 'rollers',
          openOnFieldClick: false,
          useMaskBehavior: true,
          valueChangeEvent: 'keyup',
        });

        const dateBox = new DateBox(page, '#container');
        const { dropDownEditorButton } = dateBox;

        await dropDownEditorButton.click();

        await dateBox.getDoneButton().click();

        await dateBox.input.pressSequentially(`${month}${day}${year}`);

        await dropDownEditorButton.click();

        const views = {
          month: month - 1,
          day: day - 1,
          year: year - 1900,
        };

        for (const viewName of Object.keys(views)) {
          await expect.poll(
            () => dateBox.getRollerScrollTop(viewName),
            `${viewName} view is scrolled correctly`,
          ).toBe(views[viewName] * ITEM_HEIGHT);
        }
      });
    });
  });

  test('DateBox with datetime and root element as container (T1193495)', async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      value: new Date(2022, 10, 23, 17, 23),
      type: 'datetime',
      pickerType: 'calendar',
      opened: true,
      width: 300,
      dropDownOptions: {
        container: '#container',
      },
    }, '#container');

    await testScreenshot(
      page,
      'DateBox with datetime and root element as container.png',
      { element: '#container', withOverflow: true },
    );
  });

  test('DateBox with datetime and opened AM/PM select (T1312677, T1327616)', {
    tag: ['@material.blue.light', '@generic.light', '@fluent.blue.light'],
  }, async ({ page }) => {
    await createWidget(page, 'dxDateBox', {
      value: new Date(2022, 10, 23, 17, 23),
      type: 'datetime',
      pickerType: 'calendar',
      opened: true,
      applyValueMode: 'instantly',
      dropDownOptions: {
        container: '#container',
      },
    }, '#container');

    const timeViewSelect = page.locator(`#container .${TIME_VIEW_FIELD_CLASS} .${SELECT_BOX_CONTAINER_CLASS}`);

    await timeViewSelect.click();

    await testScreenshot(
      page,
      'DateBox with datetime and opened AMPM select.png',
      { element: '#container', withOverflow: true },
    );
  });
});

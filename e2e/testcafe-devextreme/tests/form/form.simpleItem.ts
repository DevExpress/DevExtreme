import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

[false, true].forEach((rtlEnabled) => {
  ['left', 'right', 'top'].forEach((labelLocation) => {
    [1, 2, 3].forEach((colCount) => {
      [1, 2, 3, 4, 5, 6].forEach((itemsCount) => {
        const testName = `SimpleItem,rtl_${rtlEnabled},location_${labelLocation},cCount_${colCount},itemsCount_${itemsCount}`;
        test(testName, async (t) => {
          const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

          await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

          await t
            .expect(compareResults.isValid())
            .ok(compareResults.errorMessages());
        }).before(async () => {
          await waitFont();

          return createWidget('dxForm', {
            width: 500,
            colCount,
            rtlEnabled,
            labelLocation,
            items: Array(itemsCount).fill(null).map((_, i) => ({ dataField: `item_${i + 1}` })),
          });
        });
      });
    });
  });
});

['left', 'right', 'top'].forEach((labelLocation) => {
  test('widget alignment (T1086611)', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `Form with labelLocation=${labelLocation}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await waitFont();

    return createWidget('dxForm', {
      labelLocation,
      colCount: 2,
      width: 1000,
      formData: {},
      items: [{
        dataField: 'FirstName',
        editorType: 'dxTextBox',
      }, {
        dataField: 'Position',
        editorType: 'dxSelectBox',
      }, {
        dataField: 'BirthDate',
        editorType: 'dxDateBox',
      }, {
        dataField: 'Notes',
        editorType: 'dxTextArea',
      }],
    });
  });
});

[() => 'xs', () => 'md', () => 'lg'].forEach((screenByWidth) => {
  const testName = `Form item padding with screenByWidth=${screenByWidth()}`;
  test(`${testName} (T1088451)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await waitFont();

    await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxForm', {
    screenByWidth,
    width: 1000,
    formData: {},
    items: [
      'Name1', 'Name2',
      {
        itemType: 'group',
        items: [
          {
            itemType: 'group',
            items: [
              {
                itemType: 'group',
                items: [
                  {
                    itemType: 'group',
                    colCount: 2,
                    items: [
                      {
                        dataField: 'Name3',
                      },
                      {
                        dataField: 'Name4',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        itemType: 'group',
        items: [
          {
            itemType: 'group',
            items: [
              {
                itemType: 'group',
                items: [
                  {
                    itemType: 'group',
                    colCount: 2,
                    items: [
                      {
                        itemType: 'group',
                        colCount: 2,
                        items: ['Name7', 'Name8'],
                      },
                      {
                        itemType: 'group',
                        colCount: 2,
                        items: ['Name9', 'Name10'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      'Name11', 'Name12',
    ],
  }));
});

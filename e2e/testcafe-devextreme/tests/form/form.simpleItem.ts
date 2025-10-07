import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { addCaptionTo, appendElementTo, setAttribute } from '../../helpers/domUtils';

const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`Form`
  .page(url(__dirname, '../container.html'));

[false, true].forEach((rtlEnabled) => {
  [1, 2, 3, 4, 5, 6].forEach((itemsCount) => {
    const testName = `colCount,rtl_${rtlEnabled},itemsCount_${itemsCount}`;
    test(testName, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await testScreenshot(t, takeScreenshot, `${testName}.png`, { element: '#container' });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await waitFont();
      const containerStyle = `
          display: grid; 
          grid-template-columns: repeat(3, 300px); 
          grid-template-rows: 0px auto; 
          grid-auto-flow: column;
          grid-gap: 30px; 
          width: 960px;`;
      await setAttribute('#container', 'style', containerStyle);

      for (let colCount = 1; colCount <= 3; colCount += 1) {
        const formId = `form${colCount + 1}`;

        await appendElementTo('#container', 'div', formId);
        await addCaptionTo(`#${formId}`, `colCount = ${colCount}`);

        const formOptions = {
          colCount,
          rtlEnabled,
          labelMode: 'static',
          items: Array(itemsCount).fill(null).map((_, i) => ({ dataField: `item_${i + 1}` })),
        };

        await createWidget('dxForm', formOptions, `#${formId}`);
      }
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

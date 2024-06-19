import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { makeRowsViewTemplatesAsync } from '../helpers/asyncTemplates';

fixture
  .disablePageReloads`Keyboard Navigation - editOnKeyPress`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

[
  { name: 'input', template: () => $('<input>') },
  { name: 'div', template: () => $('<div>').text('Hi, I\'m the template!') },
].forEach(({ name, template }) => {
  test(`should render edit cell template without errors, template: ${name}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
    const dataCell = dataGrid.getDataCell(0, 0);

    await t.click(dataCell.element)
      .pressKey('f');

    await takeScreenshot(
      `edit-cell-keypress-with-custom-cell-template_template-${name}.png`,
      dataGrid.element,
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxDataGrid', {
      dataSource: [
        {
          data_A: 'data_A',
          data_B: 'data_B',
        },
      ],
      columns: [
        {
          dataField: 'data_A',
          editCellTemplate: template,
        },
        'data_B',
      ],
      keyboardNavigation: {
        enabled: true,
        editOnKeyPress: true,
        enterKeyDirection: 'column',
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        startEditAction: 'dblClick',
      },
      // @ts-expect-error private option
      templatesRenderAsynchronously: true,
    });
    await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR);
  });
});

test('Focused cell should not flick (T1206435)', async (t) => {
  type TestWindow = (typeof window) & {
    counter?: number;
  };

  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstCell = dataGrid.getDataCell(0, 0).element;
  const secondCell = dataGrid.getDataCell(1, 0).element;
  const getFocusEventCount = ClientFunction(
    () => (window as TestWindow).counter,
  );

  await ClientFunction(() => {
    const testWindow = window as TestWindow;
    testWindow.counter = 0;
    (secondCell() as any as HTMLElement).addEventListener('focusin', () => {
      testWindow.counter! += 1;
    });
  }, {
    dependencies: { secondCell },
  })();

  await t.click(firstCell);

  await t.pressKey('M');
  await t.pressKey('enter');

  await t.expect(secondCell.focused).ok();

  const focusEventCount = await getFocusEventCount();
  await t.expect(focusEventCount).eql(1);

  await ClientFunction(() => {
    delete (window as TestWindow).counter;
  })();
}).before(async () => {
  await createWidget('dxDataGrid', () => {
    const data = [
      { value: 'data' },
      { value: 'data' },
    ];
    return {
      dataSource: new (window as any).DevExpress.data.CustomStore({
        load() {
          return Promise.resolve(data);
        },
        update() {
          return new Promise<void>((res) => {
            setTimeout(() => {
              res();
            }, 100);
          });
        },
      }),
      keyboardNavigation: {
        enabled: true,
        editOnKeyPress: true,
        enterKeyAction: 'moveFocus',
        enterKeyDirection: 'column',
      },
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowAdding: true,
        startEditAction: 'dblClick',
        refreshMode: 'reshape',
      },
      repaintChangesOnly: true,
    };
  });
});

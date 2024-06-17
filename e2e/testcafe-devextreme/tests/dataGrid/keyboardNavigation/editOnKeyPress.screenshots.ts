/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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

test('Focused cell should not flick', async (t) => {
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const firstCell = dataGrid.getDataCell(0, 0).element;
  const secondCell = dataGrid.getDataCell(1, 0).element;
  await t.click(firstCell);
  await t.click(secondCell);

  await ClientFunction(() => {
    // @ts-expect-error
    window.counter = 0;
    (secondCell() as any as HTMLElement).addEventListener('focusin', () => {
      // @ts-expect-error
      window.counter += 1;
    });
  }, {
    dependencies: { secondCell },
  })();

  await t.pressKey('M');
  await t.pressKey('enter');

  const focusEventCount = await ClientFunction(
    // @ts-expect-error
    () => window.counter,
  )();

  await t.expect(focusEventCount).eql(1);
}).before(async () => {
  await createWidget('dxDataGrid', {
    dataSource: [
      {
        value: 'data',
      },
      {
        value: 'data',
      },
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
  });
  await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR);
});

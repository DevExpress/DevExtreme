import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
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
      renderAsync: false,
      templatesRenderAsynchronously: true,
    });
    await makeRowsViewTemplatesAsync(DATA_GRID_SELECTOR);
  });
});

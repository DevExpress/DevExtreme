import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';

fixture
  .disablePageReloads`Keyboard Navigation - command buttons`
  .page(url(__dirname, '../../../container.html'));

const DATA_GRID_SELECTOR = '#container';

const createDataGrid = async () => createWidget('dxDataGrid', {
  dataSource: [{ id: 1 }],
  columns: ['id', {
    type: 'buttons',
    buttons: [{
      text: 'custom',
      hint: 'custom',
      disabled: true,
    }, 'edit'],
  }],
  editing: {
    allowUpdating: true,
  },
  height: 1000,
});

const scrollY = ClientFunction((position: number) => {
  window.scroll({ top: position });
});

const getScrollY = ClientFunction(() => window.scrollY);

test('should not scroll down on Space key', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const cellNavigationStart = dataGrid.getDataCell(0, 0);
  const commandButtonCell = dataGrid.getDataCell(0, 1);
  const disabledButton = commandButtonCell.getIconByTitle('custom');
  const editButton = commandButtonCell.getLinkEdit();

  // act
  await t
    .click(cellNavigationStart.element)
    .pressKey('tab');

  // assert
  await t.expect(disabledButton.focused).ok();
  await t.expect(getScrollY()).eql(0);

  // act
  await t.pressKey('space');

  // assert
  await t.expect(getScrollY()).eql(0);

  // act
  await t.pressKey('tab');

  // assert
  await t.expect(editButton.focused).ok();

  // act
  await t.pressKey('space');

  // assert
  await t.expect(getScrollY()).eql(0);
}).before(async () => createDataGrid());

test('should not scroll to the top of the page on Enter key if disabled', async (t) => {
  // arrange
  const dataGrid = new DataGrid(DATA_GRID_SELECTOR);
  const cellNavigationStart = dataGrid.getDataCell(0, 0);
  const commandButtonCell = dataGrid.getDataCell(0, 1);
  const disabledButton = commandButtonCell.getIconByTitle('custom');

  // act
  await t
    .click(cellNavigationStart.element)
    .pressKey('tab');

  // assert
  await t.expect(disabledButton.focused).ok();
  await t.expect(getScrollY()).eql(0);

  // act
  await scrollY(200);

  // assert
  await t.expect(getScrollY()).eql(200);

  // act
  await t.pressKey('enter');

  // assert
  await t.expect(getScrollY()).eql(200);
}).before(async () => createDataGrid());

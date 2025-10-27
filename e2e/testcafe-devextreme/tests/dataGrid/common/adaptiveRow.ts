import DataGrid from 'devextreme-testcafe-models/dataGrid';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Adaptive Row`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Should be shown and hidden when the window is resized', async (t) => {
  const dataGrid = new DataGrid('#container');
  await dataGrid.isReady();

  const adaptiveButton = dataGrid.getAdaptiveButton();
  await t.expect(adaptiveButton.exists).ok();
  await t.click(adaptiveButton);

  await t.expect(dataGrid.getAdaptiveRow(0).element.exists).ok();

  await t.resizeWindow(1200, 400);

  await t.expect(dataGrid.isAdaptiveColumnHidden()).ok();
  await t.expect(dataGrid.getAdaptiveRow(0).element.exists).notOk();
}, [400, 400]).before(async () => createWidget('dxDataGrid', {
  dataSource: [{
    ID: 1,
    Head_ID: -1,
    Full_Name: 'John Heart',
    Prefix: 'Mr.',
    Title: 'CEO',
    City: 'Los Angeles',
    State: 'California',
    Email: 'jheart@dx-email.com',
    Skype: 'jheart_DX_skype',
    Mobile_Phone: '(213) 555-9392',
    Birth_Date: '1964-03-16',
    Hire_Date: '1995-01-15',
  }],
  keyExpr: 'ID',
  allowColumnResizing: true,
  rowDragging: {
    allowDropInsideItem: true,
    allowReordering: true,
  },
  columns: [
    {
      dataField: 'Title',
      caption: 'Position',
      hidingPriority: 0,
      fixed: true,
    },
    { dataField: 'Full_Name', hidingPriority: 1 },
    { dataField: 'City', hidingPriority: 2 },
    { dataField: 'State', hidingPriority: 3 },
    { dataField: 'Mobile_Phone', hidingPriority: 4 },
    { dataField: 'Hire_Date', dataType: 'date', hidingPriority: 5 },
  ],
}));
